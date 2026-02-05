import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import './index.css';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppWrapper />,
);