import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '300px'
};

const center = {
  lat: -12.006701291982605,
  lng: -77.06311102958738
};

const GoogleMapEmbed = ({ apiKey }) => {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapEmbed;
