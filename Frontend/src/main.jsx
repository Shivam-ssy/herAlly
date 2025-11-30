import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Landing from './pages/Landing.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NgoList from './pages/NgoList.jsx';
import ChatScreen from './pages/ChatScreen.jsx';
import Chat from './pages/demo.jsx';
import ShowContextProvider from './context/ContextProvider.jsx';
import NgoHome from './pages/NgoHome.jsx';
import { ProtectedRoute, PublicRoute } from '../src/components/ProtectedRoute.jsx';
import ProfileWithProvider from './pages/Profile.jsx';
import NGODetails from './pages/NGODetails.jsx';
import { RoleProtectedRoute } from './components/RoleProtectedRoute.jsx';
import AccessDenied from './pages/AccessDenied.jsx';
import { NGOReportsList, UserReportsList } from './pages/ReportList.jsx';
import AdminDashboard from './pages/AdminDashBoard.jsx';
import ForgotPassword from './pages/ForgetScreen.jsx';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    {/* Public Routes - accessible to everyone */}
    <Route path='/' element={<Landing />} />
    <Route path='/about' element={<About />} />
    <Route path='/services' element={<Services />} />
    <Route path='/contact' element={<Contact />} />
    <Route path="/access-denied" element={<AccessDenied />} />

    {/* Auth Routes - only for non-logged in users */}
    <Route element={<PublicRoute />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Route>

    {/* Protected Routes - only for logged in users */}
    <Route element={<ProtectedRoute />}>
      <Route element={<RoleProtectedRoute allowedRoles={["user"]} />}>
        <Route path='/ngolist' element={<NgoList />} />
        <Route path='/ngodetail/:ngoId' element={<NGODetails />} />
        <Route path="/reports" element={<UserReportsList />} />
      </Route>

      {/* NGO ROUTES */}
      <Route element={<RoleProtectedRoute allowedRoles={["ngo"]} />}>
        <Route path="/ngo/reports" element={<NGOReportsList />} />
        <Route path='/ngohome' element={<NgoHome />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        {/* <Route path='/admin/users' element={<AdminUsers />} /> */}
      </Route>
      <Route path='/profile' element={<ProfileWithProvider />} />
      <Route path='/chatscreen/:senderId/:recieverId' element={<ChatScreen />} />
      <Route path='/demoChat' element={<Chat />} />
    </Route>
  </Route>
))

createRoot(document.getElementById('root')).render(
  <ShowContextProvider>
    <RouterProvider router={router} />
  </ShowContextProvider>
)