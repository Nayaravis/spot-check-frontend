import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PlaceDetails from './components/PlaceDetails';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Favorites from './components/Favorites';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/places/:id" element={<PlaceDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
