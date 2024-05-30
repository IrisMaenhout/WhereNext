import './App.css';
import { Route, Routes } from 'react-router-dom';
import PlanningPage from './pages/planningPage/PlanningPage';
import Login from './pages/login/Login';
import { LoggedInUserProvider } from './context/LoggedInUserContext';
import useLoggedInUser from './hooks/useLoginUser';
import { useEffect } from 'react';

function App() {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  
  if (!loggedInUser) {
    return <Login setLogin={setLoggedInUser} />;
  } else {
    return (
      <LoggedInUserProvider value={loggedInUser}>
        <Routes>
          <Route path="/" element={<PlanningPage />} />
          <Route path="/bucket-list" element={<PlanningPage />} />
          {/* other routes */}
        </Routes>
      </LoggedInUserProvider>
    );
  }
}

export default App;
