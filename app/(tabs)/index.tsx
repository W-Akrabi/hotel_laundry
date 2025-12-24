import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { MockMapView } from '../../components/MockMapView';
import { ServiceDetailModal } from '../../components/ServiceDetailModal';
import { mockLaundryServices, LaundryService } from '../../data/mockServices';

export default function MapScreen() {
  const colors = useThemeStore(state => state.colors);
  const [selectedService, setSelectedService] = useState<LaundryService>(mockLaundryServices[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleServicePress = (service: LaundryService) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

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
});
