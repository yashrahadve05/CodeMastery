import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";


import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage'
import useAuthStore from './store/useAuthStore';
import Layout from "./Layout/Layout"
import AdminRoute from './components/AdminRoute.jsx';
import AddProblem from './pages/AddProblem.jsx';

function App() {


  const { authUser, checkAuth, isChekingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  if (isChekingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (

    <div className='flex flex-col items-center justify-start'>

      <Toaster />

      <Routes>

        <Route path='/' element={<Layout />}>
          <Route index element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        </Route>

        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        <Route element={<AdminRoute />}>
          <Route path='/add-problem' element={authUser ? <AddProblem /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
