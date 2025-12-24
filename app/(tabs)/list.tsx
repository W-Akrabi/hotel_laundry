import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { useServicesStore } from '../../store/servicesStore';
import { useFiltersStore } from '../../store/filtersStore';
import { ServiceDetailModal } from '../../components/ServiceDetailModal';
import { LaundryService } from '../../data/mockServices';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'star' },
  { id: 'wash', label: 'Wash & Fold', icon: 'shirt-outline' },
  { id: 'dry', label: 'Dry Clean', icon: 'water-outline' },
  { id: 'iron', label: 'Ironing', icon: 'flame-outline' },
  { id: 'express', label: 'Express', icon: 'flash-outline' },
  { id: 'pickup', label: 'Pickup', icon: 'car-outline' },
  { id: 'eco', label: 'Eco', icon: 'leaf-outline' },
];

export default function ListScreen() {
  // Theme state
  const colors = useThemeStore(state => state.colors);

  // Services state
  const services = useServicesStore(state => state.services);
  const isLoading = useServicesStore(state => state.isLoading);
  const error = useServicesStore(state => state.error);

  // Filters state
  const selectedCategories = useFiltersStore(state => state.selectedCategories);
  const searchQuery = useFiltersStore(state => state.searchQuery);
  const toggleCategory = useFiltersStore(state => state.toggleCategory);
  const setSearchQuery = useFiltersStore(state => state.setSearchQuery);
  const addRecentSearch = useFiltersStore(state => state.addRecentSearch);

  // Local modal state (keeping this local as it's UI-specific)
  const [selectedService, setSelectedService] = useState<LaundryService | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleServicePress = (service: LaundryService) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Save search query when user submits search
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
    }
  };

  // Filter services based on categories and search query
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const activeCategories = selectedCategories.includes('all') ? [] : selectedCategories;
  const filteredServices = services.filter((service) => {
    const searchable = [
      service.name,
      service.location.address,
      service.services.join(' '),
    ]
      .join(' ')
      .toLowerCase();

    const matchesQuery = normalizedQuery.length === 0 || searchable.includes(normalizedQuery);

    if (!matchesQuery) {
      return false;
    }

    if (activeCategories.length === 0) {
      return true;
    }

    const serviceText = service.services.join(' ').toLowerCase();
    const categoryMatchers: Record<string, (text: string) => boolean> = {
      wash: (text) => text.includes('wash'),
      dry: (text) => text.includes('dry'),
      iron: (text) => text.includes('iron'),
      express: (text) => text.includes('express') || text.includes('same day'),
      pickup: (text) => text.includes('pickup') || text.includes('delivery'),
      eco: (text) => text.includes('eco'),
    };

    return activeCategories.some((category) => categoryMatchers[category]?.(serviceText));
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Location Bar */}
      <View style={styles.locationBar}>
        <View style={styles.locationLeft}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <View>
          <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Your Location</Text>
          <View style={styles.locationNameRow}>
            <Text style={[styles.locationName, { color: colors.text }]}>Dubai Marina</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </View>
        </View>
      </View>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card }]}>
          <Ionicons name="notifications" size={20} color={colors.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* App Branding */}
      <View style={styles.brandingContainer}>
        <Text style={styles.brandingText}>
          <Text style={[styles.brandingWhite, { color: colors.text }]}>Wash&Dry</Text>
          <Text style={[styles.brandingCyan, { color: colors.primary }]}>Express</Text>
        </Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Find the best laundry services near you
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search laundry services..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
      </View>

      {/* Service Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: colors.card },
              selectedCategories.includes(category.id) && [
                styles.categoryButtonActive,
                { backgroundColor: colors.background, borderColor: colors.primary },
              ],
            ]}
            onPress={() => toggleCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={20}
              color={selectedCategories.includes(category.id) ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.categoryText,
                { color: colors.text },
                selectedCategories.includes(category.id) && [
                  styles.categoryTextActive,
                  { color: colors.primary },
                ],
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Nearby Services Header */}
      <View style={styles.servicesHeader}>
        <Text style={[styles.servicesTitle, { color: colors.text }]}>Nearby Services</Text>
        <Text style={[styles.servicesCount, { color: colors.primary }]}>
          {filteredServices.length} found
        </Text>
      </View>
    </View>
  );

  const renderServiceCard = ({ item }: { item: LaundryService }) => (
    <TouchableOpacity
      style={[styles.serviceCard, { backgroundColor: colors.card }]}
      onPress={() => handleServicePress(item)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800' }}
        style={styles.serviceImage}
        imageStyle={styles.serviceImageStyle}
      >
        {item.reviewCount > 400 && (
          <View style={[styles.premiumBadge, { backgroundColor: colors.warning }]}>
            <Ionicons name="star" size={14} color={colors.card} />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.isOpen ? colors.success : colors.error },
          ]}
        >
          <Text style={styles.statusText}>{item.isOpen ? 'Open' : 'Closed'}</Text>
        </View>
      </ImageBackground>

      <View style={styles.serviceInfo}>
        <Text style={[styles.serviceName, { color: colors.text }]}>{item.name}</Text>

        <View style={styles.serviceRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.serviceText, { color: colors.textSecondary }]}>
            {item.location.address}
          </Text>
        </View>

        <View style={styles.serviceRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.serviceText, { color: colors.textSecondary }]}>
            {item.openingHours}
          </Text>
        </View>

        <View style={styles.serviceTags}>
          {item.services.slice(0, 3).map((service, index) => (
            <View key={index} style={[styles.serviceTag, { backgroundColor: colors.background }]}>
              <Text style={[styles.serviceTagText, { color: colors.primary }]}>{service}</Text>
            </View>
          ))}
        </View>

        <View style={styles.serviceFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating}</Text>
            <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
              ({item.reviewCount})
            </Text>
          </View>
          <Text style={[styles.distanceText, { color: colors.primary }]}>
            {item.distance} km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading services...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => useServicesStore.getState().fetchServices()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={renderServiceCard}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No services found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Try adjusting your filters or search query
              </Text>
            </View>
          }
        />
      )}
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
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  headerContainer: {
    paddingTop: 8,
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationLabel: {
    fontSize: 12,
  },
  locationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
  },
  brandingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  brandingText: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  brandingWhite: {
  },
  brandingCyan: {
  },
  tagline: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    marginRight: 8,
  },
  categoryButtonActive: {
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    fontWeight: '600',
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  servicesCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  serviceCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 180,
    justifyContent: 'space-between',
    padding: 12,
  },
  serviceImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  serviceText: {
    fontSize: 13,
  },
  serviceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  serviceTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  serviceTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
  },
  reviewText: {
    fontSize: 13,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
