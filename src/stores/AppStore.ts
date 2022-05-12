import createSagaMiddleware from 'redux-saga';
import { configureStore } from "@reduxjs/toolkit";
import theme from "./ThemeSlice";
import REST from './RESTSlice';
import { RESTSaga } from './RESTSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    theme,
    REST
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ thunk: false }), sagaMiddleware]
});

sagaMiddleware.run(RESTSaga);

export default store;
