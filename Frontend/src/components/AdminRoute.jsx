import React from 'react'
import useAuthStore from '../store/useAuthStore'
import { Loader } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import CreateProblemForm from './CreateProblemForm';

const AdminRoute = () => {

    const { authUser, isCheckingAuth } = useAuthStore();


    if(isCheckingAuth) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='size-10 animate-spin' />
            </div>
        )
    }

    if(!authUser || authUser.role !=="ADMIN" ) {
        return <Navigate to="/" />
    }

    return (
        <div>
            <CreateProblemForm />
        </div>
    )
}

export default AdminRoute