import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PlaceDetails from './components/PlaceDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/places/:id" element={<PlaceDetails />} />
    </Routes>
  )
}

export default App
