import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/Notfound';
import VerifyEmail from './pages/VerifyEmail';
import Appointments from './pages/Appointments';
import AdminHome from './pages/AdminHome';
import Settings from './pages/Settings';
import AllReservations from './pages/AllReservations';
import AllUsers from './pages/AllUsers';
import Statistics from './pages/Statistics';
import SingleAppointments from './pages/SingleAppointments';
import ForgotPassword from './pages/ForgotPassword';



function App() {

const { user } = useSelector((state) => state.auth); // جلب الرسالة من الـ Redux
console.log('userrrrrrrrrrr', user);
  return (
    <Router>
      <Routes>
        {/* المسار الافتراضي يعرض صفحة الـ Login إذا لم يكن المستخدم مسجل دخول */}
        <Route path="/" element={user?.user ? <Navigate to="/dashboard" /> : <Login />} />

        {/* صفحة الـ تسجيل الدخول */}
        <Route path="/login" element={ user?.user ?  <Navigate to="/dashboard" /> :<Login />} />

        {/* صفحة التسجيل */}
        <Route path="/register" element={user?.user ?  <Navigate to="/dashboard" /> :<Register />} />
       

        {/* صفحة الداشبورد يظهر فقط إذا كان المستخدم مسجل دخول */}
       {/* راوت الداشبورد مع راوتات متداخلة */}
       <Route path="/dashboard" element={user?.user? <Dashboard /> : <Navigate to="/login" />}>
       <Route index element={ user?.user?.user?.role =='Admin'? <AdminHome/> :<h2>Welcome to the  user Dashboard</h2>} /> {/* هذا يظهر لما تفتح /dashboard مباشرة */}
       <Route path="appointments" element={ user?.user?.user?.role =='User'?<Appointments />:<AdminHome/>} />
       <Route path="all-reservations" element ={user?.user?.user?.role =='Admin' ?<AllReservations/> :<h2> you are not admin :) 😏</h2>} />
       <Route path="users" element ={user?.user?.user?.role =='Admin' ?<AllUsers/> :<h2> you are not admin :) 😏</h2>} />
       <Route path="statistics" element ={user?.user?.user?.role =='Admin' ?<Statistics/> :<h2> you are not admin :) 😏</h2>} />
       <Route path="SingleAppointments/:id" element ={user?.user?.user?.role =='Admin' ?<SingleAppointments/> :<h2> you are not admin :) 😏</h2>} />
        <Route path="settings" element={<Settings />} />
     </Route>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        {/* صفحة الخطأ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
