import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UserPage from './pages/UserPage';
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user" element={<UserPage/>}/>
        <Route path="/admin" element={<AdminDashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
