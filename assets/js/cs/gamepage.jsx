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
let messageNotifs;
var times = 0;


let gtoken = JSON.parse(localStorage.getItem("gameToken")); //caching the channel no for reconnection.

function GamePage(props) {
  let attackPercentage = 0;
  // score = updateScore();
  let attack_msg = "";

  if(gtoken && !joined){
    store.dispatch({
        type: 'SET_GAME_TOKEN',
        game_token: gtoken,
      })
  }

  console.log(props)

  let btn_panel = ko ?
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="panel-wrapper"><button className={"btn btn-success btn-panel"} onClick={() => revive()}>Revive</button></div>
          </div>
          <div className="col">
            <div className="panel-wrapper"><button type="button" className="btn btn-primary btn-panel" data-toggle="modal" data-target="#exampleModalLong">Chat</button></div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="panel-wrapper"><button onClick={() => validateLeaveGame()} className="btn btn-danger btn-panel">Forfeit</button></div>
          </div>
          <div className="col">
            <div className="panel-wrapper"><button onClick={() => showBuildingStatus()} className="btn btn-success btn-panel">Buildings</button></div>
          </div>
        </div>
      </div> :
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="panel-wrapper"><button className="btn btn-warning btn-panel" onClick={() => attack()}>Attack!</button></div>
          </div>
          <div className="col">
            <div className="panel-wrapper"><button className="btn btn-info btn-panel" id="defendBtn" onClick={() => defend()}>Defend</button></div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="panel-wrapper"><button type="button" className="btn btn-primary btn-panel" data-toggle="modal" data-target="#exampleModalLong">Chat</button></div>
          </div>
          <div className="col">
            <div className="panel-wrapper"><button onClick={() => showBuildingStatus()} className="btn btn-success btn-panel">Buildings</button></div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="panel-wrapper"><button onClick={() => validateLeaveGame()} className="btn btn-danger btn-panel">Forfeit</button></div>
          </div>
        </div>
      </div>;

  function revive() {
    console.log("REVIVE")
    let currLoc = {};
    let thisAtk = "";
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
        // alert("not close enough to snell")
        thisAtk = "Sorry! You need to be near Snell Library to revive yourself!";
        return;
      }
      else {

        channel.push("revive", {game: props.game, user_id: props.user.user_id, team: currentTeam})
        ko = false;
        // $.when(updateGameState(data)).then(channel.push("broadcast_my_state", props.game));
      }
    })
    alert_msg_notif = thisAtk;
    console.log(alert_msg_notif)
    $("#game-alert-box").empty().append(alert_msg_notif);
    $("#game-alert-box").show();
    setTimeout(function(){ $("#game-alert-box").hide(); alert_msg_notif = ""; }, 2000);

  }


  function defend(){
    console.log("DEFEND")
    let currLoc = {};
    let thisAtk = "";
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
        thisAtk = "No buildings to defend nearby!";
        // alert("no building nearby to defend")
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
    alert_msg_notif = thisAtk;
    console.log(alert_msg_notif)
    $("#game-alert-box").empty().append(alert_msg_notif);
    $("#game-alert-box").show();
    setTimeout(function(){ $("#game-alert-box").hide(); alert_msg_notif = ""; }, 2000);

  }

  var alert_msg_notif = "";


  function attack(){
    console.log("ATTACK")
    console.log(alert_msg_notif)
    let currLoc = {};
    let thisAtk = "";
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
        // console.log("ALERT")
        // console.log(alert_msg_notif)
        // alert("You are not close enough to any building to attack it!");
        thisAtk = "Not close enough.";
      }

      console.log(alert_msg_notif)
      if(attackable){
        console.log("ATTACKER")
        console.log(locationFin.attacker.team)
        if(locationFin.captured){
          thisAtk = "Building is already captured. You cannot capture that building!";
        } else if (locationFin.attacker.team != null && locationFin.attacker.team != currentTeam){
          thisAtk = "Enemy team is attacking this building. You can Defend this building by pressing the 'Defend' button";
        } else if(locationFin.attacker.user_id != null) {
          thisAtk = "Building is already under attack!";
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
    console.log(thisAtk)
    window.alert_msg_notif = thisAtk;
    // console.log(window.alert_msg_notif)
    // document.getElementById("game-alert-box").innerHTML = atkElem;
    $("#game-alert-box").empty().append(thisAtk);
    $("#game-alert-box").show();
    setTimeout(function(){ $("#game-alert-box").hide(); alert_msg_notif = ""; }, 2000);
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
console.log("JOINED"+joined)
  function joinChannel(){
    console.log("TRYING TO JOIUN")
    localStorage.setItem("gameToken", JSON.stringify(props.gameToken)); //caching the channel no for reconnection.
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

  function showBuildingStatus(){
    $("#building-screen").modal('show');
  }

  function validateLeaveGame(){
    $("#leave-game").modal('show');
  }

  function leaveGame()
  {
    localStorage.removeItem("gameToken");
    channel.push("deleteUser", {user_id: props.user.user_id, game_size: props.gameToken.game_size, game: props.game})
    channel.leave();
    joined=false;
    window.location = "/";
  }

  function sendMessage()
  {
    channel.push("sendMsg", {message: props.user.user_name + ": " + $('#chatText').val(), team: currentTeam})
  }


  function displayMessage(resp)
  {
     if(resp.srcTeam == currentTeam) {
       var text = resp.msg + "\n" + $('#chatOutput').html()
       $("#chatOutput").html(text.replace(/\n/g, "<br />"));
       $("#chatText").val("");
       messageNotifs = "New Message From " + resp.msg.substr(0, resp.msg.indexOf(":")) + " ";
     }
  }


  let game = <div></div>;
  if (props.gameToken) {


    let buildingStatus = _.map(props.game.buildings, function(x, ii){
      let status;
      if (x.captured){
        if(x.owner == "team1"){
          status = "Team GREEN";
        } else {
          status = "Team RED";
          }
      } else {
        status = "Not Captured";
      }
      return <div key={ii}>{x.name}: {status}</div>;
    });
    // let attackProgress = <div></div>;
    // if(attacking){

    // let atkPC = Math.round(parseInt($("#attackBar").css("width").substring(0, $("#attackBar").css("width").length - 2)));
    console.log("ATK PC")
    console.log(attackPercentage)
      let attackProgress = <div className="progress attack-bar">
      <div id="attackBar" className="progress-bar bg-warning progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
        <b>{attackPercentage}</b>%
      </div>
    </div>;
    // }

    let attackNotifs;
    if(currentTeam == "team1"){
      var team2Atks = props.game.team2Attacks;
      attackNotifs = _.map(team2Atks, function(x){
        var tl1 = 60;
        var countownTimer1 = setInterval(function(){
            tl1--;
            document.getElementById("countdown1").textContent = tl1;
          if(tl1 <= 0)
            tl1 = 1;
            clearInterval(countdownTimer1);
          },1000);
        return <div><p>{x.name} is under attack! You have <span id="countdown1">60</span> seconds to defend the building!</p></div>;
      });
      if(attackNotifs.length > 0){
        attack_msg = "ongoing";
        // $("#attack-alert-box").html(attackNotifs);
        $("#attack-alert-box").show();
        // setTimeout(function(){ $("#attack-alert-box").hide(); attack_msg = ""; }, 2000);
      }
    } else {
      var team1Atks = props.game.team1Attacks;
      attackNotifs = _.map(team1Atks, function(x){
        var tl2 = 60;
        var countownTimer2 = setInterval(function(){
            tl2--;
            document.getElementById("countdown2").textContent = tl2;
          if(tl2 <= 0)
            tl2 = 1;
            clearInterval(countdownTimer2);
          },1000);
        return <div><p>{x.name} is under attack! You have <span id="countdown2">60</span> seconds to defend the building!</p></div>;
      });
      if(attackNotifs.length > 0){
        attack_msg = "ongoing";
        // $("#attack-alert-box").html(attackNotifs);
        $("#attack-alert-box").show();
        // setTimeout(function(){ $("#attack-alert-box").hide(); attack_msg = ""; }, 2000);
      }
    }
    console.log("Attack MESSAGE: "+attack_msg)
    console.log(attackNotifs)


    if(!joined){
      channel = socket.channel("games:"+props.gameToken.channel_no,
      {user_id:props.user.user_id, game_size: props.gameToken.game_size, is_ranked: props.gameToken.is_ranked})
      joinChannel(props);
    }

    function gotView(view){
      if(view.game.winner != "" && times == 0)
     {
       if(view.game.winner == currentTeam){
         $('#victory-screen').modal({backdrop: 'static', keyboard: false})
         $("#victory-screen").modal('show');
       } else {
         $('#defeat-screen').modal({backdrop: 'static', keyboard: false})
         $("#defeat-screen").modal('show');
       }
        // alert(view.game.winner + " Wins!");
        times = 1;
        // window.location = "/"
      }
      else
      {
        times = 0;
        props.dispatch({
          type: 'UPDATE_GAME_STATE',
          data: view.game,
        })
      }
    }

    // console.log("ALERT!"+window.alert_msg_notif)
    if(alert_msg_notif == ""){
      $("#game-alert-box").hide();
    } else {
      $("#game-alert-box").show();

    }

    if(attackNotifs.length == 0){
      $("#attack-alert-box").hide();
    }

    channel.on("sendMsg", resp => {displayMessage(resp)[0]});

    channel.on("attack_incoming", game => {
      if(game.winner == "")
      {
        channel.push("update_state", game)
          .receive("ok", gotView.bind(this))
      }
    });

    channel.on("player_kod", resp => {
      console.log("KOOOO!!!")
      if(resp.user_id == props.user.user_id){
        clearInterval(atkInterval);
        $("#attackBar").css("width",0+"%");
        $("#attackBar").html(0+"%");
        ko = true;
        $("#revive-screen").modal('show');
      }
    })


    channel.on("state_update", game => {
        channel.push("update_state", game)
          .receive("ok", gotView.bind(this))
      });


      console.log(props)

      if(props.game.status == "Waiting For Players"){
        $('#waiting-screen').modal({backdrop: 'static', keyboard: false})
        $("#waiting-screen").modal('show');
      } else {
        $("#waiting-screen").modal('hide');
      }



    return <div>
      <div className="googleMaps">
        <CamMap buildings={props.game.buildings} status={props.game.status}/>
      </div>
      <div className="attackProgressBar">
        {attackProgress}
        <div className="container-fluid game-stats">
          <div className="row">
          <div className="col" id="teamGreenScore">
            Team Green: {props.game.team1Score}
          </div>
          <div id="teamRedScore" className="col">
            Team Red: {props.game.team2Score}
          </div>
          </div>
        </div>
        <div id="game-alert-box" className="alert alert-warning alert-dismissible fade show" role="alert" aria-hidden="true">
        </div>
        <div id="attack-alert-box" className="alert alert-danger alert-dismissible fade show" role="alert" aria-hidden="true">
          {attackNotifs}
        </div>
      </div>
      <div className="alert alert-light messageNotifications" role="alert">
        {messageNotifs}
      </div>
      <div className="btn-wrapper">
        <div className="buttonPanel">
          { btn_panel }
        </div>
      </div>


     <div className="modal fade" id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
       <div className="modal-dialog" role="document">
         <div className="modal-content">
           <div className="modal-header">
             <h5 className="modal-title" id="exampleModalLongTitle">Team Chat Box</h5>
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
            <div className="modal-body">
              <h5 className="modal-title text-center">Game Over!</h5>
              <hr/>
              <h1 style={{color: '#179b20'}}> Victory! </h1>
              <a href="/" className="btn btn-link">Back to Lobby</a>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="defeat-screen" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title">Game Over!</h5>
              <hr/>
              <h1 style={{color: '#d1193d'}}> Defeat! </h1>
              <a href="/" className="btn btn-link">Back to Lobby</a>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="waiting-screen" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title"><img src="https://i.redd.it/ounq1mw5kdxy.gif" id="modal-loading"/></h5>
              <h4> Waiting for all players to connect! </h4><br/>
              <button onClick={() => leaveGame()} className="btn btn-danger">I don't want to wait</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="leave-game" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Are you sure you want to quit?</h5>
            </div>
            <div className="modal-body">
              <p><b>You are trying to leave this game!</b> This will be considered as a <b>loss</b> to you. Are you sure?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={() => leaveGame()}>Yes, I'm sure!</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal">No, Take me back!</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="revive-screen" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title">KNOCKED OUT!</h5>
              <hr/>
              <h4>You have been <b style={{color: '#d1193d'}}>KNOCKED OUT!</b></h4>
              <h5>Go to <i>Snell Library</i> to revive yourself!</h5>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal">Okay</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="building-screen" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title">Building Status</h5>
              <hr/>
              {buildingStatus}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

  </div>;

  } else {

    return <div>Loading Game</div>;

  }

  // return game;
  // Attribution to GetBootstrap.com for the below modal template
  // https://getbootstrap.com/docs/4.0/components/modal/


}

function state2props(state) {
  console.log("rerender", state);
  return { game: state.game };
}

// Export the result of a curried function call.
export default connect(state2props)(GamePage);
// Attribution - http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/notes/20-redux/notes.html
