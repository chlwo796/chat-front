import React from 'react';
import logo from './logo.svg';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { Main } from './components/Main';
import { Login } from './components/Login';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { SignUp } from './components/SignUp';


function App() {
  return (
    <BrowserRouter>
    
      <div className="App">
          <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
              <Link className="navbar-brand" to={'/sign-in'}>
                Chatting
              </Link>
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={'/sign-in'}>
                      SignIn
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/sign-up'}>
                      SignUp
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="auth-wrapper">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/sign-in" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/main" element={<Main />} />
              </Routes>
            </div>
          </div>
    </BrowserRouter>
  );
}

export default App;
