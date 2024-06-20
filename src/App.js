
import './App.css';
import Home from './super-admin/Home';
import { BrowserRouter as Router, Routes,Route, Link, Navigate } from "react-router-dom";
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCategory from './super-admin/AddProduct';
import Popup from './components/Popup';
import AddManager from './super-admin/AddManager';
import AddUser from './super-admin/AddUser';
import AuthorizationStore from './super-admin/AuthorizationStore';
import DemandRequest from './super-admin/DemandRequest';
import PendingDemand from './super-admin/PendingDemand';
import Reports from './pages/Reports';
import RadioButton from './components/RadioButton';
import AllManager from './components/AllManager';
import UsersList from './super-admin/UsersList';

function App() {

  return (
    <Router>
      <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/radio" element={<RadioButton />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/home/add-category" element={<AddCategory />} />
        <Route path="/home/add-manager" element={<AddManager />} />
        <Route path="/home/all-managers" element={<AllManager />} />
        <Route path="/home/add-user" element={<AddUser />} />
        <Route path="/home/add-user/users-list" element={<UsersList/>} />
        <Route path="/home/authorization-store" element={<AuthorizationStore />} />
        <Route path="/home/demand-request" element={<DemandRequest />} />
        <Route path="/home/pending-demand" element={<PendingDemand />} />

        

      </Routes>
      <ToastContainer />
      </div>
      
    </Router>
    
  );
}

export default App;
