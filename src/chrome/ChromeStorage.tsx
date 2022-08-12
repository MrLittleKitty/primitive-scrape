import AreaName = chrome.storage.AreaName;

export interface ReadOnlyStorageInterface<T> {
    get(): T,
    load(): Promise<StorageInterface<T>>,
}

export interface StorageInterface<T> {
    get() : T,
    load(): Promise<StorageInterface<T>>,
    set(value: T) : Promise<void>,
    update(value: T) : StorageInterface<T>
}

export function newReadOnlyLocalStorage<T>(name: string, defaultValue: T, listenerChangedValue: (value: ReadOnlyStorageInterface<T>) => void,  useDefaultFunc: ((loadedValue: any) => boolean) = (value) => value == null) : ReadOnlyStorageInterface<T> {
    return new LocalChromeStorage<T>(name, defaultValue, listenerChangedValue, useDefaultFunc, false, true);
}

export function newLocalStorage<T>(name: string, defaultValue: T,  useDefaultFunc: ((loadedValue: any) => boolean) = (value) => value == null) : StorageInterface<T> {
    return new LocalChromeStorage<T>(name, defaultValue, null, useDefaultFunc, true, false);
}

class LocalChromeStorage<T> implements StorageInterface<T>, ReadOnlyStorageInterface<T> {
    readonly name: string;
    readonly defaultValue: T;
    readonly saveDefault: boolean

    listenerChangedValue: ((value: ReadOnlyStorageInterface<T>) => void)|null;

    useDefaultFunc: ((loadedValue: any) => boolean);
    value: T;

    constructor(name: string, defaultValue: T, listenerChangedValue: ((value: ReadOnlyStorageInterface<T>) => void)|null, useDefaultFunc: ((loadedValue: any) => boolean), saveDefault: boolean, registerListener: boolean) {
        this.name = name;
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.useDefaultFunc = useDefaultFunc;
        this.saveDefault = saveDefault;
        this.listenerChangedValue = listenerChangedValue;

        if(registerListener) {
            chrome.storage.onChanged.addListener(this.listener);
        }
    }

    listener = (changes: {[p: string]: chrome.storage.StorageChange}, area: AreaName) => {
        if (area === 'local') {
            if(changes[this.name]?.newValue || changes[this.name]?.oldValue) {
                //Listen to changes of the actual value
                const newValue = changes[this.name]?.newValue;
                console.log("Detected read only local storage update", this.name, newValue);
                this.value = newValue;

                if(this.listenerChangedValue != null) {
                    this.listenerChangedValue(this);
                }
            }
        }
    }

    async load(): Promise<StorageInterface<T>> {
        // @ts-ignore
        const json = await chrome.storage.local.get([this.name])
        const tempValue = json[this.name];
        // Use the provided function to determine if this value is really considered "null" from storage
        if(this.useDefaultFunc(tempValue)) {
            if(this.saveDefault) {
                await this.set(this.defaultValue);
            }
        } else {
            this.value = tempValue;
        }
        return this;
    }

    get(): T {
        return this.value;
    }

    async set(value: T): Promise<void> {
        this.value = value;
        return await chrome.storage.local.set({[this.name]: value})
    }

    update(value: T): StorageInterface<T> {
        this.value = value;
        chrome.storage.local.set({[this.name]: value})
        return this;
    }
}