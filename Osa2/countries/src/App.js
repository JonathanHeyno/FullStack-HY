import { useState, useEffect } from 'react'
import axios from 'axios'


const Button = ({ handleClick, country, text }) => 
    <button onClick={handleClick(country)}>
      {text}
    </button>

const WithoutWeather = ({ country, languages }) => {
  return(
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h3>languages:</h3>
      
      <ul>
      {languages.map(language => <li key={language}>{language}</li>)}
      </ul>
  
      <div><img src={country.flags.svg} alt='flag' style={{width : '9em'}}></img></div>
  
      <br></br>
      <h2>Weather in {country.capital}</h2>
      
      <p>Failed to get weather data. Weather server down. Try again later</p>
    </div>
    )
}

const WithWeather = ({ country, languages, weather }) => {
  return(
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h3>languages:</h3>
      
      <ul>
      {languages.map(language => <li key={language}>{language}</li>)}
      </ul>
  
      <div><img src={country.flags.svg} alt='flag' style={{width : '9em'}}></img></div>
  
      <br></br>
      <h2>Weather in {country.capital}</h2>
      
      <p>temperature {weather.current_weather.temperature} Celcius</p>
  
      <p>wind {weather.current_weather.windspeed} m/s</p>
  
  
  
      <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a> 
    </div>
    )
}


const Info = ({ country }) => 
{
  const languages = Object.values(country.languages)
  const [weather, setWeather] = useState([])

  let apiString = 'https://api.open-meteo.com/v1/forecast?latitude='.concat(country.latlng[0], '&longitude=', country.latlng[1], '&hourly=temperature_2m&current_weather=true')

  useEffect(() => {
    axios
      .get(apiString)
      .then(response => {
        setWeather(response.data)
      })
  }, [])

  if (weather.length === 0) {
    return (
    <WithoutWeather country={country} languages={languages}/>
    )
  }
  else {
    return (
    <WithWeather country={country} languages={languages} weather={weather}/>
    )
  }
}

const List = ({ country, handleClick }) => 
  <p>{country.name.common} <Button handleClick={handleClick} country={country.name.common} text='show' /></p>

const Countries = ({ countries, query, handleClick }) => {
  if (!query) {
    return;
  }
  const countriesFound = countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()));
  if (countriesFound.length > 10){
    return (<div>Too many matches, specify another filter</div>)
  }
  if (countriesFound.length === 1){
    return (
      countriesFound.map(country => <Info key={country.name.common} country={country} />)
    )
  }
  return (
    countriesFound.map(country => <List key={country.name.common} country={country} handleClick={handleClick} />)
  )
}

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [query, setQuery] = useState('')


  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])


  const handleQuery = (event) => {
    setQuery(event.target.value)
  }

  const handleClick = (country) => {
    const handler = () => {
      setQuery(country)
    }
  
    return handler
  }

  return (
    <div>
      <div>find countries <input value={query} onChange={handleQuery} /></div>
    
      <Countries countries={countries} query={query} handleClick={handleClick}/>
    </div>
  )
}

export default App