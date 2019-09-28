import {changeUrlSearch, getStateOnMount} from './utilities';

beforeAll(() => {
	delete global.window.location;
	delete global.window.history;

	global.window = Object.create(window);

	const defaultWindow = {
		protocol: 'https:',
		host: 'abc.com',
		pathname: '/123/567',
	};

	global.window.location = {
		...defaultWindow,
		search: '',
	};

	const parseUrl = url => {
		const splitProtocol = url.split(':');
		const splitHost = splitProtocol[1].split('//')[1];
		const splitPath = splitHost.split('/');
		const splitSearch = splitPath
			.slice(1)
			.join('/')
			.split('?');
		return {
			protocol: `${splitProtocol[0]}:`,
			host: splitPath[0],
			pathname: `/${splitSearch[0]}`,
			search: splitSearch[1] ? `?${splitSearch[1]}` : '',
		};
	};

	global.window.history = {
		pushState: ({path}) => {
			const {protocol, host, pathname, search} = parseUrl(path);
			global.window.location = {protocol, host, pathname, search};
		},
	};
});

describe('Utilities functions', () => {
	it('changeUrlSearch() works for an already empty search', () => {
		global.window.location = {
			...global.window.location,
			search: '',
		};
		changeUrlSearch('someState', 'someKey');
		expect(window.location).toEqual({
			...global.window.location,
			search: '?someKey=someState',
		});
	});

	it('changeUrlSearch() works for an already non-empty search', () => {
		global.window.location = {
			...global.window.location,
			search: '?someOtherKey=someOtherState',
		};
		changeUrlSearch('someState', 'someKey');
		expect(window.location).toEqual({
			...global.window.location,
			search: '?someKey=someState&someOtherKey=someOtherState',
		});
	});

	it('changeUrlSearch() works for an already non-empty search with the same key', () => {
		global.window.location = {
			...global.window.location,
			search: '?someKey=someState&someOtherKey=someOtherState',
		};
		changeUrlSearch('someNEWState', 'someKey');
		expect(window.location).toEqual({
			...global.window.location,
			search: '?someKey=someNEWState&someOtherKey=someOtherState',
		});
	});

	it('getStateOnMount() works with no already current search and with no possible states given', () => {
		global.window.location = {
			...global.window.location,
			search: '',
		};
		expect(getStateOnMount('defaultState', 'key')).toEqual('defaultState');
	});

	it('getStateOnMount() works with an already current search and with no possible states given', () => {
		global.window.location = {
			...global.window.location,
			search: '?key=someState',
		};
		expect(getStateOnMount('defaultState', 'key')).toEqual('someState');
	});

	it('getStateOnMount() works with no already current search and with possible states given', () => {
		global.window.location = {
			...global.window.location,
			search: '',
		};
		expect(
			getStateOnMount('defaultState', 'key', ['state1', 'state2']),
		).toEqual('defaultState');
	});

	it('getStateOnMount() works with a valid already current search and with possible states given', () => {
		global.window.location = {
			...global.window.location,
			search: '?key=state1',
		};
		expect(
			getStateOnMount('defaultState', 'key', ['state1', 'state2']),
		).toEqual('state1');
	});

	it('getStateOnMount() works with a invalid already current search and with possible states given', () => {
		global.window.location = {
			...global.window.location,
			search: '?key=invalidState',
		};
		expect(
			getStateOnMount('defaultState', 'key', ['state1', 'state2']),
		).toEqual('defaultState');
		expect(global.window.location).toEqual({
			...global.window.location,
			search: '',
		});
	});
});
