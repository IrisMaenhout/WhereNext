import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthorized, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
