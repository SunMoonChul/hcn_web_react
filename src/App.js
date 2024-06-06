import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Components from './views/components/components.jsx';
import CustomComponents from './views/custom-components/custom-components.jsx';
import Login from './views/custom-components/Login.jsx';
import MyInfo from './views/custom-components/sections/MyInfo.jsx';
import { DataProvider } from './context/DataContext';

const App = () => {
    return (
        <DataProvider>
            <Routes>
                <Route path="/custom-components" element={<CustomComponents />} />
                <Route path="/" element={<Components />} />
                <Route path="/login" element={<Login />} />
                <Route path="/my-info" element={<MyInfo />} />
            </Routes>
        </DataProvider>
    );
};

export default App;
