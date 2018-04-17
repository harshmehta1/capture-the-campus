import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Login from './login';
import { Link,  Redirect, withRouter } from 'react-router-dom';
import Lobby from './lobby';
import GamePage from './gamepage';
import api from '../api';

export default function captureCampus_init(store){
  let root = document.getElementById('root');
  ReactDOM.render(<Provider store={store}>
                  <CaptureCampus state={store.getState()} /></Provider>, root);
}

let CaptureCampus = connect((state) => state)((props) => {

  //Authentication Validation
  let isLoggedIn;
  let isInGame;
  let gameToken;
  let page = <div></div>;
  if (props.token){
    isLoggedIn = true;
    page =   <div>
        <Lobby token={props.token} />
    </div>;
  } else {
    let exisitingToken = JSON.parse(localStorage.getItem("user_token"));

    if(exisitingToken){
      isLoggedIn = true;
      api.set_token(exisitingToken);
    } else {
      isLoggedIn = false;
      page = <div><Login /></div>;
    }

  }
  // gameToken = localStorage.getItem("channelNo");
  //
  // if(gameToken){
  //   isInGame = true;
  // } else {
  //   isInGame = false;
  // }

  //Authentication Ends
  //Channel broadcast receiver

  return (
    <Router>
      <div>
        <Route path="/" exact={true} render={() =>
          page
        } />
      <Route path="/game" exact={true} render={() =>
          (isLoggedIn === true) ? <GamePage gameToken={props.gameToken} user={props.token}/> : <Redirect to="/"/>
        }/>
      </div>
    </Router>
  );
});
