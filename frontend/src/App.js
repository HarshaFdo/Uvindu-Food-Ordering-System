import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import LoginPage from './components/LoginPage';

import UserPage from './pages/UserPage';
import HomePage from './pages/HomePage';
import RegisterPage from './components/RegisterPage';
import 'leaflet/dist/leaflet.css';



import AdminHome from './pages/admin/AdminHome';
import MealManagement from './pages/admin/MealManagement';
import AdditionalMealManagement from './pages/admin/AdditionalMealManagement';
import Orders from './pages/admin/Orders';
import TrackingMap from './pages/TrackingMap';
import PlaceOrderPage from './pages/PlaceOrderPage';
import NotificationManagement from './pages/admin/NotificationManagement';
import AdvertisementManagement from './pages/admin/AdvertisementManagement';
import PlaceOrderDetails from "./components/PlaceOrderDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/meals" element={<MealManagement />} />
        <Route path="/admin/additionalmeals" element={<AdditionalMealManagement />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/tracking" element={<TrackingMap />} />


        <Route path="/checkout" element={<PlaceOrderPage />} />
        <Route path="/admin/notifications" element={<NotificationManagement />} />
        <Route path="/admin/advertisements" element={<AdvertisementManagement />} />



       

        <Route path="/place-order" element={<PlaceOrderDetails />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
