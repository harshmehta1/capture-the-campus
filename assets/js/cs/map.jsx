import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const Map = compose(
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
    defaultCenter={{ lat: 42.3394299, lng: -71.0906958 }}>
    {props.isMarkerShown && (
      // West Village H
      <Marker
        position={{ lat: 42.33857, lng: -71.092355 }}
        title="West Village H"
      />
    )}
    {props.isMarkerShown && (
      // Dodge Hall
      <Marker
        position={{ lat: 42.340324, lng: -71.08785 }}
        title="Dodge Hall"
      />
    )}
    {props.isMarkerShown && (
      // Marino Center
      <Marker
        position={{ lat: 42.340272, lng: -71.090269 }}
        title="Marino Center"
      />
    )}
    {props.isMarkerShown && (
      // ISEC
      <Marker position={{ lat: 42.337733, lng: -71.086912 }} title="ISEC" />
    )}
    {props.isMarkerShown && (
      // Snell (respawn area)
      // Add custom marker here
      <Marker
        position={{ lat: 42.338396, lng: -71.088071 }}
        title="Snell Library"
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: "blue",
          scale: 10
        }}
      />
    )}
  </GoogleMap>
));

export default Map;
