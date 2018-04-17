import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, NavItem, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api';
import CamMap from './map-campus';
import socket from '../socket';
import store from '../store';


let joined = false;
let channel;
let currPos;


function GamePage(props) {
  console.log(props)
  let btn_panel = <div>
     <button className="btn btn-danger">Attack!</button>
     <button className="btn btn-info" id="defendBtn">Defend</button>
     <Link to="/" onClick={() => leaveGame()}><button className="btn btn-default">Leave Game</button></Link></div>;

// for when ko is added to state
  // if (props.ko){
  //   btn_panel = <div><button className="btn">Revive</button></div>
  // }
  // channel = socket.channel("games:"+props.gameToken, {"user_id":props.user.user_id});

  function joinChannel(){
    // navigator.geolocation.watchPosition(function(pos){
    //   currPos = {
    //     lat: pos.coords.latitude,
    //     lng: pos.coords.longitude,
    //   }
    //   console.log(pos.coords.latitude)
    //   console.log(pos.coords.longitude)
    // });
    localStorage.setItem("channelNo", props.gameToken.channel_no); //caching the channel no for reconnection.
    channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp)})
      .receive("error", resp => { console.log("Unable to join", resp) });
      joined=true;
  }

  function leaveGame()
  {
    channel.push("deleteUser", {user_id: props.user.user_id, game_size: props.gameToken.game_size, game: props.game})
  }

  let game = <div></div>;
  if (props.gameToken) {


    if(!joined){
      channel = socket.channel("games:"+props.gameToken.channel_no,
      {user_id:props.user.user_id, game_size: props.gameToken.game_size})
      joinChannel(props);
    }

    function gotView(view){
      props.dispatch({
        type: 'UPDATE_GAME_STATE',
        data: view.game,
      })
    }

    channel.on("state_update", game => {
        channel.push("update_state", game)
          .receive("ok", gotView.bind(this))
      });

      console.log(props)

    return <div>
      <div className="googleMaps">
        <CamMap buildings={props.game.buildings}/>
      </div>
      <div className="buttonPanel">
        { btn_panel }
      </div>
      <div className="chatPanel">
        <div id="chatPage"></div>
        <div className="chatInput">
          <form className="form-inline">
            <div className="form-group" id="chatBox">
              <input type="text" className="form-control" id="chatText" placeholder="Your message"></input>
              <button id="chatSend" className="btn btn-success btn-sm">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>;

  } else {

    return <div>Loading Game</div>;

  }

  // return game;

}

function state2props(state) {
  console.log("rerender", state);
  return { game: state.game };
}

// Export the result of a curried function call.
export default connect(state2props)(GamePage);
// Attribution - http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/notes/20-redux/notes.html
