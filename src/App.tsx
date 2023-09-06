// import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route }
    from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import Feed from './feed/Feed';
import Profile from './profile/Profile';
import QuestionPage from './question/QuestionPage';
import { CssVarsProvider, CssBaseline } from '@mui/joy';

function App() {
  return (
    <CssVarsProvider
        defaultMode="dark"
    >
        <CssBaseline/>
        <Router>
          <Routes>
            <Route path='/' element={<Feed/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/question/:id" element={<QuestionPage/>}/>
          </Routes>
        </Router>
    </CssVarsProvider>
  );
}

export default App;
