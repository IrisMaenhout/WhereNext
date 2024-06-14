import './App.css';
import { Route, Routes, useParams } from 'react-router-dom';
import PlanningPage from './pages/planningPage/PlanningPage';
import { LoggedInUserProvider } from './context/LoggedInUserContext';
import useLoggedInUser from './hooks/useLoginUser';
import BucketList from './components/plan/bucketList/BucketList';
import Accomodations from './components/plan/accomodations/Accomodations';
import Suggestions from './components/plan/suggestions/Suggestions';
import Itinerary from './components/plan/itinerary/Itinerary';
import PlaceDetails from './components/plan/placeDetails/PlaceDetails';
import TripOverview from './components/trip/TripOverview';
import JoinTrip from './components/trip/joinTrip/JoinTrip';
import AddTrip from './components/trip/addTrip/AddTrip';
import LoginRegister from './pages/loginRegister/LoginRegister';
import TripMemberContainer from './context/TripMemberContext';
import Home from './pages/home/Home';


function App() {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();

  
  if (!loggedInUser) {
    return <LoginRegister setLogin={setLoggedInUser} isLogin={true}/>;
  } else {
    return (
      <LoggedInUserProvider value={loggedInUser}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-trips" element={<TripOverview />} />
          <Route path="/add-trip" element={<AddTrip />} />
          <Route path="/join-trip/:tripId" element={<JoinTrip />} />
        </Routes>
          
        <TripMemberContainer>
          <Routes>
            <Route path="/trip/:tripId/edit" element={<AddTrip isEditPage={true}/>} />
            <Route path="/trip/:tripId/plan/bucket-list" element={
                <PlanningPage>
                  <BucketList />
                </PlanningPage>
              } 
            />
            <Route path="/trip/:tripId/plan/bucket-list/suggestions" element={
                <PlanningPage>
                  <Suggestions page={"bucketList"}/>
                </PlanningPage>
              } 
            />
            <Route path="/trip/:tripId/plan/accomodations" element={
                <PlanningPage>
                  <Accomodations />
                </PlanningPage>
              } 
            />
            <Route path="/trip/:tripId/plan/accomodations/suggestions" element={
                <PlanningPage>
                  <Suggestions page={"accomodations"}/>
                </PlanningPage>
              } 
            />

            <Route path="/trip/:tripId/plan/itinerary" element={
                <PlanningPage>
                  <Itinerary />
                </PlanningPage>
              } 
            />

            <Route path="/trip/:tripId/plan/itinerary/suggestions" element={
                  <PlanningPage>
                    <Suggestions page={"itinerary"}/>
                  </PlanningPage>
                } 
            />

            <Route path="/trip/:tripId/place/:googlePlaceId/overview" element={
                  <PlanningPage>
                    {/* <Overview /> */}
                    <PlaceDetails page={"overview"}/>
                  </PlanningPage>
                } 
            />

            <Route path="/trip/:tripId/place/:googlePlaceId/visiting-info" element={
                  <PlanningPage>
                    {/* <Overview /> */}
                    <PlaceDetails page={"visiting-info"}/>
                  </PlanningPage>
                } 
            />

            <Route path="/trip/:tripId/place/:googlePlaceId/reviews" element={
                  <PlanningPage>
                    {/* <Overview /> */}
                    <PlaceDetails page={"reviews"}/>
                  </PlanningPage>
                } 
            />
          </Routes>
        </TripMemberContainer>
          
          {/* other routes */}
       

      </LoggedInUserProvider>
    );
  }
}

export default App;
