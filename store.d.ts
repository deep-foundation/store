import { Context } from 'react';
export interface IUseStoreSetHandler<T> {
    (oldValue: T): T;
}
export interface IUseStore<T> {
    (key: string, defaultValue: T): {
        value: T;
        setValue: (value: (T | IUseStoreSetHandler<T>)) => any;
        unsetValue: () => any;
        isLoading?: boolean | undefined;
    };
}
export interface IStoreContext<T = any> {
    useStore: IUseStore<T>;
}
export declare const defaultContext: IStoreContext;
export declare const StoreContext: Context<IStoreContext<any>>;
export interface ISetKeyValue {
}
export declare function useStore<T>(key: string, defaultValue: T, context?: Context<IStoreContext>): ReturnType<IStoreContext['useStore']>;
