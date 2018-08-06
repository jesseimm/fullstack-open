import React from "react";
import Persons from "./services/persons";

const Tietue = ({ person, removePerson }) => {
  return (
    <p>
      {person.name}
      {person.number}
      <button onClick={() => removePerson(person.id)}>remove</button>
    </p>
  );
};

const Numerot = ({ persons, removePerson }) => {
  return (
    <div>
      <h2>Numerot</h2>
      {persons.map(person => (
        <Tietue key={person.id} person={person} removePerson={removePerson} />
      ))}
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: "",
      newNumber: "",
      rajaus: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.getList = this.getList.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.updatePersons = this.updatePersons.bind(this);
  }

  componentDidMount() {
    Persons.getAll().then(persons => {
      this.setState({ persons: persons.data });
    });
  }

  removePerson(id) {
    Persons.remove(id);
    this.setState({
      persons: this.state.persons.filter(person => person.id !== id)
    });
  }

  updatePersons() {
    Persons.getAll().then(persons => {
      this.setState({ persons: persons.data });
    });
  }

  getList() {
    const rajaus = this.state.rajaus.toLowerCase();
    const persons = this.state.persons;
    if (rajaus === "") return persons;
    return persons.filter(person => person.name.toLowerCase().includes(rajaus));
  }

  changeNumber(newPerson)

  onSubmit(e) {
    e.preventDefault();
    const newPerson = {
      name: this.state.newName,
      number: this.state.newNumber
    };

    const person = this.state.persons.find(
      person => person.name === newPerson.name
    );

    person
      ? Persons.update(person.id, newPerson).then(this.updatePersons)
      : Persons.create(newPerson).then(this.updatePersons);
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
              value={this.state.newNumber}
              onChange={event => {
                this.setState({ newNumber: event.target.value });
              }}
            />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
        <Numerot persons={this.getList()} removePerson={this.removePerson} />
      </div>
    );
  }
}

export default App;
