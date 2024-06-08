import './App.css';
import { Route, Routes } from 'react-router-dom';
import PlanningPage from './pages/planningPage/PlanningPage';
import Login from './pages/login/Login';
import { LoggedInUserProvider } from './context/LoggedInUserContext';
import useLoggedInUser from './hooks/useLoginUser';
import { useEffect } from 'react';
import BucketList from './components/plan/bucketList/BucketList';
import Accomodations from './components/plan/accomodations/Accomodations';
import Suggestions from './components/plan/suggestions/Suggestions';
import Itinerary from './components/plan/itinerary/Itinerary';
import Overview from './components/plan/placeDetails/overview/Overview';
import PlaceDetails from './components/plan/placeDetails/PlaceDetails';
import TripOverview from './components/trip/TripOverview';


function App() {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();


  // const onPop = (e) => {
  //   console.log('popEcente', e);
    
  // }

  // useEffect(()=> {
  //   window.addEventListener('popstate', onPop)
   
  //   return () => window.removeEventListener("popstate", onPop);
  // }, [onPop])


  
  if (!loggedInUser) {
    return <Login setLogin={setLoggedInUser} />;
  } else {
    return (
      <LoggedInUserProvider value={loggedInUser}>
        <Routes>
          <Route path="/" element={<PlanningPage />} />
          <Route path="/my-trips" element={<TripOverview />} />
          <Route path="/bucket-list" element={
              <PlanningPage>
                <BucketList />
              </PlanningPage>
            } 
          />
          <Route path="/bucket-list/suggestions" element={
              <PlanningPage>
                <Suggestions page={"bucketList"}/>
              </PlanningPage>
            } 
          />
          <Route path="/accomodations" element={
              <PlanningPage>
                <Accomodations />
              </PlanningPage>
            } 
          />
          <Route path="/accomodations/suggestions" element={
              <PlanningPage>
                <Suggestions page={"accomodations"}/>
              </PlanningPage>
            } 
          />

          <Route path="/itinerary" element={
              <PlanningPage>
                <Itinerary />
              </PlanningPage>
            } 
          />

          <Route path="/itinerary/suggestions" element={
                <PlanningPage>
                  <Suggestions page={"itinerary"}/>
                </PlanningPage>
              } 
          />

          <Route path="/place/:googlePlaceId/overview" element={
                <PlanningPage>
                  {/* <Overview /> */}
                  <PlaceDetails />
                </PlanningPage>
              } 
          />
          {/* other routes */}
        </Routes>

      </LoggedInUserProvider>
    );
  }
}

export default App;
