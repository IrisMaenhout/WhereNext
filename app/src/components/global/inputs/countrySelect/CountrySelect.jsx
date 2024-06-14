import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import WorldFlags from 'react-world-flags';
import styles from './countrySelect.module.css';
import { europeanCountries } from '../../../../consts/countries';


// const europeanCountries = [
//     "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", 
//     "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", 
//     "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", 
//     "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", 
//     "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", 
//     "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", 
//     "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", 
//     "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City"
// ];


// const europeanCountries = [
//     { label: "Albania", value: "AL" },
//     { label: "Andorra", value: "AD" },
//     { label: "Armenia", value: "AM" },
//     { label: "Austria", value: "AT" },
//     { label: "Azerbaijan", value: "AZ" },
//     { label: "Belarus", value: "BY" },
//     { label: "Belgium", value: "BE" },
//     { label: "Bosnia and Herzegovina", value: "BA" },
//     { label: "Bulgaria", value: "BG" },
//     { label: "Croatia", value: "HR" },
//     { label: "Cyprus", value: "CY" },
//     { label: "Czech Republic", value: "CZ" },
//     { label: "Denmark", value: "DK" },
//     { label: "Estonia", value: "EE" },
//     { label: "Finland", value: "FI" },
//     { label: "France", value: "FR" },
//     { label: "Georgia", value: "GE" },
//     { label: "Germany", value: "DE" },
//     { label: "Greece", value: "GR" },
//     { label: "Hungary", value: "HU" },
//     { label: "Iceland", value: "IS" },
//     { label: "Ireland", value: "IE" },
//     { label: "Italy", value: "IT" },
//     { label: "Kazakhstan", value: "KZ" },
//     { label: "Kosovo", value: "XK" },
//     { label: "Latvia", value: "LV" },
//     { label: "Liechtenstein", value: "LI" },
//     { label: "Lithuania", value: "LT" },
//     { label: "Luxembourg", value: "LU" },
//     { label: "Malta", value: "MT" },
//     { label: "Moldova", value: "MD" },
//     { label: "Monaco", value: "MC" },
//     { label: "Montenegro", value: "ME" },
//     { label: "Netherlands", value: "NL" },
//     { label: "North Macedonia", value: "MK" },
//     { label: "Norway", value: "NO" },
//     { label: "Poland", value: "PL" },
//     { label: "Portugal", value: "PT" },
//     { label: "Romania", value: "RO" },
//     { label: "Russia", value: "RU" },
//     { label: "San Marino", value: "SM" },
//     { label: "Serbia", value: "RS" },
//     { label: "Slovakia", value: "SK" },
//     { label: "Slovenia", value: "SI" },
//     { label: "Spain", value: "ES" },
//     { label: "Sweden", value: "SE" },
//     { label: "Switzerland", value: "CH" },
//     { label: "Turkey", value: "TR" },
//     { label: "Ukraine", value: "UA" },
//     { label: "United Kingdom", value: "GB" },
//     { label: "Vatican City", value: "VA" }
// ];


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
            {/* {selectedCountry && (
                <div>
                    <h3>You selected: {selectedCountry.label}</h3>
                </div>
            )} */}
        </div>
    );
};

export default CountrySelect;
