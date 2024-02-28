import React from 'react';
import {Table} from './components';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
  <Router>
    <div className="App" >
    <Link to="/table/create">Create</Link>
    <Link to="/table/join">join</Link>
      <Switch>
        <Route exact path="/">
          <Table />
        </Route>
      </Switch>
    </div>
  </Router>
  );
}

export default App;
