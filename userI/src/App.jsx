import React, { Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from "react-router-dom"
import './index.css'
import Home from './components/Home';
import Error, { Device } from './n_f_components/Error';
import Emailverify from './B_E_code/forget_password';
import Loader from './n_f_components/loader';
// lazy loading
const Chat = React.lazy(() => import('./components/Chat'))
const Users = React.lazy(() => import('./components/Users'))
const Notification = React.lazy(() => import('./components/notification'))
const Myprofile = React.lazy(() => import('./B_E_code/my-profile'))
const Login = React.lazy(() => import('./B_E_code/Login'))
const Registration = React.lazy(() => import('./B_E_code/Registration'))
const Verifyotp = React.lazy(() => import('./B_E_code/verifyotp'))
const ResetPassword = React.lazy(() => import('./B_E_code/ResetPassword'))



function App() {
  if (window.innerWidth < 450) {
    <Navigate to='/device_error' />
  }
  return (
    <>
      <HashRouter>
        <Routes basename='/'>
          <Route path='/' element={<Home />} />
          <Route path='/chatapplication' element={<Home />} />
          <Route path='/chat' element={<Suspense fallback={<Loader />}><Chat /></Suspense>} />
          <Route path='/users?' element={<Suspense fallback={<Loader />}><Users /></Suspense>} />
          <Route path='/login' element={<Suspense fallback={<Loader />}><Login /></Suspense>} />
          <Route path='/register' element={<Suspense fallback={<Loader />}><Registration /></Suspense>} />
          <Route path='/verify' element={<Suspense fallback={<Loader />}><Verifyotp /></Suspense>} />
          <Route path='/my-profile' element={<Suspense fallback={<Loader />}><Myprofile /></Suspense>} />
          <Route path='/mail_verify' element={<Emailverify />} />
          <Route path='/reset_password?' element={<Suspense fallback={<Loader />}><ResetPassword /></Suspense>} />
          <Route path='/notifications' element={<Suspense fallback={<Loader />}><Notification /></Suspense>} />
          <Route path='/device_error' element={<Device />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
