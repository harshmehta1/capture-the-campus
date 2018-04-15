import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, NavItem, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api';
import Map from './map';


export default function GamePage(props) {

  let btn_panel = <div>
     <button className="btn btn-danger">Attack!</button>
     <button className="btn btn-info" id="defendBtn">Defend</button></div>;

// for when ko is added to state
  // if (props.ko){
  //   btn_panel = <div><button className="btn">Revive</button></div>
  // }

  return <div>
    <div className="googleMaps">
      <h4>Google Map Component</h4>
      <Map isMarkerShown />
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

}
