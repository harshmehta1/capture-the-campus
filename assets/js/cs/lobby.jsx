import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, NavItem, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api';


let Session = connect(({token}) => {return {token};})((props) => {

  function logout(){
    props.dispatch({
      type: 'CLEAR_TOKEN',
    });
  }

  console.log("SESSION")
  console.log(props)

  // let user_name = "demo";
  return <div className="navbar-text">
          Welcome, User { props.token.user_id } | <Button className="btn btn-primary" onClick={logout}>Log out</Button>
        </div>;
  });

export default function Lobby(props) {
  console.log(props)
  let logout_fn;
  if(props.token){
    logout_fn = <Session token={props.token}/>;
  } else {
      window.location = "/";
  }

  return <div><h2>Logged in</h2> { logout_fn } </div>;

  // let tasks = _.map(params.tasks, (pp) => <Task key={pp.id} user={params.user} task={pp} />);
}
