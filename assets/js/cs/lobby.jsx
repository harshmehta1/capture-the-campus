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
    localStorage.clear();
  }



  console.log("SESSION")
  console.log(props.token)

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
  //api.get_existing_games(props.token.user_id);
  return <div className="container">
    <div className="row">
      <div className="col-6 logo-mini">
        <h5><i className="fas fa-flag-checkered"></i> Capture the Campus!</h5>
      </div>
      <div className="col-3 offset-3">
        { logout_fn }
      </div>
    </div>
    <div className="row">
      <div className="col game-fn">
        <h4>Select a PvP game to play:</h4>
        <div className="form-group">
          <label className="radio-inline" style={{marginTop:10}}><input type="radio" name="pvp" value="2"/><h2>1v1</h2></label>
          <label className="radio-inline" style={{marginLeft:20}}><input type="radio" name="pvp" value="4"/><h2>2v2</h2></label>
          <label className="radio-inline" style={{marginLeft:20}}><input type="radio" name="pvp" value="6"/><h2>3v3</h2></label>
          <label className="radio-inline" style={{marginLeft:20}}><input type="radio" name="pvp" value="8"/><h2>4v4</h2></label><br/>
          <Link to="/game"><Button className="btn-xl btn-warning" onClick={() => api.findMatch(props.token.user_id, $("input[name=pvp]:checked").val())}>Find Match</Button></Link>
        </div>
      </div>
    </div>


    </div>;

  // let tasks = _.map(params.tasks, (pp) => <Task key={pp.id} user={params.user} task={pp} />);
}
