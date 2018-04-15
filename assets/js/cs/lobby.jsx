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

  return <div className="container">
    <div className="row">
      <div className="col offset-9">
        { logout_fn }
      </div>
    </div>
    <div className="row">
      <div className="col">
        <div className="form-group">
          <label htmlFor="new-game">New Game: </label>
          <input type="text" className="form-control" placeholder="Game Name" id="new-game"/>
          <label className="radio-inline" style={{marginTop:10}}><input type="radio" name="pvp"/>2v2</label>
          <label className="radio-inline" style={{marginLeft:20}}><input type="radio" name="pvp"/>3v3</label>
          <label className="radio-inline" style={{marginLeft:20}}><input type="radio" name="pvp"/>4v4</label><br/>
          <button className="btn btn-success">Create Game</button>

        </div>
      </div>
      <div className="col">
        <div className="form-group">
          <label htmlFor="exisiting-game">Existing Games:</label>
          <select className="form-control" id="exisiting-game">
            <option>
              Sample
            </option>
            <option>
              Sample 2
            </option>
          </select><br/>
        <Link to="/game"><button className="btn btn-primary">Join Game</button></Link>
        </div>
      </div>
    </div>


    </div>;

  // let tasks = _.map(params.tasks, (pp) => <Task key={pp.id} user={params.user} task={pp} />);
}
