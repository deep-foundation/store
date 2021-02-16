import React from 'react';
import Head from 'next/head';

import { QueryStoreProvider, useQueryStore } from '@deepcase/store/query';
import { CookiesStoreProvider, useCookiesStore } from '@deepcase/store/cookies';
import { LocalStoreProvider, useLocalStore } from '@deepcase/store/local';
import { CapacitorStoreProvider, useCapacitorStore } from '@deepcase/store/capacitor';

import { IUseStore } from '@deepcase/store/store';

import pckg from '../node_modules/@deepcase/store/package.json';

const counters = {
  page: 0,
  query: 0,
  queryListener: 0,
  cookies: 0,
  cookiesListener: 0,
  local: 0,
  localListener: 0,
  capacitor: 0,
  capacitorListener: 0,
  token: 0,
  contextual1: 0,
  contextual1Listener: 0,
  contextual2: 0,
  contextual2Listener: 0,
};
export const ContentQuery = React.memo<any>(function ContentQuery() {
  const [value, setValue, unsetValue] = useQueryStore('demo', 5);
  return <>
    <div><i>rerendered counter: {counters.query++}</i></div>
    <div>const [value, setValue, unsetValue] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
});

export const ContentQueryListener = React.memo<any>(function ContentQueryListener() {
  const [value, setValue, unsetValue] = useQueryStore('demo', 5);
  return <>
    <div><i>rerendered counter: {counters.queryListener++}</i></div>
    <div>const [value] = useQueryStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
});

export const ContentCookies = React.memo<any>(function ContentCookies() {
  const [value, setValue, unsetValue] = useCookiesStore('demo', 5);
  return <>
    <div><i>rerendered counter: {counters.cookies++}</i></div>
    <div>const [value, setValue, unsetValue] = useCookiesStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
});

export const ContentCookiesListener = React.memo<any>(function ContentCookiesListener() {
  const [value, setValue, unsetValue] = useCookiesStore('demo', 5);
  return <>
    <div><i>rerendered counter: {counters.cookiesListener++}</i></div>
    <div>const [value] = useCookiesStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
});

export const ContentLocal = React.memo<any>(function ContentLocal() {
  const [value, setValue, unsetValue] = useLocalStore('demo', 5);
  return <>
    <div><i>rerendered counter: {counters.local++}</i></div>
    <div>const [value, setValue, unsetValue] = useLocalStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
});

export const ContentLocalListener = React.memo<any>(function ContentLocalListener() {
  const [value, setValue, unsetValue] = useLocalStore('demo', 5);
  return <>
    <div><i>rerendered counter: {counters.localListener++}</i></div>
    <div>const [value] = useLocalStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
});

export const ContentCapacitor = React.memo<any>(function ContentCapacitor() {
  const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);
  return <>
    <div><i>rerendered counter: {counters.capacitor++}</i></div>
    <div>const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);</div>
    <div>value == {value}</div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <button onClick={() => setValue(value + 1)}>+</button>
    <button onClick={() => unsetValue()}>x</button>
  </>;
});

export const ContentCapacitorListener = React.memo<any>(function ContentCapacitorListener() {
  const [value, setValue, unsetValue] = useCapacitorStore('demo', 5);
  return <>
    <div><i>rerendered counter: {counters.capacitorListener++}</i></div>
    <div>const [value] = useCapacitorStore('demo', 5);</div>
    <div>value == {value}</div>
  </>;
});

export const useToken = function useToken() {
  return useCookiesStore('my-token-key', 0);
}
export const ContentToken = React.memo<any>(function ContentToken() {
  const [token, setToken, unsetToken] = useToken();
  return <>
    <b>prepare storess</b>
    <div><i>rerendered counter: {counters.token++}</i></div>
    <div>{`export function useToken() { return useCookiesStore('my-token-key', 0); }`}</div>
    <div>{`const [token, setToken] = useToken();`}</div>
    <div>token == {token}</div>
    <button onClick={() => setToken(token - 1)}>-</button>
    <button onClick={() => setToken(token + 1)}>+</button>
    <button onClick={() => unsetToken()}>x</button>
  </>;
});


export interface IOptions <T>{
  (defaultValue: T): [T, (value: T) => any, () => any];
}
export const OptionsContext = React.createContext<IOptions<any>>((defaultValue: any) => [null, () => null, () => {}]);
export const OptionsProvider = React.memo<any>(function OptionsProvider({ key, children }: { key: string; children: any }) {
  const useStore = React.useMemo(() => {
    return function useOptions(defualtValue) {
      return useQueryStore(key, defualtValue);
    };
  }, []);
  return <OptionsContext.Provider value={useStore}>{children}</OptionsContext.Provider>
});
export const useOptions = function useOptions(defualtValue: any) {
  return React.useContext(OptionsContext)(defualtValue);
}
export const ContentContextual1 = React.memo<any>(function ContentContextual1() {
  return <>
    <div><i>rerendered counter: {counters.contextual1++}</i></div>
    <OptionsProvider key={'abc'}><ContentContextual2/></OptionsProvider>
  </>;
});
export const ContentContextual2 = React.memo<any>(function ContentContextual2() {
  const [options, setOptions] = useOptions({ x: 'y' });
  return <>
    <b>provide contextual stores</b>
    <div><i>rerendered counter: {counters.contextual2++}</i></div>
    <div>{`const [options, setOptions] = useOptions({ x: 'y' });`}</div>
    <div>options == {JSON.stringify(options)}</div>
    <button onClick={() => setOptions({ x: 'z' })}>{`setOptions({ x: 'z' })`}</button>
    <button onClick={() => setOptions({ x: 'w' })}>{`setOptions({ x: 'w' })`}</button>
  </>;
});

export const Content = React.memo<any>(function Content() {
  return <>
    <b>{pckg.name}@{pckg.version}</b>
    <br/>
    <a href={pckg.homepage}>{pckg.homepage}</a>
    <br/>
    <a href="https://github.com/deepcase/store/blob/example/pages/index.tsx">example sources</a>
    <hr/>
    <div><i>rerendered counter: {counters.page++}</i></div>
    <hr/>
    <ContentQuery/>
    <hr/>
    <ContentQueryListener/>
    <hr/>
    <ContentCookies/>
    <hr/>
    <ContentCookiesListener/>
    <hr/>
    <ContentLocal/>
    <hr/>
    <ContentLocalListener/>
    <hr/>
    <ContentCapacitor/>
    <hr/>
    <ContentCapacitorListener/>
    <hr/>
    <ContentToken/>
    <hr/>
    <ContentContextual1/>
  </>;
});

export const Providers = React.memo<any>(function Providers() {
  return <QueryStoreProvider>
    <CookiesStoreProvider>
      <LocalStoreProvider>
        <CapacitorStoreProvider fetchInterval={5000}>
          <Content/>
        </CapacitorStoreProvider>
      </LocalStoreProvider>
    </CookiesStoreProvider>
  </QueryStoreProvider>;
});

export default function Index() {
  return (<div>
    <Providers/>
  </div>);
}
