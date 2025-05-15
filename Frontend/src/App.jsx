import './App.css'
import {lazy} from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from './pages/auth/register/Register.jsx';
import Login from './pages/auth/login/Login.jsx';
import { ToastContainer, Bounce } from 'react-toastify';
import { useSelector } from 'react-redux';
import Layout from './layout/Layout';
import PageNotFound from "./components/PageNotFount"
import Home from "./pages/chat/App"
import Profile from './pages/profile/App';

const ProtectedCpmponent = () => {
  const isAuthorized = useSelector((state) => state.user.token);
  if (isAuthorized) {
    return <Layout />
  } else {
    return <Navigate to="login" />
  }
}

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} caseSensitive />
          <Route path="/" element={<ProtectedCpmponent />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter >
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  )
}

export default App
