import { StrictMode , Suspense} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store, persiststore } from './store/store.js';
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persiststore}>
        <Suspense fallback={<div>Loading app...</div>}>
        <App />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
