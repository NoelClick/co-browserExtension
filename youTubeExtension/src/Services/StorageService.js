import triggerEvent from '../utils/triggerEvent';

const constants = {
    STORAGE_KEY: 'youtube-extension-fake-storage',
    EVENTNAME: 'youtube-extension-storage-service-set',
};

/**
 * A wrapper for the storage interface to enable it for dev enviroment.
 * chrome.storage.local interface is only available in prd enviroment of options page.
 * This service provides a interface which saves the data in the localStorage
 */
export default class StorageService {
    constructor() {
        if (typeof document !== 'undefined') {
            this.useEvent = true;
            document.addEventListener(constants.EVENTNAME, this.onSetData.bind(this));
        } else {
            this.useEvent = false;
        }
    }

    onSetData({ detail }) {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set(detail);
        } else {
            const storedData = JSON.parse(localStorage.getItem(constants.STORAGE_KEY) || '{}');
            localStorage.setItem(constants.STORAGE_KEY, JSON.stringify({
                ...storedData,
                ...detail,
            }));
        }
    }

    set(obj) {
        if (this.useEvent) {
            triggerEvent(constants.EVENTNAME, obj);
        } else {
            this.onSetData({ detail: obj });
        }
    }

    get(keys) {
        if (chrome && chrome.storage && chrome.storage.local) {
            return new Promise(resolve => {
                chrome.storage.local.get(keys, resolve);
            });
        }

        const storedData = JSON.parse(localStorage.getItem(constants.STORAGE_KEY) || '{}');
        const result = Object.entries(keys).reduce((obj, [key, defaultValue]) => {
            obj[key] = key in storedData ? storedData[key] : defaultValue;
            return obj;
        }, {});
        return result;
    }
}