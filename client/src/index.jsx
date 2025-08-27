import { createRoot } from 'react-dom/client'; // React 18 root API
import App from './App.jsx'; // Main App component
import './index.css'; // Global styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS for styling

// Create React root and render the App into the #root element in index.html
createRoot(document.getElementById('root')).render(<App />);
