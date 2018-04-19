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
let attacking = false;
let currentTeam;
let score = {team1: 0, team2: 0};
let ko = false;

function GamePage(props) {
  let attackPercentage = 0;
  score = updateScore();

  console.log(props)

  let btn_panel = ko ?
      <div>
        <button className={"btn btn-success"} onClick={() => revive()}>Revive</button>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">Launch Chat</button>
        <button onClick={() => leaveGame()} className="btn btn-danger">Leave Game</button>
      </div> :
      <div>
       <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">Launch Chat</button>
       <button className="btn btn-warning" onClick={() => attack()}>Attack!</button>
       <button className="btn btn-info" id="defendBtn" onClick={() => defend()}>Defend</button>
       <button onClick={() => leaveGame()} className="btn btn-danger">Leave Game</button>
      </div>;

  //also check for wins/losses here
  function updateScore() {
    let newScore = {team1: 0, team2: 0}
    const buildings = props.game.buildings;
    _.map(buildings, function(b){
      if(b.captured) {
        newScore[b.owner]++;
      }
    })
    const enemyTeam = (currentTeam == 'team1') ? 'team2' : 'team1';
    if(newScore[currentTeam] == buildings.length) {
      $("#victory-screen").modal('show');
    }
    else if(newScore[enemyTeam] == buildings.length) {
      $("#defeat-screen").modal('show');
    }
    return newScore;
  }

  function revive() {
    console.log("REVIVE")
    let currLoc = {};
    if(!ko) {
      alert("user is already alive")
      return;
    }
    navigator.geolocation.getCurrentPosition(function(pos) {
      currLoc.lat = pos.coords.latitude;
      currLoc.lng = pos.coords.longitude;

      let buildingList = props.game.buildings;
      //let snell = props.game.reviveBuilding;
      const snell = {lat: 42.338396, lng: -71.088071}
      if(!(distanceInKmBetweenEarthCoordinates(currLoc.lat, currLoc.lng, snell.lat, snell.lng) < 90)) {
        alert("not close enough to snell")
        return;
      }
      else {
        //get currentteam
        // let team = props.game[currentTeam];
        // let player = _.filter(team, function(x) {
        //   return x['user_id'] == props.user.user_id;
        // })[0];
        // let playerIndex = team.indexOf(player)
        // player.ko = false;
        // //set global ko to false
        // ko = false
        // team[playerIndex] = player;
        // let data = {};
        // data[currentTeam] = team;

        channel.push("revive", {game: props.game, user_id: props.user.user_id, team: currentTeam})
        ko = false;
        // $.when(updateGameState(data)).then(channel.push("broadcast_my_state", props.game));
      }
    })
  }


  function defend(){
    console.log("DEFEND")
    let currLoc = {};
    navigator.geolocation.getCurrentPosition(function(pos){
      currLoc.lat = pos.coords.latitude;
      currLoc.lng = pos.coords.longitude;

      let buildingList = props.game.buildings;


      let defendableBuildings = _.filter(buildingList, function(x){
        const nearby = distanceInKmBetweenEarthCoordinates(currLoc.lat, currLoc.lng, x.lat, x.lng) < 90;
        var t = (new Date(x.attackEnds)).getTime() - (new Date()).getTime();
        var timeLeft = t/1000;
        var isTimeLeft = timeLeft > 1;
        return nearby && x.underAttack && (x.attacker.team != currentTeam) && isTimeLeft;
      });
      console.log(defendableBuildings)
      if(!defendableBuildings[0]) {
        alert("no building nearby to defend")
        return
      } else {
        var dBuilding = defendableBuildings[0];
        const attackerId = dBuilding.attacker.user_id;

        channel.push("defend", {game: props.game, building: dBuilding, team: currentTeam})

        // $.when(updateGameState(data)).then(channel.push("broadcast_my_state", props.game));
        console.log("KO THIS USER")
        // console.log(attackerId)
        channel.push("ko", {user_id: attackerId});
      }
    })
  }

  function attack(){
    console.log("ATTACK")
    let currLoc = {};
    navigator.geolocation.getCurrentPosition(function(pos){
      currLoc.lat = pos.coords.latitude;
      currLoc.lng = pos.coords.longitude;

    let buildingList = props.game.buildings;

      var locationDisList = _.filter(buildingList, function(x){
        console.log(x.name)
        console.log(x.lat, x.lng)
        return distanceInKmBetweenEarthCoordinates(currLoc.lat, currLoc.lng, x.lat, x.lng) < 90;
      });

      var locationFin;
      var buildingIndex;
      var attackable = false;
      if (locationDisList.length > 1){
        var nearest = 1000;
        _.map(locationDisList, function(x){
          var distanceOfThisBuilding = distanceInKmBetweenEarthCoordinates(currLoc.lat, currLoc.lng, x.lat, x.lng);
          if (distanceOfThisBuilding < nearest){
            nearest = distanceOfThisBuilding;
            locationFin = x;
          }
        });
        attackable = true;
      } else if (locationDisList.length == 1){
        locationFin = locationDisList[0];
        attackable = true;
      } else {
        alert("You are not close enough to any building to attack it!");
      }

      if(attackable){
        if(locationFin.captured){
          alert("You cannot capture that building!");
        } else {
        var currTime = new Date();
        currTime.setMinutes(currTime.getMinutes()+1);


        activateAttackTimer(currTime, locationFin.lat, locationFin.lng, locationFin, buildingIndex);

        channel.push("attack", {building: locationFin, game: props.game, attackingTeam: currentTeam, user_id: props.user.user_id, start_time: currTime})


        console.log(buildingIndex)
        console.log(locationFin)
        attacking = true;
      }
      }
    })
  }
  var attackTimer = 0;
  var atkInterval;

  function activateAttackTimer(d, lat, lng, locationFin, buildingIndex){
      var t = d.getTime() - (new Date()).getTime();
      console.log("TIMER")
      console.log(t)
      var tPercent = t/100;
      console.log(tPercent)
      var tSec = tPercent/100;
      attackTimer = 0;
      atkInterval = setInterval(function(){timerHelper(lat, lng, locationFin, buildingIndex);}, tPercent);
      // attackTimer = 0;
      // attackPercentage = 0;
      // attacking = false;
  }

  function timerHelper(lat, lng, building, buildingIndex) {
      navigator.geolocation.getCurrentPosition(function(pos){
        var inRange = distanceInKmBetweenEarthCoordinates(pos.coords.latitude, pos.coords.longitude, lat, lng) < 90;
        // console.log(inRange)
        if(inRange){
          attackTimer = attackTimer + 1;
          if (attackTimer == 100){
            console.log("CLEAR")

            channel.push("capture_building", {game: props.game, building: building, team: currentTeam})


            clearInterval(atkInterval);
            attackTimer = 0;
            $("#attackBar").css("width",attackTimer+"%");
            $("#attackBar").html(attackTimer+"%");
          } else {
            $("#attackBar").css("width",attackTimer+"%");
            $("#attackBar").html(attackTimer+"%");
            // console.log(attackPercentage)
          }
        } else {
          clearInterval(atkInterval);
          $("#attackBar").css("width",0+"%");
          $("#attackBar").html(0+"%");

          channel.push("cancel_attack", {game: props.game, building: building})

          //cancel attack
        }
      });

  }


  function updateGameState(data){
    props.dispatch({
      type: 'UPDATE_GAME_STATE',
      data: data,
    })
  }

  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
    var earthRadiusMeters = earthRadiusKm * 1000;

    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadiusMeters * c;
  }

  function joinChannel(){
    localStorage.setItem("channelNo", props.gameToken.channel_no); //caching the channel no for reconnection.
    channel.join()
      .receive("ok", resp => { console.log("Joined successfully"), getCurrentTeam(resp) })
      .receive("error", resp => { console.log("Unable to join", resp) });
      joined=true;
  }

  function getCurrentTeam(resp){
    console.log("CURRENT TEAM")
    var team1 = resp.game.team1;
    var team2 = resp.game.team2;
    var isInTeam1 = _.filter(team1, function(x){
      return x.user_id == props.user.user_id;
    });
    if (isInTeam1.length > 0){
      currentTeam = "team1";
    } else {
      currentTeam = "team2";
    }
    console.log(currentTeam)
  }

  function leaveGame()
  {
    channel.push("deleteUser", {user_id: props.user.user_id, game_size: props.gameToken.game_size, game: props.game})
    joined=false;
    window.location = "/";
  }

  function sendMessage()
  {
    channel.push("sendMsg", {message: "From " + props.user.user_id + ": " + $('#chatText').val(), team: currentTeam})
  }


  function displayMessage(resp)
  {
     if(resp.srcTeam == currentTeam) {
       var text = resp.msg + "\n" + $('#chatOutput').html()
       $("#chatOutput").html(text.replace(/\n/g, "<br />"));
       $("#chatText").val("");
     }
  }


  let game = <div></div>;
  if (props.gameToken) {

    // let attackProgress = <div></div>;
    // if(attacking){

    // let atkPC = Math.round(parseInt($("#attackBar").css("width").substring(0, $("#attackBar").css("width").length - 2)));
    console.log("ATK PC")
    console.log(attackPercentage)
      let attackProgress = <div className="progress attack-bar">
      <div id="attackBar" className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
        {attackPercentage}%
      </div>
    </div>;
    // }

    let attackNotifs;
    if(currentTeam == "team1"){
      var team2Atks = props.game.team2Attacks;
      attackNotifs = _.map(team2Atks, function(x){
        var t = (new Date(x.attackEnds)).getTime() - (new Date()).getTime();
        var timeLeft = t/1000;
        return <div><p>TEAM 2 is attacking building {x.name}. You have {((new Date(x.attackEnds)).getTime() - (new Date()).getTime())/1000} seconds to defend the building!</p></div>;
      });
    } else {
      var team1Atks = props.game.team1Attacks;
      attackNotifs = _.map(team1Atks, function(x){
        var t = (new Date(x.attackEnds)).getTime() - (new Date()).getTime();
        var timeLeft = t/1000;
        return <div><p>TEAM 1 is attacking building {x.name}. You have {timeLeft} seconds to defend the building!</p></div>;
      });
    }

    console.log(attackNotifs)


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

    channel.on("sendMsg", resp => {displayMessage(resp)[0]});

    channel.on("attack_incoming", game => {
      channel.push("update_state", game)
        .receive("ok", gotView.bind(this))
    });

    channel.on("player_kod", resp => {
      console.log("KOOOO!!!")
      if(resp.user_id == props.user.user_id){
        clearInterval(atkInterval);
        $("#attackBar").css("width",0+"%");
        $("#attackBar").html(0+"%");
        ko = true;
        alert("You have been KNOCKED OUT! Go to Snell Library to revive yourself!");
      }
    })


    channel.on("state_update", game => {
        if(game.winner != "")
        {
          alert(game.winner + " Wins!");
          api.resetGameToken()
          window.location = "/"
        }
        channel.push("update_state", game)
          .receive("ok", gotView.bind(this))
      });


      console.log(props)



    return <div>
      <div className="googleMaps">
        <CamMap buildings={props.game.buildings} status={props.game.status}/>
      </div>
      <div className="attackNotifications">
        {attackNotifs}
      </div>
      <div className="attackProgressBar">
        {attackProgress}
      </div>
      <div className="buttonPanel">
        { btn_panel }
      </div>

     <div className="modal fade" id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
       <div className="modal-dialog" role="document">
         <div className="modal-content">
           <div className="modal-header">
             <h5 className="modal-title" id="exampleModalLongTitle">Chat Box</h5>
             <button type="button" className="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
           <div className="modal-body" id="chatOutput">
           </div>
           <div className="modal-footer" id="chatInput">
              <input type="text" className="form-control" id="chatText" placeholder="Your message"></input>
             <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
             <button type="button" className="btn btn-primary" onClick={() => sendMessage()}>Send</button>
           </div>
         </div>
       </div>
     </div>

      <div className="modal fade" id="victory-screen" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Game over</h5>
            </div>
            <div className="modal-body">
              <h1 style={{color: '#179b20'}}> Victory! </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="defeat-screen" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Game over</h5>
            </div>
            <div className="modal-body">
              <h1 style={{color: '#d1193d'}}> Defeat! </h1>
            </div>
          </div>
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
