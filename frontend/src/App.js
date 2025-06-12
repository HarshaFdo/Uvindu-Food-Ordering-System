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
import NotificationManagement from './pages/admin/NotificationManagement';
import AdvertisementManagement from './pages/admin/AdvertisementManagement';
import PlaceOrder from './components/PlaceOrder';
import DeliveryMap from './pages/DeliveryMap';
import MyOrders from './pages/MyOrders';

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
        <Route path="/admin/notifications" element={<NotificationManagement />} />
        <Route path="/admin/advertisements" element={<AdvertisementManagement />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/delivery-map" element={<DeliveryMap />} />
        <Route path='/my-orders' element={<MyOrders />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
