import {OrchyStorageClearEvent, OrchyStorageDeleteEvent, OrchyStorageGetEvent, OrchyStorageGetResultEvent, OrchyStoragePostEvent} from './StorageEvent'
export declare const getResultEventBuilder: (key: any, value: any) => OrchyStorageGetResultEvent
export declare const eventsBuilder: {
    get: (key: any) => OrchyStorageGetEvent;
    post: (key: any, value: any) => OrchyStoragePostEvent;
    delete: (key: any) => OrchyStorageDeleteEvent;
    clear: () => OrchyStorageClearEvent;
}
