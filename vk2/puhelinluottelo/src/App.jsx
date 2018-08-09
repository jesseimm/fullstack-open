import React from "react";
import Persons from "./services/persons";
import "./App.css";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="error">{message}</div>;
};

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
      rajaus: "",
      notification: null
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.getList = this.getList.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.updatePersons = this.updatePersons.bind(this);
    this.notify = this.notify.bind(this);
  }

  componentDidMount() {
    Persons.getAll().then(persons => {
      this.setState({ persons: persons.data });
    });
  }

  removePerson(id) {
    Persons.remove(id).then(this.notify("Person was removed."));
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

  getPersonId(newPerson) {
    const person = this.state.persons.find(
      person => person.name === newPerson.name
    );

    return person ? person.id : undefined;
  }

  changeNumber(newPerson) {
    const id = this.getPersonId(newPerson);
    if (id) {
      Persons.update(id, newPerson)
        .then(this.updatePersons)
        .then(this.notify("jeejee"));
    }
    return id;
  }

  notify(message) {
    this.setState({ notification: message });
    setTimeout(() => {
      this.setState({ notification: null });
    }, 3000);
  }

  onSubmit(e) {
    e.preventDefault();
    const newPerson = {
      name: this.state.newName,
      number: this.state.newNumber
    };

    if (!this.changeNumber(newPerson)) {
      Persons.create(newPerson)
        .then(this.updatePersons)
        .then(this.notify("Person was added."));
    }
  }

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <div>
          <Notification message={this.state.notification} />
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
