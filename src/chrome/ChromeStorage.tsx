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
            if(changes[this.name]?.newValue) {
                //Listen to changes of the actual value
                const newValue = changes[this.name]?.newValue;
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
        console.log("Loading from storage:", json);
        const tempValue = json[this.name];
        // Use the provided function to determine if this value is really considered "null" from storage
        if(this.useDefaultFunc(tempValue)) {
            console.log("Loaded nothing from storage", this.name)
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

// class LocalLockedChromeStorage<T> implements StorageInterface<T>, ReadOnlyStorageInterface<T> {
//
//     readonly key: string;
//     readonly lockKey: string;
//
//     value: T;
//     useDefaultFunc: ((loadedValue: any) => boolean);
//
//     readonly defaultValue: T;
//
//     locked: boolean;
//
//     constructor(key: string, temporaryValue: T, defaultValue: T, useDefaultFunc: (loadedValue: any) => boolean) {
//         this.key = key;
//         this.lockKey = key+"Lock";
//
//         this.value = temporaryValue;
//
//         this.defaultValue = defaultValue;
//         this.useDefaultFunc = useDefaultFunc;
//
//         // Locked is always true until load is called
//         this.locked = true;
//
//         //chrome.storage.onChanged.addListener(this.listenForLockChange);
//     }
//
//     listenForLockChange = (changes: {[p: string]: chrome.storage.StorageChange}, area: AreaName) => {
//         // Only listen to local storage changes where a new value is saved
//         if (area === 'local') {
//             if(changes[this.lockKey]?.newValue) {
//                 //Listen to changes for the lock value
//                 const isLocked = changes[this.lockKey]?.newValue;
//                 this.locked = isLocked;
//             } else if(changes[this.key]?.newValue) {
//                 //Listen to changes of the actual value
//                 const newValue = changes[this.key]?.newValue;
//                 this.value = newValue;
//             }
//         }
//     }
//
//     get(): T {
//         return this.value;
//     }
//
//     async load(): Promise<StorageInterface<T>> {
//         //The first thing to do when we load is load the lock value
//
//         // @ts-ignore because we are loading the boolean lock value
//         const lockJson = await chrome.storage.local.get([this.lockKey])
//         //console.log("Loading from storage:", json);
//         let isLocked = lockJson[this.lockKey];
//         if(isLocked === null) {
//             // The lock has never existed so we will write a lock value (locked initially)
//             await this.writeLock(true);
//             // Then we write the default of the actual value
//             await this.writeValue(this.defaultValue);
//             this.value = this.defaultValue;
//             // Then we write that the lock has been released
//             await this.writeLock(false);
//             // Then we actually release the lock for us (or the storage listener releases it, either way)
//             this.locked = false;
//         } else {
//             // The lock did exist, so as long as it is locked we won't actually load a real value
//             while(isLocked) {
//                 // wait half a second
//                 await new Promise(r => setTimeout(r, 500));
//                 // @ts-ignore because we are loading the boolean lock value
//                 isLocked = await chrome.storage.local.get([this.lockKey])[this.lockKey];
//             }
//
//             // Now that it is unlocked we can load the value
//             await this.writeLock(true);
//
//             const valueJson = await chrome.storage.local.get([this.key])
//             const tempValue = valueJson[this.key];
//             if(this.useDefaultFunc(tempValue)) {
//                 await this.writeValue(this.defaultValue);
//                 this.value = this.defaultValue;
//             } else {
//                 this.value = tempValue;
//             }
//
//             await this.writeLock(false);
//             this.locked = false;
//         }
//         return this;
//     }
//
//     async writeLock(value: boolean): Promise<void> {
//         return await chrome.storage.local.set({[this.lockKey]: value})
//     }
//
//     async writeValue(value: T): Promise<void> {
//         return await chrome.storage.local.set({[this.key]: value})
//     }
//
//     set(value: T): Promise<void> {
//         return Promise.resolve(undefined);
//     }
//
//     update(value: T): StorageInterface<T> {
//         return undefined;
//     }
//
// }