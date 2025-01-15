import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { SocketDataProvider } from './context/SocketDataContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SocketDataProvider>
      <App />
    </SocketDataProvider>
  </BrowserRouter>
);
