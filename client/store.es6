import R from 'ramda'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import * as actions from './actions'
import extend from 'extend'

let getCoords = R.compose(R.join(',')
  , R.map(coord => coord.toPrecision(4))
  , R.values
  , R.pickAll(['latitude', 'longitude'])
  , R.prop('coords'));

const thunk = store => next => action => {
  typeof action === 'function' ?
    action(store.dispatch, store.getState) :
    next(action);
};

let reducers = {
  strollModel: (prevState = {}, action = {}) => {
    switch (action.type) {
      case actions.UPDATE_INPUT_VALUE:
        let newState = extend({}, prevState);
        newState[action.name] = action.value;
        return newState;
      default:
        return prevState;
    }
  },
  texts: (prevState = {}, action = {}) => {
    switch (action.type) {
      case actions.UPDATE_TEXTS:
        return extend({}, action.texts, prevState);
      default:
        return prevState;
    }
  },
  coords: (prevState = '', action = {}) => {
    switch (action.type) {
      case actions.UPDATE_COORDINATES:
        return getCoords(action.coords);
      default:
        return prevState;
    }
  }
};

let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

let combinedReducers = combineReducers(reducers);

export default createStoreWithMiddleware(combinedReducers);
