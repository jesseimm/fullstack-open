import React from "react";
import Axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      input: ""
    };
  }

  componentDidMount() {}

  search(partialName) {
    Axios.get("https://restcountries.eu/rest/v2/name/" + partialName).then(
      response => {
        this.setState({
          countries: response.data,
          selected: ""
        });
      }
    );
  }

  click = country => {
    this.setState({ input: country.name }, () => this.search(country.name));
  };

  render() {
    return (
      <div>
        <div>
          find countries:
          <input
            value={this.state.input}
            onChange={e => {
              this.setState({ input: e.target.value });
              this.search(e.target.value);
            }}
          />
        </div>
        <Countries countries={this.state.countries} click={this.click} />
      </div>
    );
  }
}

const Countries = ({ countries, click }) => {
  if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />;
  } else {
    return countries.map(country => (
      <Country key={country.name} country={country} click={click} />
    ));
  }
};

const Country = ({ country, click }) => {
  return <div onClick={() => click(country)}> {country.name}</div>;
};

const CountryInfo = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>Capital: {country.capital}</div>
      <div>Population: {country.population}</div>
      <div>
        <img src={country.flag} style={{ width: "150px" }} />
      </div>
    </div>
  );
};

export default App;
