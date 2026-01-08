import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './page/Login';
import Dashboard from './page/admin/Dashboard';
import AddArmada from './page/admin/AddArmada';
import MonthlyReport from './page/admin/MonthlyReport';
import ManageMandor from './page/admin/ManageMandor';
import Billing from './page/admin/Billing'; // Import komponen baru
import Scanner from './page/mandor/Scanner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-armada" element={<AddArmada />} />
        <Route path="/admin/report" element={<MonthlyReport />} />
        <Route path="/admin/manage-mandor" element={<ManageMandor />} />
        <Route path="/admin/billing" element={<Billing />} /> {/* Route Baru */}
        
        {/* Mandor Routes */}
        <Route path="/mandor/scanner" element={<Scanner />} />
      </Routes>
    </Router>
  );
}

export default App;