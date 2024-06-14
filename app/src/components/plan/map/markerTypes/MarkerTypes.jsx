import React from 'react';

import BookMarker from './markers/BookMarker';
import TreeMarker from './markers/TreeMarker';
import WalkingMarker from './markers/WalkingMarker';
import ZooMarker from './markers/ZooMarker';
import TouristAttractions from './markers/TouristAttractions';
import HistoricalMarker from './markers/HistoricalMarker';
import AttractionParkMarker from './markers/AttractionParkMarker';
import CoctailMarker from './markers/CoctailMarker';
import MovieMarker from './markers/MovieMarker';
import PartyMarker from './markers/PartyMarker';
import SkiMarker from './markers/SkiMarker';
import StadiumMarker from './markers/StadiumMarker';
import SwimingpoolMarker from './markers/SwimingpoolMarker';
import FoodMarker from './markers/FoodMarker';
import MuseumMarker from './markers/MuseumMarker';
import ReligionMarker from './markers/ReligionMarker';
import FishMarker from './markers/FishMarker';
// import CoffeeMarker from './markers/CoffeeMarker';
import BreakfastMarker from './markers/BreakfastMarker';
import TheaterMarker from './markers/TheaterMarker';
import LocationMarker from './markers/LocationMarker';
import BAndBMarker from './markers/BAndBMarker';
import CabinMarker from './markers/CabinMarker';
import HotelMarker from './markers/HotelMarker';
import HostelMarker from './markers/HostelMarker';
import CaravanMarker from './markers/CaravanMarker';
import TentMarker from './markers/TentMarker';
import HouseMarker from './markers/HouseMarker';

function MarkerTypes({place, page}){
    const colors = {
        suggestions: {
            color: "#3db8ad",
            strokeColor: "white"
        },
        bucketList: {
            color: "#e6b749",
            strokeColor: "white"
        },
        itinerary: {
            color: "#7d59b3",
            strokeColor: "white"
        },
        accomodations: {
            color: "#b3467e",
            strokeColor: "white"
        },
        // detail: {
        //     color: "#3db8ad",
        //     strokeColor: "white"
        // }
    }

    const size = {
        width: 20,
        height: 20
    }

    const placePrimaryCategory = "primaryType" in place ? place.primaryType : place.types[0];




    if(placePrimaryCategory === "park" || placePrimaryCategory === "national_park" || placePrimaryCategory === "dog_park" || placePrimaryCategory === "natural_feature"){
        return <TreeMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "library" || placePrimaryCategory === "book_store"){
        return <BookMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "stadium" || placePrimaryCategory === "athletic_field"){
        return <StadiumMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "swimming_pool"){
        return <SwimingpoolMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "ski_resort"){
        return <SkiMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "hiking_area"){
        return <WalkingMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "zoo"){
        return <ZooMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "tourist_attraction" || placePrimaryCategory === "visitor_center" || placePrimaryCategory === "landmark" || placePrimaryCategory === "point_of_interest"){
        return <TouristAttractions color={colors[page].color} strokeColor={colors[page].strokeColor}/>
        

    }else if(placePrimaryCategory === "historical_landmark"){
        return <HistoricalMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "art_gallery" || placePrimaryCategory === "museum"){
        return <MuseumMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "church" || placePrimaryCategory === "hindu_temple" || placePrimaryCategory === "mosque" || placePrimaryCategory === "synagogue" || placePrimaryCategory === "place_of_worship"){
        return <ReligionMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "amusement_park" || placePrimaryCategory === "amusement_center"){
        return <AttractionParkMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "aquarium"){
        return <FishMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>


    }else if(placePrimaryCategory === "movie_rental" || placePrimaryCategory === "movie_theater"){
        return <MovieMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>
        
    }else if(placePrimaryCategory === "performing_arts_theater"){
        return <TheaterMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>
        
    }else if(placePrimaryCategory === "night_club" || placePrimaryCategory === "event_venue"){
        return <PartyMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>
        
    }else if(placePrimaryCategory === "bar" || placePrimaryCategory === "cafe"){
        return <CoctailMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "bakery" || placePrimaryCategory === "breakfast_restaurant" || placePrimaryCategory === "brunch_restaurant" || placePrimaryCategory === "coffee_shop"){
        return <BreakfastMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>
        
    }else if(placePrimaryCategory === "food" || placePrimaryCategory === "restaurant" || placePrimaryCategory === "american_restaurant" || placePrimaryCategory === "barbecue_restaurant" || placePrimaryCategory === "brazilian_restaurant" || placePrimaryCategory === "chinese_restaurant"|| placePrimaryCategory === "fast_food_restaurant"|| placePrimaryCategory === "french_restaurant"|| placePrimaryCategory === "greek_restaurant"|| placePrimaryCategory === "hamburger_restaurant"|| placePrimaryCategory === "indian_restaurant"|| placePrimaryCategory === "indonesian_restaurant"|| placePrimaryCategory === "italian_restaurant" || placePrimaryCategory === "japanese_restaurant" || placePrimaryCategory === "korean_restaurant" || placePrimaryCategory === "lebanese_restaurant" || placePrimaryCategory === "meal_delivery" || placePrimaryCategory === "meal_takeaway" || placePrimaryCategory === "mediterranean_restaurant" || placePrimaryCategory === "mexican_restaurant" || placePrimaryCategory === "middle_eastern_restaurant" || placePrimaryCategory === "pizza_restaurant" || placePrimaryCategory === "ramen_restaurant" || placePrimaryCategory === "sandwich_shop" || placePrimaryCategory === "seafood_restaurant" || placePrimaryCategory === "spanish_restaurant" || placePrimaryCategory === "steak_house" || placePrimaryCategory === "thai_restaurant" || placePrimaryCategory === "sushi_restaurant"|| placePrimaryCategory === "turkish_restaurant" || placePrimaryCategory === "vietnamese_restaurant"|| placePrimaryCategory === "grocery_store" || placePrimaryCategory === "vegan_restaurant"|| placePrimaryCategory === "vegetarian_restaurant"){
        return <FoodMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "bed_and_breakfast"){
        return <BAndBMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "campground"){
        return <TentMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "camping_cabin" || placePrimaryCategory === "cottage"){
        return <CabinMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "rv_park"){
        return <CaravanMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>
    
    }else if(placePrimaryCategory === "extended_stay_hotel" || placePrimaryCategory === "hotel" || placePrimaryCategory === "lodging" || placePrimaryCategory === "motel" || placePrimaryCategory === "resort_hotel"){
        return <HotelMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>

    }else if(placePrimaryCategory === "farmstay" || placePrimaryCategory === "guest_house" || placePrimaryCategory === "private_guest_room"){
        return <HouseMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>
    
    }else if(placePrimaryCategory === "hostel"){
        return <HostelMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>
    
    }else{
        console.log('No marker',place);
        return (
            <LocationMarker color={colors[page].color} strokeColor={colors[page].strokeColor}/>
        )

        
    }
}

export default MarkerTypes;