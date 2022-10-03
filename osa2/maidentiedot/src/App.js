import { useState, useEffect } from 'react'
import axios from 'axios'

const Display = ({ matches }) => {
    if (matches.length > 10) {
      return (<div>Too many matches, specify another filter</div>)
    } else if (matches.length === 1) {
      return (<CountryInfo country={matches[0]}/>)
    } else {
      return (<div>{matches.map(country => 
        <p key={country.name.common}>{country.name.common}</p>)}</div>)
    }
}

const CountryInfo = ({ country }) => {
  console.log(country.languages)
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

const App = () => {
  const [input, setInput] = useState('')
  const [data, setData] = useState([])

  const handleChange = (event) => {
    setInput(event.target.value)
    console.log(event.target.value)
  }

  const countriesToShow = data.filter(country => 
    country.name.common.toLowerCase().includes(input.toLowerCase()))

  useEffect(() => {
    console.log('effect')
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
      <Display matches={countriesToShow}/>
    </div>
  )
}

export default App