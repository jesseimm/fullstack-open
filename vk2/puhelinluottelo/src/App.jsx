import React from "react";
import Axios from "axios";

const Tietue = ({ person }) => {
  return (
    <p>
      {person.name} {person.number}{" "}
    </p>
  );
};

const Numerot = ({ persons }) => {
  return (
    <div>
      <h2>Numerot</h2>
      {persons.map(person => <Tietue key={person.name} person={person} />)}
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: "",
      newPhone: "",
      rajaus: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.getList = this.getList.bind(this);
  }

  componentDidMount() {
    Axios.get("http://localhost:3001/persons").then(response => {
      this.setState({ persons: response.data });
    });
  }

  getList() {
    const rajaus = this.state.rajaus.toLowerCase();
    const persons = this.state.persons;
    if (rajaus === "") return persons;
    return persons.filter(person => person.name.toLowerCase().includes(rajaus));
  }

  onSubmit(e) {
    e.preventDefault();
    const persons = this.state.persons.concat({
      name: this.state.newName,
      phone: this.state.newPhone
    });

    this.setState({
      persons: persons
    });
  }

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <div>
          rajaa näytettäviä:
          <input
            value={this.state.rajaus}
            onChange={e => {
              this.setState({ rajaus: e.target.value });
            }}
          />
        </div>
        <h2>Lisää uusi</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            nimi:
            <input
              value={this.state.newName}
              onChange={event => {
                this.setState({ newName: event.target.value });
              }}
            />
          </div>
          <div>
            numero:
            <input
              value={this.state.newPhone}
              onChange={event => {
                this.setState({ newPhone: event.target.value });
              }}
            />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
        <Numerot persons={this.getList()} />
      </div>
    );
  }
}

export default App;
