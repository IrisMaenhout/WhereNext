import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import WorldFlags from 'react-world-flags';
import styles from './countrySelect.module.css';
import { europeanCountries } from '../../../../consts/countries';


const CountrySelect = ({setNewTripData}) => {
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setNewTripData((prev)=> (
            {
                ...prev,
                country: selectedOption.label
            }
        ))
    };

    const customOption = (props) => {
        return (
            <div className="custom-option">
                <WorldFlags code={props.value} style={{ width: '20px', marginRight: '10px' }} />
                {props.label}
            </div>
        );
    };


    // Convert country name to lat lng
    useEffect(()=>{
        if(selectedCountry){
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${selectedCountry.label}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                setNewTripData((prev) => (
                    {
                        ...prev,
                        lat: data.results[0].geometry.location.lat,
                        lng: data.results[0].geometry.location.lng
                    }
                ))
            });
        }
        
    },[selectedCountry])

    return (
        <div>
            <label htmlFor="country-select" className={styles.label}>Choose a country:</label>
            <Select
                id="country-select"
                options={europeanCountries}
                value={selectedCountry}
                onChange={handleChange}
                getOptionLabel={(e) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <WorldFlags code={e.value} style={{ width: '20px', marginRight: '10px' }} />
                        {e.label}
                    </div>
                )}
                getOptionValue={(e) => e.value}
            />
        </div>
    );
};

export default CountrySelect;
