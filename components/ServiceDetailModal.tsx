import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { LaundryService } from '../data/mockServices';
import { BlurView } from 'expo-blur';

interface ServiceDetailModalProps {
  visible: boolean;
  service: LaundryService | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  visible,
  service,
  onClose,
}) => {
  const { colors, theme } = useTheme();

  if (!service) return null;

  const handleCall = () => {
    Linking.openURL(`tel:${service.contact.phone}`);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in your laundry services at ${service.name}`;
    Linking.openURL(`whatsapp://send?phone=${service.contact.whatsapp}&text=${encodeURIComponent(message)}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${service.contact.email}?subject=Inquiry about laundry services`);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint={theme === 'dark' ? 'dark' : 'light'} />
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.headerDragHandle, { backgroundColor: colors.border }]} />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.card }]}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            {/* Service Header */}
            <View style={styles.serviceHeader}>
              <View style={[styles.serviceIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name="water" size={40} color={colors.primary} />
              </View>
              <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color={colors.warning} />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {service.rating}
                </Text>
                <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                  ({service.reviewCount} reviews)
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: service.isOpen ? `${colors.success}20` : `${colors.error}20` }]}>
                <View style={[styles.statusDot, { backgroundColor: service.isOpen ? colors.success : colors.error }]} />
                <Text style={[styles.statusText, { color: service.isOpen ? colors.success : colors.error }]}>
                  {service.isOpen ? 'Open Now' : 'Closed'}
                </Text>
              </View>
            </View>

            {/* Info Cards */}
            <View style={styles.infoCards}>
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="location" size={24} color={colors.primary} />
                <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Distance</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{service.distance} km</Text>
              </View>
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="time" size={24} color={colors.secondary} />
                <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Delivery</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{service.deliveryTime}</Text>
              </View>
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="cash" size={24} color={colors.success} />
                <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Price</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{service.priceRange}</Text>
              </View>
            </View>

            {/* Services Offered */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Services Offered</Text>
              <View style={styles.servicesList}>
                {service.services.map((svc, index) => (
                  <View key={index} style={[styles.serviceItem, { backgroundColor: colors.background }]}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={[styles.serviceItemText, { color: colors.text }]}>{svc}</Text>
                    <View style={styles.serviceItemSpacer} />
                    <Text style={[styles.servicePrice, { color: colors.primary }]}>
                      {service.servicePrices[svc] ?? service.priceRange}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Location */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
              </View>
              <Text style={[styles.address, { color: colors.textSecondary }]}>{service.location.address}</Text>
            </View>

            {/* Opening Hours */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time" size={20} color={colors.secondary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Opening Hours</Text>
              </View>
              <Text style={[styles.openingHours, { color: colors.textSecondary }]}>{service.openingHours}</Text>
            </View>

            {/* Pricing */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pricetag" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Pricing</Text>
              </View>
              <Text style={[styles.priceRangeText, { color: colors.text }]}>
                {service.priceRange} per order
              </Text>
              <Text style={[styles.priceNote, { color: colors.textSecondary }]}>
                Final pricing depends on item count and fabric type.
              </Text>
            </View>

            {/* Contact Section */}
            <View style={styles.contactSection}>
              <Text style={[styles.contactTitle, { color: colors.text }]}>Contact Service</Text>
              
              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: colors.primary }]}
                onPress={handleCall}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={24} color="#FFFFFF" />
                <View style={styles.contactButtonText}>
                  <Text style={styles.contactButtonLabel}>Call Now</Text>
                  <Text style={styles.contactButtonValue}>{service.contact.phone}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: '#25D366' }]}
                onPress={handleWhatsApp}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
                <View style={styles.contactButtonText}>
                  <Text style={styles.contactButtonLabel}>WhatsApp</Text>
                  <Text style={styles.contactButtonValue}>Send Message</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: colors.secondary }]}
                onPress={handleEmail}
                activeOpacity={0.8}
              >
                <Ionicons name="mail" size={24} color="#FFFFFF" />
                <View style={styles.contactButtonText}>
                  <Text style={styles.contactButtonLabel}>Email</Text>
                  <Text style={styles.contactButtonValue}>{service.contact.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  serviceHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  serviceIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  serviceItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  serviceItemSpacer: {
    flex: 1,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
  openingHours: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  priceNote: {
    fontSize: 12,
  },
  contactSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  contactButtonText: {
    flex: 1,
  },
  contactButtonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  contactButtonValue: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
});
