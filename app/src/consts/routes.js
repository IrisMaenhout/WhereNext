const ROUTES = {
    home: "/",
    login: "/login",
    register: "/register",
    tripsOverview: "/contact",
    bucketList: "/contact",
    searchRealEstate: "/zoeken",
    realEstateDetail: "/panden/:realEstateId",
    // account routes are for normal users
    plan: {
      bucketList: '/account/account-bijwerken',
      itinerary: '/account/favorieten',
      accomodations: '/account/berichten',
    },

  };
  
  export default ROUTES;
  