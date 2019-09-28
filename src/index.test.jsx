/* eslint react/prop-types: 0 */
import React from 'react';
import {render, getByTestId, fireEvent} from 'react-testing-library';
import useUrlSearchState from './index.jsx';

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

const Container = ({defaultState, theKey, possibleStates}) => {
	const [state, setState] = useUrlSearchState(
		defaultState,
		theKey,
		possibleStates,
	);
	return (
		<div>
			<span data-testid="state">{state}</span>
			<button
				type="button"
				data-testid="setStateButton"
				onClick={() => setState('newState')}
			/>
		</div>
	);
};

describe('useUrlSearchState', () => {
	test('component mounts correctly', done => {
		const {container} = render(
			<Container defaultState="defaultState" theKey="key" />,
		);
		expect(container).toBeTruthy();
		const state = getByTestId(container, 'state');
		expect(state.textContent).toEqual('defaultState');
		setTimeout(() => {
			expect(window.location.search).toEqual('?key=defaultState');
			done();
		}, 50);
	});

	test('url search changes when state changes', done => {
		const {container} = render(
			<Container defaultState="defaultState" theKey="key" />,
		);
		const state = getByTestId(container, 'state');
		const setState = getByTestId(container, 'setStateButton');
		fireEvent.click(setState);
		expect(state.textContent).toEqual('newState');
		setTimeout(() => {
			expect(window.location.search).toEqual('?key=newState');
			done();
		}, 50);
	});

	test('state is preloaded correctly from url search', () => {
		window.location.search = '?key=someState';
		const {container} = render(
			<Container defaultState="defaultState" theKey="key" />,
		);
		const state = getByTestId(container, 'state');
		expect(state.textContent).toEqual('someState');
	});
});
