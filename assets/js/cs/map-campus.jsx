import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import {geolocated} from 'react-geolocated';


let options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

// let posn;

function success(pos) {
  var crd = pos.coords;

  // console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  // console.log(`Accuracy is within ${crd.accuracy} meters.`);
  posn = {lat: crd.latitude, lng: crd.longitude};
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);

}

console.log("MAP")

// if (navigator.geolocation) {
//        navigator.geolocation.watchPosition(success, error, options);
// } else {
//   alert("Geolocation is not supported by your browser!");
// }

let tracking = false;
let showMarker = false;

function CamMap(props){


  if(props.coords){
  console.log("CAMMAP")
  // console.log(props)
  let allBuildings = props.buildings;
  var lati = parseFloat(props.coords.latitude)
  var lngi = parseFloat(props.coords.longitude)
  let posn = {lat: lati, lng: lngi};
  showMarker = true;
    // if(props.isGeolocationAvailable && props.isGeolocationEnabled){
    //   if(props.coords){
    //     posn = {lat: props.coords.latitude, lng: props.coords.longitude};
    //     console.log(posn)
    //     showMarker = true;
    //   } else {
    //     posn = { lat: 42.338396, lng: -71.088071 };
    //   }
    // }
    // navigator.geolocation.watchPosition(success, error, options);
    let markerList;
    if(props.status == "start"){
    markerList = _.map(allBuildings, function (x, ii) {
    // console.log(x);
    if(x.underAttack && (x.attacker.team == "team1") && (x.captured == false)){
      return <Marker position={{lat: x.lat, lng: x.lng }} title={x.name} key={ii} animation={google.maps.Animation.BOUNCE} icon={"/images/greenflag.png"}/>
    }
    if(x.underAttack && (x.attacker.team == "team2") && (x.captured == false)){
      return <Marker position={{lat: x.lat, lng: x.lng }} title={x.name} key={ii} animation={google.maps.Animation.BOUNCE} icon={"/images/redflag.png"}/>
    }
    if(x.captured && (x.owner == "team1")){
      return <Marker position={{lat: x.lat, lng: x.lng }} title={x.name} key={ii} icon={"/images/greenflag.png"}/>
    }
    if(x.captured && (x.owner == "team2")){
      return <Marker position={{lat: x.lat, lng: x.lng }} title={x.name} key={ii} icon={"/images/redflag.png"}/>
    }
    else {
      return <Marker position={{lat: x.lat, lng: x.lng }} title={x.name} key={ii} />
    }
    });
  }

  // console.log(markerList)


  return  <CampusMap isMarkerShown={showMarker} markerList={markerList} posn={posn} />;

  } else {
    return <div id="loading"><img src="https://i.redd.it/ounq1mw5kdxy.gif" height="30%"/><br/>Locating you...</div>
  }


}

const CampusMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCaUikEycWixH_xYYkAenITaq-r7uM09Ug&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={18}
    defaultCenter={props.posn}>
      {props.markerList}

    {props.isMarkerShown && (
      // Snell (respawn area)
      <Marker
        position={{ lat: 42.338396, lng: -71.088071 }}
        title="Snell Library"
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: "green",
          scale: 10
        }}
      />
    )}
    {props.isMarkerShown && (
      // Player location
      <Marker
        position={props.posn}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#1589FF',
          fillOpacity: 1,
          scale: 8,
          strokeColor: '#1589FF',
          strokeWeight: 10

        }}
      />
    )}
  </GoogleMap>
));


export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity,
  },
  watchPosition: true,
  userDecisionTimeout: null,
})(CamMap);
