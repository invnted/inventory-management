
import './App.css';
import Home from './super-admin/Home';
import { BrowserRouter as Router, Routes,Route, Link, Navigate } from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCategory from './super-admin/AddProduct';
import AddManager from './super-admin/AddManager';
import AddUser from './super-admin/AddUser';
import AuthorizationStore from './super-admin/AuthorizationStore';
import DemandRequest from './super-admin/DemandRequest';
import UsersList from './super-admin/UsersList';
import UserHome from './users/UserHome';
import RaiseDemand from './users/RaiseDemand';
import RaiseDemandReport from './users/RaiseDemandReport';
import ManagerDashboard from './manager/ManagerDashboard';
import ManagerAddUser from './manager/ManagerAddUser';
import ManagerUserList from './manager/ManagerUserList';
import ManagerDemand from './manager/ManagerDemand';
import ManagerDemandReport from './manager/ManagerDemandReport';
import ManagerAddProduct from './manager/ManagerAddProduct';
import DemandReport from './super-admin/DemandReport';
import ManagerReport from './manager/ManagerReport';
import ModeratorHome from './moderator/ModeratorHome';
import AddModerator from './super-admin/AddModerator';
import AllModerator from './super-admin/AllModerator';
import IssueProduct from './moderator/IssueProduct';
import ConfirmProduct from './moderator/ConfirmProduct';
import StockRequired from './super-admin/StockRequired';
import StockRequiredInStore from './manager/StockRequiredInStore';
import CompanyDashboard from './company/CompanyDashboard';
import ManagerAuthorizationStore from './manager/ManagerAuthorizationStore';
import CompanyRaiseDemand from './company/CompanyRaiseDemand';
import CompanyRaiseDemandReport from './company/CompanyRaiseDemandReport';
import CompanyList from './super-admin/CompanyList';
import AddCompany from './super-admin/AddCompany';
import UserProductReceived from './users/UserProductReceived';
import CompanyProductReceived from './company/CompanyProductReceived';
import ManagerProductReport from './manager/ManagerProductReport';
import UserRaiseTicket from './users/UserRaiseTicket';
import CompanyRaiseTicket from './company/CompanyRaiseTicket';
import Reports from './super-admin/Reports';
import StoreReport from './super-admin/StoreReport';
import AllManager from './super-admin/AllManager';
import CompanyLogin from './company/CompanyLogin';
import AdminLogin from './super-admin/Login';
import UserLogin from './users/UserLogin';
import ManagerLogin from './manager/ManagerLogin';
import ModeratorLogin from './moderator/ModeratorLogin';
import CompanyDemandRequest from './super-admin/CompanyDemandRequest';
import CompanyDemand from './manager/CompanyDemand';
import CompanyDemandReport from './manager/CompanyDemandReport';
import IssueForCompany from './moderator/IssueForCompany';
import ConfirmCompanyProduct from './moderator/ConfirmCompanyProduct';
import PendingCompanyDemand from './super-admin/PendingCompanyDemand';
import PendingUserDemand from './super-admin/PendingUserDemand';
import UserTicketReceived from './moderator/UserTicketReceived';
import CompanyTicketReceived from './moderator/CompanyTicketReceived';



function App() {

  return (
    <Router>
      <div>
      <Routes>
        <Route path="/login" element={<AdminLogin/>} />
        <Route path="/manager-login" element={<ManagerLogin/>} />
        <Route path="/moderator-login" element={<ModeratorLogin/>} />
        <Route path="/company-login" element={<CompanyLogin/>} />
        <Route path="/" element={<UserLogin/>} />
        {/* Admin panel */}
        <Route path="/home" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/manager-report" element={<ManagerReport />} />
        <Route path="/reports/store-reports" element={<StoreReport/>} />
        <Route path="/home/add-category" element={<AddCategory />} />
        <Route path="/home/add-manager" element={<AddManager />} />
        <Route path="/home/all-managers" element={<AllManager/>} />
        <Route path="/home/add-user" element={<AddUser />} />
        <Route path="/home/add-Company" element={<AddCompany/>} />
        <Route path="/home/company-list" element={<CompanyList />} />
        <Route path="/home/add-user/users-list" element={<UsersList/>} />
        <Route path="/home/authorization-store" element={<AuthorizationStore />} />
        <Route path="/home/demand-request" element={<DemandRequest />} />
        <Route path="/home/company-demand-request" element={<CompanyDemandRequest />} />

        <Route path="/home/pending-company-demand" element={<PendingCompanyDemand />} />
        <Route path="/home/pending-user-demand" element={<PendingUserDemand/>} />
        <Route path="/home/demand-report" element={<DemandReport />} />
        <Route path="/home/stock-required" element={<StockRequired />} />

        {/* Manger Section */}
        <Route path="/manager-dashboard" element={<ManagerDashboard/>} />
        <Route path="/manager-dashboard/managerAdd-user" element={<ManagerAddUser/>} />
        <Route path="/manager-dashboard/manager-UserList" element={<ManagerUserList/>} />
        <Route path="/manager-dashboard/manager-AddProduct" element={<ManagerAddProduct/>} />
        <Route path="/manager-dashboard/manager-ProductReport" element={<ManagerProductReport/>} />
        <Route path="/manager-dashboard/ManagerDemand" element={<ManagerDemand/>} />
        <Route path="/manager-dashboard/CompanyDemand" element={<CompanyDemand/>} />
        <Route path="/manager-dashboard/CompanyDemandReport" element={<CompanyDemandReport/>} />
        <Route path="/manager-dashboard/ManagerDemandReport" element={<ManagerDemandReport/>} />
        <Route path="/manager-dashboard/StockRequiredInStore" element={<StockRequiredInStore/>} />


        {/* User Panel */}
        <Route path="/user-home" element={<UserHome/>} />
        <Route path="/user-home/raise-demand" element={<RaiseDemand/>} />
        <Route path="/user-home/raise-ticket" element={<UserRaiseTicket/>} />
        <Route path="/user-home/raise-demand-report" element={<RaiseDemandReport/>} />
        <Route path="/user-home/product-received" element={<UserProductReceived/>} />

        {/* Moderator Panel */}
        <Route path="/moderator-home" element={<ModeratorHome/>} />
        <Route path="/moderator-home/add-moderator" element={<AddModerator/>}/>
        <Route path="/moderator-home/all-moderator" element={<AllModerator/>}/>
        <Route path="/moderator-home/issue-product" element={<IssueProduct/>}/>
        <Route path="/moderator-home/issue-product-company" element={<IssueForCompany/>}/>
        <Route path="/moderator-home/confirm-product" element={<ConfirmProduct/>}/>
        <Route path="/moderator-home/confirm-company-product" element={<ConfirmCompanyProduct/>}/>
        <Route path="/moderator-home/authorization-store" element={<ManagerAuthorizationStore/>}/>
        <Route path="/moderator-home/user-ticket-received" element={<UserTicketReceived/>}/>
        <Route path="/moderator-home/company-ticket-received" element={<CompanyTicketReceived/>}/>

        {/* Company Panel */}
        <Route path="/company-home" element={<CompanyDashboard/>}/>
        <Route path="/company-home/raise-demand" element={<CompanyRaiseDemand/>}/>
        <Route path="/company-home/raise-ticket" element={<CompanyRaiseTicket/>}/>
        <Route path="/company-home/raise-demand-report" element={<CompanyRaiseDemandReport/>}/>
        <Route path="/company-home/product-received" element={<CompanyProductReceived/>}/>

        
      </Routes>
      <ToastContainer />
      </div>
      
    </Router>
    
  );
}

export default App;