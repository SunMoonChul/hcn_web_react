// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/scss/style.scss';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import App from './App'; // 여기서 App 컴포넌트를 가져옵니다.

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <HashRouter>
        <App />
    </HashRouter>
);

reportWebVitals();
