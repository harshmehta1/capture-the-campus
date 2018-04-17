import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";


let options = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
};

let posn;

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
console.log(navigator.geolocation)

if (navigator.geolocation) {
       navigator.geolocation.watchPosition(success);
} else {
  alert("Geolocation is not supported by your browser!");
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
    defaultCenter={posn}>
    {props.isMarkerShown && (
      // West Village H
      <Marker position={{ lat: 42.33857, lng: -71.092355 }} title="West Village H"/>
    )}
    {props.isMarkerShown && (
      // Dodge Hall
      <Marker position={{ lat: 42.340324, lng: -71.08785 }} title="Dodge Hall"/>
    )}
    {props.isMarkerShown && (
      // Marino Center
      <Marker position={{ lat: 42.340272, lng: -71.090269 }} title="Marino Center"/>
    )}
    {props.isMarkerShown && (
      // ISEC
      <Marker position={{ lat: 42.337733, lng: -71.086912 }} title="ISEC" />
    )}
    {props.isMarkerShown && (
      // Ryder Hall
      <Marker position={{ lat: 42.336605, lng: -71.090850 }} title="Ryder Hall" />
    )}
    {props.isMarkerShown && (
      // MFA
      <Marker position={{ lat: 42.339381, lng: -71.094048 }} title="MFA" />
    )}
    {props.isMarkerShown && (
      // Matthew's Arena
      <Marker position={{ lat: 42.341235, lng: -71.084523 }} title="Matthews Arena" />
    )}
    {props.isMarkerShown && (
      // International Village
      <Marker position={{ lat: 42.335102, lng: -71.089176 }} title="International Village" />
    )}
    {props.isMarkerShown && (
      // Shillman Hall
      <Marker position={{ lat: 42.337553, lng: -71.090191 }} title="Shillman Hall" />
    )}
    {props.isMarkerShown && (
      // East Village
      <Marker position={{ lat: 42.340437, lng: -71.086879 }} title="East Village" />
    )}
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
        position={posn}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: "blue",
          scale: 10
        }}
      />
    )}
  </GoogleMap>
));

export default CampusMap;
