import {useState, useEffect} from 'react';
import {getStateOnMount, changeUrlSearch} from './lib/utilities';

export default (defaultState, key, possibleStates) => {
	const [state, setState] = useState(
		getStateOnMount(defaultState, key, possibleStates),
	);
	useEffect(() => {
		changeUrlSearch(state, key);
		return () => {
			changeUrlSearch(state, key, 'dissoc');
		};
	}, [key, state]);
	return [state, setState];
};
