import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, NavItem, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api';
import CampusMap from './map-campus';
import socket from '../socket';
import store from '../store';


let joined = false;
let channel;


function joinChannel(props){
  localStorage.setItem("channelNo", props.gameToken.channel_no); //caching the channel no for reconnection.
  channel.join()
    .receive("ok", console.log("Joined successfully"))
    .receive("error", resp => { console.log("Unable to join", resp) });
    joined=true;
}

function GamePage(props) {
  console.log(props)
  let btn_panel = <div>
     <button className="btn btn-danger">Attack!</button>
     <button className="btn btn-info" id="defendBtn">Defend</button>
     <Link to="/" onClick={() => api.leaveGame(props.props.token.user_id, props.props.game.game_size, props.props.channel)}>Leave Game</Link>
 </div>;
       console.log("GAME PAGE")
       console.log(props)

// for when ko is added to state
  // if (props.ko){
  //   btn_panel = <div><button className="btn">Revive</button></div>
  // }
  // channel = socket.channel("games:"+props.gameToken, {"user_id":props.user.user_id});

  let game = <div></div>;
  if (props.gameToken) {

    channel = socket.channel("games:"+props.gameToken.channel_no,
    {user_id:props.user.user_id, game_size: props.gameToken.game_size})

    if(!joined){
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

    game = <div>
      <div className="googleMaps">
        <CampusMap isMarkerShown />
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

    game = <div>Loading Game</div>;

  }

  return game;

}

function state2props(state) {
  console.log("rerender", state);
  return { game: state.game };
}

// Export the result of a curried function call.
export default connect(state2props)(GamePage);
// Attribution - http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/notes/20-redux/notes.html
