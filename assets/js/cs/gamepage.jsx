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
function GamePage(props) {
  let attackPercentage = 0;

  console.log(props)
  let btn_panel = <div>
     <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">Launch Chat</button>
     <button className="btn btn-danger" onClick={() => attack()}>Attack!</button>
     <button className="btn btn-info" id="defendBtn" onClick={() => defend()}>Defend</button>
     <Link to="/" onClick={() => leaveGame()}><button className="btn btn-default">Leave Game</button></Link></div>;

// for when ko is added to state
  // if (props.ko){
  //   btn_panel = <div><button className="btn">Revive</button></div>
  // }
  // channel = socket.channel("games:"+props.gameToken, {"user_id":props.user.user_id});

  function defend(){
    console.log("DEFEND")
    let currLoc = {};
    navigator.geolocation.getCurrentPosition(function(pos){
      currLoc.lat = pos.coords.latitude;
      currLoc.lng = pos.coords.longitude;

      let buildingList = props.game.buildings;
      // let enemyTeam;
      // if(currentTeam = 'team1') {
      //   enemyTeam = 'team2';
      // }
      // else {
      //   enemyTeam = 'team2';
      // }

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
      }
      else {
        var dBuilding = defendableBuildings[0];
        const attackerId = dBuilding.attacker.user_id;
        var buildingIndex = buildingList.indexOf(dBuilding);
        dBuilding.underAttack = false;
        dBuilding.attackEnds = "";
        dBuilding.attacker = {};
        // var enemyPlayer = _.filter(enemyTeam, function(x){
        //   return x['user_id'] == attackerId;
        // })[0];
        let enemyTeam;
        if (currentTeam == "team1"){
          enemyTeam = props.game.team2;
        } else {
          enemyTeam = props.game.team1;
        }

        var enemyPlayer = _.filter(enemyTeam, function(x){
          return x['user_id'] == attackerId;
        })[0];

        let playerIndex = enemyTeam.indexOf(enemyPlayer);
        enemyPlayer.ko = true;
        buildingList[buildingIndex] = dBuilding;
        enemyTeam[playerIndex] = enemyPlayer;

        let data = {};
        data['buildings'] = buildingList;

        if(currentTeam == "team1"){
          data['team2'] = enemyTeam;
        } else {
          data['team1'] = enemyTeam;
        }
        updateGameState(data);
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
        var currTime = new Date();
        currTime.setMinutes(currTime.getMinutes()+1);

        buildingIndex = buildingList.indexOf(locationFin)
        locationFin.underAttack = true;
        locationFin.attackEnds = currTime;
        locationFin.attacker = {user_id: props.user.user_id, team: currentTeam};
        buildingList[buildingIndex] = locationFin;

        let data = {};
        data["buildings"] = buildingList;
        updateGameState(data);

        activateAttackTimer(currTime, locationFin.lat, locationFin.lng, locationFin, buildingIndex);

        channel.push("attack", {building: locationFin, game: props.game, attackingTeam: currentTeam})


        console.log(buildingIndex)
        console.log(locationFin)
        attacking = true;

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
            let data = {};

            if (currentTeam == "team1"){
              var currentlyAttacking = props.game.team1Attacks;
              var index = currentlyAttacking.indexOf(building);
              if (index > -1){
                currentlyAttacking.splice(index, 1);
              }
              data["team1Attacks"] = currentlyAttacking;

            } else {
                var currentlyAttacking = props.game.team2Attacks;
                var index = currentlyAttacking.indexOf(building);
                if (index > -1){
                  currentlyAttacking.splice(index, 1);
                }
                data["team2Attacks"] = currentlyAttacking;
            }


            //building captured
            var buildingList = props.game.buildings;
            building.underAttack = false;
            building.attacker={};
            building.attackEnds = "";
            building.captured = true;
            building.owner = currentTeam;
            buildingList[buildingIndex] = building;
            let currentlyCaptured;
            data["buildings"] = buildingList;

            $.when(updateGameState(data)).then(channel.push("broadcast_my_state", props.game));

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
          building.underAttack = false;
          building.attacker = {};
          building.attackEnds = "";

          var buildingList = props.game.buildings;
          buildingList[buildingIndex] = building;



          let data = {};
          data["buildings"] = buildingList;
          $.when(updateGameState(data)).then(channel.push("broadcast_my_state", props.game));

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
  }

  function sendMessage()
  {
    console.log("sending sendMessage")
    channel.push("sendMsg", {message: "From " + props.user.user_id + ": " + $('#chatText').val()})
  }


  function displayMessage(resp)
  {
    console.log("displaying message")
   var text = resp.msg + "\n" + $('#chatOutput').html()
   $("#chatOutput").html(text.replace(/\n/g, "<br />"));
   $("#chatText").val("");
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
        return <div><p>TEAM 2 is attacking building {x.name}. You have {timeLeft} seconds to defend the building!</p></div>;
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

    channel.on("attack_incoming", game => {
      channel.push("update_state", game)
        .receive("ok", gotView.bind(this))
    });

    channel.on("displayMsg", resp => {
      console.log("message being sent?")
      displayMessage(resp)
    })


    channel.on("state_update", game => {
        if(game.winner != "")
        {
          alert(game.winner + " Wins!");
        }
        channel.push("update_state", game)
          .receive("ok", gotView.bind(this))
      });

      console.log(props)



    return <div>
      <div className="googleMaps">
        <CamMap buildings={props.game.buildings}/>
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

     <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
       <div class="modal-dialog" role="document">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="exampleModalLongTitle">Chat Box</h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
           <div class="modal-body" id="chatOutput">
           </div>
           <div class="modal-footer" id="chatInput">
              <input type="text" className="form-control" id="chatText" placeholder="Your message"></input>
             <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
             <button type="button" class="btn btn-primary" onClick={() => sendMessage()}>Send</button>
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
