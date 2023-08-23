import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
    </LocalizationProvider>
);

