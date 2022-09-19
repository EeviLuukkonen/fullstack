import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Title = props => <h1>{props.title}</h1>

const Statistics = ({ good, neutral, bad }) => {  
  const all = good + neutral + bad

  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <div>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {all}</p>
      <p>average {(good*1 + neutral*0 + bad*-1)/all}</p>
      <p>positive {good/all*100} %</p>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = newValue => {
    console.log("good value now", newValue)
    setGood(newValue)
  }

  const setToNeutral = newValue => {
    console.log("neutral value now", newValue)
    setNeutral(newValue)
  }

  const setToBad = newValue => {
    console.log("bad value now", newValue)
    setBad(newValue)
  }

  return (
    <div>
      <Title title="Give Feedback!"/>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToBad(bad + 1)} text="bad" />
      <Title title="Statistics:" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App