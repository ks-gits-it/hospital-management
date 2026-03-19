import './App.css';
import Home from './pages/Home';
import Patients from "./pages/Patients"
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Pharmacy from './pages/Pharmacy';
import Billing from './pages/Billing';
import Staff from './pages/Staff';
import { Routes,Route } from 'react-router';
function Router() {
  return (
    <div style={{display:"flex",padding:"16px"}}> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/staff" element={<Staff />} />
      </Routes>
    </div>
  );
}

export default Router;
