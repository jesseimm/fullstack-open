import React from 'react'
import ReactDOM from 'react-dom'

const Otsikko = (props) => <h1>{props.kurssi}</h1>
const Osa = (props) => <p>{props.nimi} {props.tehtavia}</p>
const Sisalto = (props) => {
    return (
        <div>
            {props.osat.map((osa) => {
                return <Osa key={osa.nimi} {...osa}/> 
            })}
        </div>
    )
}

const Yhteensa = (props) => <p>yhteensä {props.tehtavat} tehtävää</p>

const App = () => {
    const kurssi = {
        nimi: 'Half Stack -sovelluskehitys',
        osat: [
            {
                nimi: 'Reactin perusteet',
                tehtavia:  10
            },
            {
                nimi: 'Tiedonvälitys propseilla',
                tehtavia: 7
            },
            {
                nimi:  'Komponenttien tila',
                tehtavia: 14
            }
        ]
    }
  return (
    <div>
        <Otsikko kurssi={kurssi.nimi}/>
        <Sisalto osat={kurssi.osat}/>
        <Yhteensa tehtavat={
            kurssi.osat.reduce((accumalator, current) => accumalator + current.tehtavia, 0)}/>  
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)