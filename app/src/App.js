import './App.css';
import { Route, Routes } from 'react-router-dom';
import SuggestionsPage from './pages/suggestionsPage/SuggestionsPage';
import BucketList from './pages/bucketListPage/BucketList';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={ <SuggestionsPage/> } />
        <Route path="/bucket-list" element={ <BucketList/> } />
        {/* <Route path="about" element={ <About/> } />
        <Route path="contact" element={ <Contact/> } /> */}
      </Routes>
    </div>
  );
}

export default App;
