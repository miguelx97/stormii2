import React from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface MapComponentProps {
  radius: number;
  location?: {
    lat: number;
    lng: number;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ radius, location }) => {
  // Default to a sample location if none provided (similar to Angular component)
  const defaultLocation = { lat: 40.7128, lng: -74.006 }; // New York City
  const currentLocation = location || defaultLocation;

  // Calculate appropriate zoom level based on radius
  const getRegionForRadius = () => {
    const radiusInKm = radius / 1000;
    let latitudeDelta = radiusInKm / 111; // Rough conversion: 1 degree ≈ 111 km
    let longitudeDelta = radiusInKm / 111;

    // Add some padding around the circle
    latitudeDelta *= 2.5;
    longitudeDelta *= 2.5;

    // Minimum zoom level
    if (latitudeDelta < 0.005) latitudeDelta = 0.005;
    if (longitudeDelta < 0.005) longitudeDelta = 0.005;

    return {
      latitude: currentLocation.lat,
      longitude: currentLocation.lng,
      latitudeDelta,
      longitudeDelta,
    };
  };

  return (
    <View className="h-full overflow-hidden rounded-lg border border-transparent">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ height: '100%', width: '100%' }}
        region={getRegionForRadius()}
        mapType="hybrid"
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        onMapReady={() => {
          console.log('Map is ready');
        }}>
        {/* Radius Circle */}
        <Circle
          center={{
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          }}
          radius={radius}
          fillColor="rgba(59, 130, 246, 0.2)" // Blue with transparency
          strokeColor="rgba(59, 130, 246, 0.8)" // Blue border
          strokeWidth={2}
        />

        {/* Center Point Marker */}
        <Marker
          coordinate={{
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          }}
          title="Ubicación del rayo"
          description={`Radio aproximado: ${Math.round(radius)}m`}>
          <View className="h-4 w-4 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-500">
            <View className="h-2 w-2 rounded-full bg-white" />
          </View>
        </Marker>
      </MapView>
    </View>
  );
};

export default MapComponent;
