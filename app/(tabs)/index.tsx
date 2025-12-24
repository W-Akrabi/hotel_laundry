import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { useServicesStore } from '../../store/servicesStore';
import { MockMapView } from '../../components/MockMapView';
import { ServiceDetailModal } from '../../components/ServiceDetailModal';
import { LaundryService } from '../../data/mockServices';

export default function MapScreen() {
  const colors = useThemeStore(state => state.colors);
  const services = useServicesStore(state => state.services);
  const isLoading = useServicesStore(state => state.isLoading);
  const error = useServicesStore(state => state.error);
  const fetchServices = useServicesStore(state => state.fetchServices);

  const [selectedService, setSelectedService] = useState<LaundryService | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch services when component mounts
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Set selected service when services are loaded
  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

  const handleServicePress = (service: LaundryService) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Show loading indicator while fetching data
  if (isLoading || !selectedService) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MockMapView
        latitude={selectedService.location.latitude}
        longitude={selectedService.location.longitude}
        title={selectedService.name}
        address={selectedService.location.address}
        distanceKm={selectedService.distance}
        deliveryTime={selectedService.deliveryTime}
        onMarkerPress={() => handleServicePress(selectedService)}
      />
      <ServiceDetailModal
        visible={modalVisible}
        service={selectedService}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
