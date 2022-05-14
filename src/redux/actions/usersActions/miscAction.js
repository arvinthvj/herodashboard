import { HistoryActionTypes } from './actionType';

export const addHistory = (history) => dispatch => {
    dispatch({ type: HistoryActionTypes.ADD_HISTORY, payload: history });
}
