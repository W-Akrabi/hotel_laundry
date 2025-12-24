import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { LaundryService } from '../data/mockServices';

interface ServiceCardProps {
  service: LaundryService;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const colors = useThemeStore(state => state.colors);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <Ionicons name="water" size={24} color={colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {service.name}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text style={[styles.rating, { color: colors.text }]}>
                {service.rating}
              </Text>
              <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                ({service.reviewCount})
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: service.isOpen ? `${colors.success}20` : `${colors.error}20` }]}>
          <Text style={[styles.statusText, { color: service.isOpen ? colors.success : colors.error }]}>
            {service.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {service.distance} km away
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {service.deliveryTime}
          </Text>
        </View>
      </View>

      <View style={styles.servicesRow}>
        {service.services.slice(0, 3).map((svc, index) => (
          <View key={index} style={[styles.serviceTag, { backgroundColor: colors.background }]}>
            <Text style={[styles.serviceTagText, { color: colors.primary }]}>{svc}</Text>
          </View>
        ))}
        {service.services.length > 3 && (
          <Text style={[styles.moreServices, { color: colors.textSecondary }]}>+{service.services.length - 3}</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.priceRange, { color: colors.primary }]}>{service.priceRange}</Text>
        <View style={styles.contactIcons}>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            <Ionicons name="call" size={16} color={colors.primary} />
          </View>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            <Ionicons name="logo-whatsapp" size={16} color={colors.success} />
          </View>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            <Ionicons name="mail" size={16} color={colors.secondary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  serviceTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  serviceTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreServices: {
    fontSize: 11,
    fontWeight: '600',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  priceRange: {
    fontSize: 18,
    fontWeight: '700',
  },
  contactIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
