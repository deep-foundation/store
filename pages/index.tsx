import React from 'react';
import Head from 'next/head';

import { QueryStoreProvider, useQueryStore } from '@deepcase/store/query';
import { CookiesStoreProvider, useCookiesStore } from '@deepcase/store/cookies';
import { LocalStoreProvider, useLocalStore } from '@deepcase/store/local';
import { CapacitorStoreProvider, useCapacitorStore } from '@deepcase/store/capacitor';

import { IUseStore } from '@deepcase/store/store';

export function ContentQuery() {
  const [value, setValue, unsetValue] = useQueryStore('demo', 5);
  return <>
    <div>const [value, setValue, unsetValue] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
}

export function ContentQueryListener() {
  const [value, setValue, unsetValue] = useQueryStore('demo', 5);
  return <>
    <div>const [value] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
}

export function ContentCookies() {
  const [value, setValue, unsetValue] = useCookiesStore('demo', 5);
  return <>
    <div>const [value, setValue, unsetValue] = useCookiesStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
}

export function ContentCookiesListener() {
  const [value, setValue, unsetValue] = useCookiesStore('demo', 5);
  return <>
    <div>const [value] = useCookiesStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
}

export function ContentLocal() {
  const [value, setValue, unsetValue] = useLocalStore('demo', 5);
  return <>
    <div>const [value, setValue, unsetValue] = useLocalStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
}

export function ContentLocalListener() {
  const [value, setValue, unsetValue] = useLocalStore('demo', 5);
  return <>
    <div>const [value] = useLocalStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
}

export function ContentCapacitor() {
  const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);
  return <>
    <div>const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
}

export function ContentCapacitorListener() {
  const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);
  return <>
    <div>const [value] = useCapacitorStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
}

export function useToken() {
  return useCookiesStore('my-token-key', 0);
}
export function ContentToken() {
  const [token, setToken, unsetToken] = useToken();
  return <>
    <b>prepare storess</b>
    <div>{`export function useToken() { return useCookiesStore('my-token-key', 0); }`}</div>
    <div>{`const [token, setToken] = useToken();`}</div>
    <div>token == {token}</div>
    <button onClick={() => setToken(token - 1)}>-</button>
    <button onClick={() => setToken(token + 1)}>+</button>
    <button onClick={() => unsetToken()}>x</button>
  </>;
}


export interface IOptions <T>{
  (defaultValue: T): [T, (value: T) => any, () => any];
}
export const OptionsContext = React.createContext<IOptions<any>>((defaultValue: any) => [null, () => null, () => {}]);
export function OptionsProvider({ key, children }: { key: string; children: any }) {
  const useStore = React.useMemo(() => {
    return function useOptions(defualtValue) {
      return useQueryStore(key, defualtValue);
    };
  }, []);
  return <OptionsContext.Provider value={useStore}>{children}</OptionsContext.Provider>
}
export function useOptions(defualtValue: any) {
  return React.useContext(OptionsContext)(defualtValue);
}
export function ContentContextual1() {
  return <>
    <OptionsProvider key={'abc'}><ContentContextual2/></OptionsProvider>
  </>;
}
export function ContentContextual2() {
  const [options, setOptions] = useOptions({ x: 'y' });
  return <>
    <b>provide contextual stores</b>
    <div>{`const [options, setOptions] = useOptions({ x: 'y' });`}</div>
    <div>options == {JSON.stringify(options)}</div>
    <button onClick={() => setOptions({ x: 'z' })}>{`setOptions({ x: 'z' })`}</button>
    <button onClick={() => setOptions({ x: 'w' })}>{`setOptions({ x: 'w' })`}</button>
  </>;
}

let rerendered = 0;
export function Content() {
  return <>
    <div>page rerendered: {rerendered++}</div>
    <hr/>
    <div>store</div>
    <hr/>
    <ContentQuery/>
    <ContentQueryListener/>
    <hr/>
    <ContentCookies/>
    <ContentCookiesListener/>
    <hr/>
    <ContentLocal/>
    <ContentLocalListener/>
    <hr/>
    <ContentCapacitor/>
    <ContentCapacitorListener/>
    <hr/>
    <ContentToken/>
    <hr/>
    <ContentContextual1/>
  </>;
}

export const Providers = () => {
  return <QueryStoreProvider>
    <CookiesStoreProvider>
      <LocalStoreProvider>
        <CapacitorStoreProvider fetchInterval={5000}>
          <Content/>
        </CapacitorStoreProvider>
      </LocalStoreProvider>
    </CookiesStoreProvider>
  </QueryStoreProvider>;
};

export default function Index() {
  return (<div>
    <Providers/>
  </div>);
}
