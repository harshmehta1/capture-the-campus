import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Login from './login';
import { Link } from 'react-router-dom';
import Lobby from './lobby';
import GamePage from './gamepage';
import api from '../api';

export default function captureCampus_init(store){
  let root = document.getElementById('root');
  ReactDOM.render(<Provider store={store}>
                  <CaptureCampus state={store.getState()} /></Provider>, root);
}

let CaptureCampus = connect((state) => state)((props) => {


  let page = <div></div>;
  if (props.token){
    page =   <div>
        <Lobby token={props.token} />
    </div>;
  } else {
    let exisitingToken = JSON.parse(localStorage.getItem("user_token"));

    if(exisitingToken){
      api.set_token(exisitingToken);
    } else {
      page = <div><Login /></div>;
    }
  }
  return (
    <Router>
      <div>
        <Route path="/" exact={true} render={() =>
          page
        } />
      <Route path="/game" exact={true} render={() =>
          <GamePage />
        }/>
      </div>
    </Router>
  );
});
