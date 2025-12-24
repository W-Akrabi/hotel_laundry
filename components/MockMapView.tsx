import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Linking, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ExternalLink, MapPin, Navigation } from 'lucide-react-native';
import { useThemeStore } from '../store/themeStore';
import { Ionicons } from '@expo/vector-icons';

interface MockMapViewProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  distanceKm?: number;
  deliveryTime?: string;
  onDirectionsPress?: () => void;
  onMarkerPress?: () => void;
}

export const MockMapView: React.FC<MockMapViewProps> = ({
  latitude,
  longitude,
  title,
  address,
  distanceKm,
  deliveryTime,
  onDirectionsPress,
  onMarkerPress,
}) => {
  const colors = useThemeStore(state => state.colors);
  const theme = useThemeStore(state => state.theme);
  const mapStyle = theme === 'dark' ? darkMapStyle : lightMapStyle;

  const openInMaps = async () => {
    const url =
      Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
        web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      }) ??
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open maps application');
      console.log('Error opening maps:', error);
    }
  };

  const getDirections = async () => {
    const url =
      Platform.select({
        ios: `maps:?daddr=${latitude},${longitude}`,
        android: `google.navigation:q=${latitude},${longitude}`,
        web: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      }) ??
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open directions');
      console.log('Error opening directions:', error);
    }

    onDirectionsPress?.();
  };

  const mapRegion = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const locationMeta =
    distanceKm && deliveryTime
      ? `${distanceKm} km away • ${deliveryTime} delivery`
      : distanceKm
        ? `${distanceKm} km away`
        : deliveryTime
          ? `${deliveryTime} delivery`
          : null;

  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, { backgroundColor: colors.border }]}>
        <MapView
          style={styles.map}
          initialRegion={mapRegion}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          showsUserLocation
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={title}
            description={address}
            onPress={onMarkerPress}
          >
            <View style={styles.pinWrapper}>
              <View
                style={[
                  styles.pinCore,
                  {
                    backgroundColor: colors.primary,
                    borderColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                  },
                ]}
              >
                <Ionicons name="water" size={16} color="#FFFFFF" />
              </View>
              <View
                style={[
                  styles.pinTail,
                  { backgroundColor: colors.primary },
                ]}
              />
            </View>
          </Marker>
        </MapView>

        <View style={styles.mapOverlay}>
          <Pressable
            style={[styles.mapButton, { backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(15, 23, 42, 0.7)' }]}
            onPress={openInMaps}
          >
            <ExternalLink color="#FFFFFF" size={16} />
            <Text style={styles.mapButtonText}>View in Maps</Text>
          </Pressable>

          <Pressable
            style={[styles.mapButton, { backgroundColor: colors.primary }]}
            onPress={getDirections}
          >
            <Navigation color="#FFFFFF" size={16} />
            <Text style={styles.mapButtonText}>Directions</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.infoOverlay}>
        <View style={[styles.locationInfo, { backgroundColor: colors.card }]}>
          <View style={styles.locationHeader}>
            <MapPin color={colors.textSecondary} size={16} />
            <Text style={[styles.locationTitle, { color: colors.text }]}>Location</Text>
          </View>
          <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>{address}</Text>
          {locationMeta ? (
            <Text style={[styles.locationDistance, { color: colors.primary }]}>{locationMeta}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pinWrapper: {
    alignItems: 'center',
  },
  pinCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  pinTail: {
    width: 10,
    height: 10,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  mapButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  locationInfo: {
    padding: 16,
    borderRadius: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationAddress: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationDistance: {
    fontSize: 12,
    fontWeight: '600',
  },
});

const lightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#F8FAFC' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#0F172A' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#F8FAFC' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#E2E8F0' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#F1F5F9' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#E2E8F0' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#E2E8F0' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#E2E8F0' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#CFFAFE' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#0F172A' }] },
];

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0F172A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#E2E8F0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F172A' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1E293B' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0B1220' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0F172A' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B3A4A' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#E2E8F0' }] },
];
