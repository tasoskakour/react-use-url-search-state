# react-use-url-search-state
> A React hook that saves/restores state to the url search (query) of the webpage.

[![CircleCI](https://circleci.com/gh/tasoskakour/react-use-url-search-state.svg?style=svg)](https://circleci.com/gh/tasoskakour/react-use-url-search-state) [![npm](https://img.shields.io/npm/v/react-use-url-search-state.svg?style=svg&logo=npm&label=)](https://www.npmjs.com/package/react-use-url-search-state) [![license](https://img.shields.io/github/license/tasoskakour/react-use-url-search-state.svg?style=svg)](./LICENSE)

### [Check out the example at CodeSandbox](https://codesandbox.io/s/divine-sea-5j2r9)

## Installation

Add `react-use-url-search-state` to your `package.json`.

```bash
$ npm install react-use-url-search-state

# or
$ yarn add react-use-url-search-state
```

You can now import the module and use it like

```javascript
import useUrlSearchState from 'react-use-url-search-state';
```

## Usage

The hook stores and restores state from the url search of the page. It's extremely useful if e.g you have a variable that holds the state of the currently selected tab `selectedTab: 1`. This will be saved to the url like: `http://abc.com/other/params/here?selectedTab=1`. Now when this link is visited externally the state will be loaded correctly to `selectedTab: 1`.

Consider the example below.

```javascript
import useUrlSearchState from 'react-use-url-search-state';

const Page = () => {
    const [tab, setTab] = useUrlSearchState('A','tab',['A','B','C']);

    return (
        <Tabs selectedTab={tab}>
            <Tab id="A"/>
            <Tab id="B"/>
            <Tab id="C"/>
        </Tabs>
    )
};
```

## Parameters

The hook takes 3 parameters: `useUrlSearchState(defaultState, key, possibleStates)`

- **defaultState**: The default/initial state.
- **key**: The key to save the state in the url search part of the page
- **possibleStates** (optional): An array of possible states. This will not allow any forceful invalid state (e.g user changing URL search by hand to invalid state) and always fallback to the `defaultState` provided if that happens.

## Meta

Tasos Kakouris – [@tasoskakour](https://tasoskakour.me) – tasoskakour@gmail.com

Distributed under the MIT license.

[https://github.com/tasoskakour/react-react-use-url-search-state](https://github.com/tasoskakour/react-react-use-url-search-state)

## Contributing

1. Fork it (<https://github.com/tasoskakour/react-react-use-url-search-state/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes using a semantic commit message.
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
