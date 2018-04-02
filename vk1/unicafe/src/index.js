import React from 'react';
import ReactDOM from 'react-dom';



const Otsikko = ({otsikko}) => <h1>{otsikko}</h1>

const Statistic = ({nimi, palaute}) => <tr><td>{nimi}</td><td>{palaute}</td></tr>

const Statistics = ({statistics}) => {
    const statsAvg = statistics.reduce((acc, curr) => {
        const nimi = curr.nimi
        const palaute = curr.palaute

        if(nimi === 'hyva') return acc + palaute * 1
        else if(nimi === 'neutraali') return acc + 0
        else return acc + palaute * -1
    }, 0)

    const positives = statistics.find(curr => curr.nimi === 'hyva').palaute
    const all = statistics.reduce((acc, curr) => {return acc + curr.palaute}, 0)
    const positivesPercentage = (positives / all * 100).toFixed(1)

    if(all > 0) {
        return (
            <table>
                <tbody>
                    {statistics.map((statistic) => {
                        return <Statistic key={statistic.nimi} {...statistic}/>
                    })}

                    <Statistic nimi={'keskiarvo'} palaute={statsAvg} />           
                    <Statistic nimi={'positiivisia'} palaute= {positivesPercentage + '%'} />
                </tbody>
            </table>
        )
    } else {
        return (
            <p>ei yhtään palautetta</p>
        )
    } 
}

const Button = ({nimi, onclick}) => <button onClick={() => onclick(nimi)}>{nimi}</button> 

const Buttons = ({nimet, onclick}) => 
        nimet.map(nimi => 
                    <Button
                        key={nimi}
                        nimi={nimi} 
                        onclick={onclick} 
                    />)

class App extends React.Component {
       constructor(props) {
        super(props)

        this.state = {
            fields: [
                {
                    nimi: 'hyva',
                    palaute: 0
                },
                {
                    nimi: 'neutraali',
                    palaute: 0
                },
                {
                    nimi: 'huono',
                    palaute: 0
                }
            ] 
        }
    }

    accOnClick = (nimi) => {
        const newFields = this.state.fields.slice()
        const i = newFields.findIndex(element => element.nimi === nimi)
        const oldObject = newFields[i]
        newFields[i] = {...oldObject, palaute: oldObject.palaute + 1}
        this.setState({
            fields: newFields
        })
    }

    render() {
        return (
            <div>
                <Otsikko otsikko={'anna palautetta'} />
                <Buttons 
                    nimet={this.state.fields.map(field => field.nimi)} 
                    onclick={this.accOnClick} />

                <Otsikko otsikko={'statistiikka'} />
                <Statistics statistics={this.state.fields} />
            </div>
        )
    }   
}

ReactDOM.render(<App/>, document.getElementById('root'));