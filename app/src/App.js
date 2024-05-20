import './App.css';
import { Route, Routes } from 'react-router-dom';
import TestPage from './pages/TestPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={ <TestPage/> } />
        {/* <Route path="about" element={ <About/> } />
        <Route path="contact" element={ <Contact/> } /> */}
      </Routes>
    </div>
  );
}

export default App;
