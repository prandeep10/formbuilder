import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import CreateForm from './pages/createform/CreateForm';
import FormView from './pages/form/FormView';
import FormLinks from './pages/formlink/FormLink';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-form" element={<CreateForm />} />
        <Route path="/form" element={<FormView />} />
        <Route path="/form-links" element={<FormLinks />} />
      </Routes>
    </Router>
  );
};

export default App;
