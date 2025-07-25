import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./Index.css"
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/Store.js'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
