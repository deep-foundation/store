import React, { Context, ReactNode } from 'react';
import { IStoreContext } from './store';
export declare const CapacitorStoreContext: React.Context<IStoreContext<any>>;
export declare const CapacitorStoreProvider: ({ context, children, fetchInterval, }: {
    context?: Context<IStoreContext>;
    children?: ReactNode;
    fetchInterval?: number;
}) => React.JSX.Element;
export declare function useCapacitorStore<T extends any>(key: string, defaultValue: T, context?: React.Context<IStoreContext<any>>): {
    value: any;
    setValue: (value: any) => any;
    unsetValue: () => any;
    isLoading?: boolean;
};
