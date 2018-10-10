import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route} from 'react-router-dom';
//import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {
    const pages = [
      {
        name: 'Home',
        path: ''
      },
      {
        name: 'Suggest Conductor',
        path: 'suggest_conductor'
      },
      {
        name: 'Conductor List',
        path: 'conductor_list'
      }
    ];

    return (
      <Router>
        <div className="App">
          <Nav pages={pages}/>
          <Route exact={true} path="/" component={AlbumSearch}/>
          <Route path="/suggest_conductor" component={SuggestConductor}/>
          <Route path="/conductor_list" component={ConductorList}/>
        </div>
      </Router>
    );
  }
}

const SuggestConductor = () => {
  return (
    <div>Suggest a conductor</div>
  )
}

const ConductorList = () => {
  return (
    <div>Conductor list</div>
  )
}

class AlbumSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      value: ''
    };

    this.onSearchValueChange = this.onSearchValueChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }
  onSearchSubmit() {
    fetch('search/?search=' + this.state.value, {mode: 'cors'})
      .then(res => res.json())
      .then(albums => {
        this.setState({
          albums: albums,
        })
      });
  }

  onSearchValueChange(value) {
    this.setState({
      value: value
    });
  }

  render() {
    const {albums} = this.state;
    return (
      <div>
        <SearchBox
          onChange={this.onSearchValueChange}
          onSubmit={this.onSearchSubmit}
          value={this.state.value}
        />
        <h2>Conductors</h2>
        {albums &&
          <ul>
            {albums.map((album, index) =>
              <ConductorDetail key={index} data={album} name={album[0].artists[0].name} />
            )}
          </ul>
        }
      </div>
    )
  }
}

class ConductorDetail extends Component {
  render() {
    const data = this.props.data;
    return (
      data &&
        <div>
          <h1>{this.props.name}</h1>
          <li>
            <ul>
              {data.map(data =>
                <AlbumDetail key={data.id} data={data} />
              )}
            </ul>
          </li>
        </div>
    )
  }
}

class AlbumDetail extends Component {
  render() {
    const data = this.props.data;
    return (
      <li className="album-detail">
        <img alt="Album cover." src={data.images[0].url} />
        <div className="album-text">
          <h3>{data.name}</h3>
          <div>
            {data.artists.map((artist, index) =>
              <p key={index}>{artist.name}</p>
            )}
          </div>
        </div>
      </li>
    );
  }
}

class Nav extends Component {
  render() {
    const {pages} = this.props;
    return (
      pages ? (
        <ul>
          {
            pages.map(page => (
              <li key={page.path}>
                <Link to={`/${page.path}`}>
                  {page.name}
                </Link>
              </li>
            ))
          }
        </ul>
      ) : (
        <div>No Page...</div>
      )
    )
  }
}

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
        Search:
          <input type="text" id="search_term" value={this.props.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default App;
