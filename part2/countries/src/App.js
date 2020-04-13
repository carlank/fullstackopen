import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Weather = ({city}) => {
  const [weather, setWeather] = useState('');
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${city}`)
      .then(res=>{
        setWeather(res.data.current.weather_descriptions[0]);
        setTemp(res.data.current.temperature);
      })
  }, [city]);

  return <div><p>Weather: {weather}</p><p>Temperature: {temp} C</p></div>;

};

const CountryDetail = ({country}) => (
  <div>
    <h1>{country.name}</h1>
    <h2>Basic Info</h2>
    <p>Capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <img alt={`Flag of ${country.name}`} src={country.flag} width="25%" style={{border: '1px solid black'}}/>
    <h2>Current Weather in {country.capital}:</h2>
    <Weather city={country.capital} />
  </div>
);

const CountryEntry = ({country, handleExpand}) => (
  <div><p>{country.name} <button onClick={handleExpand}>Show</button></p></div>
);

const App = () => {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const visibleCountries = query !== '' ? countries.filter(p => RegExp(query, 'i').test(p.name)) : countries;

  useEffect(() => {
    axios
      .get(`https://restcountries.eu/rest/v2/all`)
      .then(res => {
        setCountries(res.data);
      })
  }, []);

  return (
    <div>
      <h1>Countries of the World</h1>
      Search: <input value={query} onChange={e=>setQuery(e.target.value)}/> <button onClick={_=>setQuery('')}>Clear</button>
      {visibleCountries.length > 10 ? <p>Too Many Matches</p> : 
        visibleCountries.length === 1 ? visibleCountries.map(e=><CountryDetail key={e.name} country={e} />) : visibleCountries.map(e=><CountryEntry key={e.name} country={e} handleExpand={_=>setQuery(e.name)}/>)}
    </div>
  );
}

export default App;
