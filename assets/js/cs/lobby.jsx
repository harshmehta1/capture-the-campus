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
          Welcome, { props.token.user_name } | <Button className="btn btn-primary" onClick={logout}>Log out</Button>
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
          <div className="row">
            <div className="col-sm-3">
              <label className="radio-inline" style={{marginTop:10}}><input type="radio" name="pvp" value="2"/><h2>1v1</h2></label>
            </div>
            <div className="col-sm-3">
              <label className="radio-inline"><input type="radio" name="pvp" value="4"/><h2>2v2</h2></label>
            </div>
            <div className="col-sm-3">
              <label className="radio-inline"><input type="radio" name="pvp" value="6"/><h2>3v3</h2></label>
            </div>
            <div className="col-sm-3">
              <label className="radio-inline"><input type="radio" name="pvp" value="8"/><h2>4v4</h2></label><br/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 btn-panel">
              <Link to="/game"><Button className="col btn-xl btn-info"
                onClick={() => api.findMatch(props.token.user_id, $("input[name=pvp]:checked").val())}>Play Ranked</Button></Link>
            </div>
            <div className="col-sm-6 btn-panel">
              <Link to="/game"><Button className="col btn-xl btn-warning"
                onClick={() => api.findunrankedMatch(props.token.user_id, $("input[name=pvp]:checked").val())}>Play Unranked</Button></Link>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-5"></div>
            <div className="col-sm-2" style={{padding: '1vh'}}>
              <button type="button" className="btn btn-primary btn-panel" data-toggle="modal" data-target="#instructions">Instructions</button>
            </div>
            <div className="col-sm-5"></div>
          </div>
        </div>
      </div>
    </div>


    <div className="modal fade" id="instructions" tabIndex="-1" role="dialog" aria-labelledby="instructionsTitle" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="instructionsTitle">Instructions</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
          <div className="modal-body">
            <ol>
              <li style={{padding: '3px'}}>Select a gamemode (ranked vs unranked) and a game size (1, 2, 3 or 4 person teams)</li>
              <li style={{padding: '3px'}}>Wait for all players to join the game</li>
              <li style={{padding: '3px'}}>The game will take a few seconds to get your position</li>
              <li style={{padding: '3px'}}>Your team's points are equal to the number of buildings you have captured</li>
              <li style={{padding: '3px'}}>The buildings' names are noted in a box on-screen</li>
              <li style={{padding: '3px'}}>To capture a building, you must go close enough to it and press the "Attack!" button (in the bottom right) to start an on-screen countdown</li>
              <li style={{padding: '3px'}}>After a minute, the countdown will be over and the building will be under your team's control</li>
              <li style={{padding: '3px'}}>If you notice an opponent capturing a building, you can go to that building and press the "Defend" button. Doing so will interrupt the opponent's capture and knock out that specific player. This can happen to you while you're capturing a building!</li>
              <li style={{padding: '3px'}}>If you are knocked out, you cannot attack or defend buildings. You must go to Snell Library and revive yourself by pressing the "Revive" button</li>
              <li style={{padding: '3px'}}>To win a game, a team must capture all three of the target buildings</li>
              <li style={{padding: '3px'}}>Additionally, a team can forfeit with the "Forfeit" button, granting the other team the victory</li>
              <li style={{padding: '3px'}}>To chat with your team, press the "Chat" button to open up the chat-box</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    </div>;


  // let tasks = _.map(params.tasks, (pp) => <Task key={pp.id} user={params.user} task={pp} />);
}
