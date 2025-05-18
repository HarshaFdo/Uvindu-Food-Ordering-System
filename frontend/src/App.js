import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import LoginPage from './components/LoginPage';
import UserPage from './pages/UserPage';
import HomePage from './pages/HomePage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/admin" element={<AdminDashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
