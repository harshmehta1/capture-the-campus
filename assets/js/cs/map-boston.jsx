// Map with buildings in Downtown Boston

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

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`Accuracy is within ${crd.accuracy} meters.`);
  posn = {lat: crd.latitude, lng: crd.longitude};
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.watchPosition(success, error, options);


const BostonMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCaUikEycWixH_xYYkAenITaq-r7uM09Ug&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={16}
    defaultCenter={posn}>
    {props.isMarkerShown && (
      // TD Garden
      <Marker position={{ lat: 42.366198, lng: -71.062146 }} title="TD Garden"/>
    )}
    {props.isMarkerShown && (
      // Paul Revere House
      <Marker position={{ lat: 42.363738, lng: -71.053700 }} title="Paul Revere House"/>
    )}
    {props.isMarkerShown && (
      // Paul Revere Statue
      <Marker position={{ lat: 42.365570, lng: -71.053271 }} title="Paul Revere Statue"/>
    )}
    {props.isMarkerShown && (
      // New England Aquarium
      <Marker position={{ lat: 42.359131, lng: -71.049581 }} title="New England Aquarium" />
    )}
    {props.isMarkerShown && (
      // Boston Children's Museum
      <Marker position={{ lat: 42.351868, lng: -71.049993 }} title="Boston Children's Museum" />
    )}
    {props.isMarkerShown && (
      // Rose Kennedy Greenway
      <Marker position={{ lat: 42.356991, lng: -71.051276 }} title="Rose Kennedy Greenway" />
    )}
    {props.isMarkerShown && (
      // Union Oyster House
      <Marker position={{ lat: 42.361288, lng: -71.056908 }} title="Union Oyster House" />
    )}
    {props.isMarkerShown && (
      // Omni Parker House
      <Marker position={{ lat: 42.357750, lng: -71.060031 }} title="Omni Parker House" />
    )}
    {props.isMarkerShown && (
      // Christopher Columbus Park
      <Marker position={{ lat: 42.360992, lng: -71.051634 }} title="Christopher Columbus Park" />
    )}
    {props.isMarkerShown && (
      // Granary Burying Ground
      <Marker position={{ lat: 42.357476, lng: -71.061721 }} title="Granary Burying Ground" />
    )}
    {props.isMarkerShown && (
      // Faneuil Hall (respawn area)
      <Marker
        position={{ lat: 42.360228, lng: -71.054772 }}
        title="Faneuil Hall"
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: "blue",
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
          strokeColor: "green",
          scale: 10
        }}
      />
    )}
  </GoogleMap>
));

export default BostonMap;
