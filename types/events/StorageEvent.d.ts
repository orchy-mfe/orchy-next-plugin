export interface OrchyStorageGetEvent {
    label: 'orchy-storage:get';
    payload: {
        key: any;
        value?: any;
    };
}
export interface OrchyStoragePostEvent {
    label: 'orchy-storage:post';
    payload: {
        key: any;
        value: any;
    };
}
export interface OrchyStorageDeleteEvent {
    label: 'orchy-storage:delete';
    payload: {
        key: any;
        value?: any;
    };
}
export interface OrchyStorageClearEvent {
    label: 'orchy-storage:clear';
    payload?: undefined;
}
interface NonOrchyStorageEvent {
    label: undefined;
    payload: undefined;
}
export interface OrchyStorageGetResultEvent {
    label: 'orchy-storage:get:result';
    payload: {
        key: any;
        value: any;
    };
}
export type OrchyStorageEvent = OrchyStorageGetEvent | OrchyStorageGetResultEvent | OrchyStoragePostEvent | OrchyStorageDeleteEvent | OrchyStorageClearEvent | NonOrchyStorageEvent;
export {}
