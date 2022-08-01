export interface StorageInterface<T> {
    get() : T,
    load(): Promise<T>,
    set(value: T) : Promise<void>,
    update(value: T) : StorageInterface<T>
}

export function newLocalStorage<T>(name: string, defaultValue: T) : StorageInterface<T> {
    return new ChromeStorage<T>(name, defaultValue);
}

class ChromeStorage<T> implements StorageInterface<T> {
    readonly name: string;
    readonly defaultValue: T;

    value: T;

    constructor(name: string, defaultValue: T) {
        this.name = name;
        this.defaultValue = defaultValue;
        this.value = defaultValue;
    }

    async load(): Promise<T> {
        // @ts-ignore
        const json = await chrome.storage.local.get([this.name])
        console.log("Loading from storage:", json);
        this.value = json[this.name];
        return this.value
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