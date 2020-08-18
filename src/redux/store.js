import { createStore, applyMiddleware } from "redux";

import rootReducer from "./rootReducer";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

const middlewares = [thunk];

export const store = createStore(rootReducer, applyMiddleware(...middlewares));

export const persistor = persistStore(store);

export default { store, persistor };