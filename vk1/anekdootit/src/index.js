import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0, 
      anecdotes: this.props.anecdotes.map((curr) => {return {anecdote: curr, votes: 0}}) 
    }

    this.vote = this.vote.bind(this)
    this.next = this.next.bind(this)
  }

  vote = index => {
      const anecdotes = [...this.state.anecdotes]
      anecdotes[index].votes++
      this.setState({selected: this.state.selected, anecdotes: anecdotes})
  }

  next = () => {
      const n = Math.floor((Math.random() * anecdotes.length - 1) + 1)
      this.setState({selected: n})
  }

  render() {
    const selected = this.state.anecdotes[this.state.selected]
    const mostVoted = this.state.anecdotes.reduce((most, curr) => {
        if(curr.votes > most.votes) return curr
        else return most 
    })

    return (
      <div>
          <div>
            <p>{selected.anecdote}</p>
            <p> has {selected.votes} votes</p>
          </div>
          <div>
            <button type='button' onClick={() => this.vote(this.state.selected)}>vote</button>
            <button type='button' onClick={() => {this.next()}}>next</button>
          </div>
          <div>
              <p><b>most voted with {mostVoted.votes} votes</b></p>
              <p>{mostVoted.anecdote}</p>
          </div>

      </div>
    )
  }
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)