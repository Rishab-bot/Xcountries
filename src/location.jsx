import React, { useEffect, useState } from "react";
import axios from "axios";

export function SetLocation() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState(null);

  // Fetch all countries 
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await axios.get(
          "https://crio-location-selector.onrender.com/countries"
        );
        setCountries(response.data); 
      } catch (error) {
        setError(error.message);
        console.error("Error fetching countries:", error.message);
      }
    }
    fetchCountries();
  }, []);

  // Fetch states based on the selected country
  useEffect(() => {
    if (selectedCountry) {
      async function fetchStates() {
        try {
          const response = await axios.get(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
          );
          setStates(response.data); 
        } catch (error) {
          setError(error.message);
          console.error("Error fetching states:", error.message);
        }
      }
      fetchStates();
    } else {
      setStates([]); 
    }
  }, [selectedCountry]);

  // Fetch cities based on the selected country and state
  useEffect(() => {
    if (selectedState && selectedCountry) {
      async function fetchCities() {
        try {
          const response = await axios.get(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
          );
          setCities(response.data); // Set city data
        } catch (error) {
          setError(error.message);
          console.error("Error fetching cities:", error.message);
        }
      }
      fetchCities();
    } else {
      setCities([]); 
    }
  }, [selectedState, selectedCountry]);

  // Handle changes for country selection
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedState(""); 
    setSelectedCity("");  
  };

  // Handle changes for state selection
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");  
  };

  // Handle changes for city selection
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div>
      <h1>Select Location</h1>

      
      <select onChange={handleCountryChange} value={selectedCountry}>
        <option value="">Select a country</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>

     
      <select
        onChange={handleStateChange}
        value={selectedState}
        disabled={!selectedCountry}
      >
        <option value="">Select a state</option>
        {states.map((state, index) => (
          <option key={index} value={state}>
            {state}
          </option>
        ))}
      </select>

      
      <select
        onChange={handleCityChange}
        value={selectedCity}
        disabled={!selectedState}
      >
        <option value="">Select a city</option>
        {cities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>

      
      {selectedCity && selectedState && selectedCountry && (
        <p>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}

      
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
