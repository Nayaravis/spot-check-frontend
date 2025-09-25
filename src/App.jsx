import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';

function App() {
  return (
   
      <Route path="/" element={<HomePage />} />
   
  )
}

export default App
