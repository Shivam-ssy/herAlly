import { StrictMode, useContext } from 'react'
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
import ShowContext from './context/ShowContext.js';
import NgoHome from './pages/NgoHome.jsx';


  const router=createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='/' element={<Landing/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/services' element={<Services/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/ngolist' element={<NgoList/>}/>
      <Route path='/chatscreen/:senderId/:recieverId' element={<ChatScreen/>}/>
      <Route path='/demoChat' element={<Chat/>}/>
      <Route path='/Ngohome' element={<NgoHome/>}/>
    </Route>
  ))

createRoot(document.getElementById('root')).render(
  <ShowContextProvider>
    <RouterProvider router={router}/>
  </ShowContextProvider>
)
