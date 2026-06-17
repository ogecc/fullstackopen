import { useState } from 'react'

const Button = (props) => {
  return (
    <div>
      <button onClick={props.onClick}>{props.text}</button>
    </div>
  )
}

const StatisticLine = ({text,value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  
  if (all === 0){
      return <p>No feedback given</p>
    }
  
  return ( 
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive + '%'} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => setGood(good + 1)
  const handleClickNeutral = () => setNeutral(neutral + 1)
  const handleClickBad = () => setBad(bad + 1)

  const all = good + neutral + bad
  const average = (good-bad)/all
  const positive = (good/all)*100

  const stats = { good,neutral,bad,all,average,positive}

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleClickGood} text="good"/>
      <Button onClick={handleClickNeutral} text="neutral"/>
      <Button onClick={handleClickBad} text="bad"/>
      <Statistics {...stats}/>
    </div>
  )
}

export default App