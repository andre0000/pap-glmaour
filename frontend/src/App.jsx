import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProfilePage from './pages/profile';
import NavBar from './components/navbar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
