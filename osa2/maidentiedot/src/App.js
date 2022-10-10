import { useState, useEffect } from 'react'
import axios from 'axios'

const Display = ({ matches, setInput }) => {
  const handleClick = (country) => {
    setInput(country)
  }

  if (matches.length > 10) {
    return (<div>Too many matches, specify another filter</div>)
  } else if (matches.length === 1) {
    return (
      <div>
        <CountryInfo country={matches[0]}/>
        <Weather capital={matches[0].capital}/>
      </div>
      )
  } else {
    return (
      <div>
      {matches.map(country => 
        <p key={country.name.common}>
          {country.name.common}
          <button onClick={() => handleClick(country.name.common)}>info</button>
        </p>
      )}
    </div>
    )
  }
}

const CountryInfo = ({ country }) => {
  console.log(country)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => 
          <li key={language}> 
            {language} 
          </li>
        )}
      </ul>
      <img src={country.flags.png} width="150px" height="auto"></img>
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState()
  const api_key = process.env.REACT_APP_API_KEY
  console.log(weather)

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital[0]}&appid=${api_key}&units=metric`)
      .then(response => {
        console.log(`weather of ${capital} fetched`)
        setWeather(response.data)
        console.log(weather, response.data)
      })
  }, [])

  if (!weather) {
    return null
  } else {
    return (
      <div>
        <h2>Weather in {capital}</h2>
          <p>
            temperature {weather.main.temp} Celsius
          </p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} width="150px" height="auto"></img>
          <p>
            wind {weather.wind.speed} m/s
          </p>
      </div>
    )
  }
}

const App = () => {
  const [input, setInput] = useState('')
  const [data, setData] = useState([])

  const handleChange = (event) => {
    setInput(event.target.value)
  }

  const countriesToShow = data.filter(country => 
    country.name.common.toLowerCase().includes(input.toLowerCase()))

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setData(response.data)
      })
  }, [])
  console.log('render', data.length, 'countries')
  console.log('maita on ', countriesToShow.length)

  return (
    <div>
      <form>
        find countries
        <input value={input} onChange={handleChange} />
      </form>
      <Display matches={countriesToShow} setInput={setInput}/>
    </div>
  )
}

export default App