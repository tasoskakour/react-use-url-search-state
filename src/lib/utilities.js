import {parse, stringify} from 'query-string';
import {pathOr, pipe, assoc, dissoc, prop} from 'ramda';

export const changeUrlSearch = (state, key, mode = 'assoc') => {
	const newSearch = pipe(
		pathOr('', ['location', 'search']),
		parse,
		obj => (mode === 'assoc' ? assoc(key, state, obj) : dissoc(key, obj)),
		stringify,
	)(window);
	const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${newSearch}`;
	if (window.history.pushState) {
		window.history.pushState({path: newUrl}, '', newUrl);
	}
};

export const getStateOnMount = (defaultState, key, possibleStates) => {
	const currentLoadedState = pipe(
		pathOr('', ['location', 'search']),
		parse,
		prop(key),
	)(window);
	if (Array.isArray(possibleStates)) {
		if (possibleStates.includes(currentLoadedState)) {
			return currentLoadedState;
		}

		changeUrlSearch('', key, 'dissoc');
		return defaultState;
	}

	return currentLoadedState || defaultState;
};
