import React from 'react';
import ReactDOM from 'react-dom';

const Otsikko = ({otsikko}) => <h1>{otsikko}</h1>
const Statistic = ({nimi, palaute}) => <p>{nimi} {palaute}</p>
const Statistics = ({statistics}) => {
    return statistics.map((statistic) => {
            return <Statistic key={statistic.nimi} {...statistic}/>
        })
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
        console.log
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