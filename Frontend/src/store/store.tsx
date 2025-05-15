// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./slices/userSlice.tsx"


// const store = configureStore(
//     {
//         reducer: {
//             user: userReducer
//         }
//     }
// )

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js"
import messageReducer from "./slices/messageSlice.js"
import { persistStore, persistReducer, } from 'redux-persist'
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    user: userReducer,
    message: messageReducer,
})

const persistConfig = {
    key: "root",
    storage,
};

const persistreducer = persistReducer(persistConfig, rootReducer)

const store = configureStore(
    {
        reducer: persistreducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    }
)

const persiststore = persistStore(store)


export { store, persiststore };