export interface StorageInterface<T> {
    get() : T,
    load(): Promise<StorageInterface<T>>,
    set(value: T) : Promise<void>,
    update(value: T) : StorageInterface<T>
}

export function newLocalStorage<T>(name: string, defaultValue: T,  useDefaultFunc: ((loadedValue: any) => boolean) = (value) => value == null) : StorageInterface<T> {
    return new ChromeStorage<T>(name, defaultValue, useDefaultFunc);
}

class ChromeStorage<T> implements StorageInterface<T> {
    readonly name: string;
    readonly defaultValue: T;

    useDefaultFunc: ((loadedValue: any) => boolean);
    value: T;

    constructor(name: string, defaultValue: T, useDefaultFunc: ((loadedValue: any) => boolean)) {
        this.name = name;
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.useDefaultFunc = useDefaultFunc;
    }

    async load(): Promise<StorageInterface<T>> {
        // @ts-ignore
        const json = await chrome.storage.local.get([this.name])
        console.log("Loading from storage:", json);
        const tempValue = json[this.name];
        if(this.useDefaultFunc(tempValue)) {
            console.log("Loaded nothing from storage", this.name)
            await this.set(this.defaultValue);
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