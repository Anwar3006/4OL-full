/**
 * Example components demonstrating tRPC usage in React Native
 * Copy these patterns to your actual screens
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { trpc } from '../lib/trpc';

/**
 * Example 1: Fetch and display facility images
 * Uses the mediaStorage.getImageUrl procedure
 */
export function FacilityImagesExample({ imagePaths }: { imagePaths: string[] }) {
  const { data, isLoading, error } = trpc.mediaStorage.getImageUrl.useQuery({
    paths: imagePaths,
    isFacility: true,
    width: 800,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data?.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.url }}
          style={styles.image}
          resizeMode="cover"
        />
      ))}
    </View>
  );
}

/**
 * Example 2: List facilities with pull-to-refresh
 * Shows pagination and refetching patterns
 */
export function FacilitiesListExample() {
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = trpc.facilityProfiles.getFacilities.useQuery({
    type: 'hospitals_&_clinics',
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={data?.facilities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.facilityCard}>
          <Text style={styles.facilityName}>{item.facilityName}</Text>
          <Text style={styles.facilityLocation}>
            {item.area}, {item.region}
          </Text>
          <Text style={styles.facilityType}>{item.facilityType}</Text>
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      contentContainerStyle={styles.listContainer}
    />
  );
}

/**
 * Example 3: Facility detail with images
 * Shows how to combine multiple queries
 */
export function FacilityDetailExample({ facilityId }: { facilityId: string }) {
  // Fetch facility data
  const { data: facility, isLoading } = trpc.facilityProfiles.getById.useQuery({
    id: facilityId,
  });

  // Fetch facility images (conditional on facility data being available)
  const { data: images } = trpc.mediaStorage.getImageUrl.useQuery(
    {
      paths: facility?.mediaUrls as string[],
      isFacility: true,
      width: 800,
    },
    {
      enabled: !!facility?.mediaUrls,
    }
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!facility) {
    return (
      <View style={styles.centerContainer}>
        <Text>Facility not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Images */}
      {images && images.length > 0 && (
        <FlatList
          horizontal
          data={images}
          keyExtractor={(item) => item.path}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.url }}
              style={styles.detailImage}
              resizeMode="cover"
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}

      {/* Facility Info */}
      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>{facility.facilityName}</Text>
        <Text style={styles.detailText}>{facility.facilityType}</Text>
        <Text style={styles.detailText}>
          {facility.contactNumber}
        </Text>
        <Text style={styles.detailText}>
          {facility.area}, {facility.district}, {facility.region}
        </Text>
      </View>

      {/* Amenities */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.tagsContainer}>
          {(facility.amenities as string[])?.map((amenity, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Services */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.tagsContainer}>
          {(facility.services as string[])?.map((service, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/**
 * Example 4: Create facility mutation
 * Shows how to handle form submissions
 */
export function CreateFacilityExample() {
  const utils = trpc.useContext();
  
  const createMutation = trpc.facilityProfiles.insertFacility.useMutation({
    onSuccess: (data) => {
      console.log('Facility created:', data);
      // Invalidate and refetch facilities list
      utils.facilityProfiles.getFacilities.invalidate();
    },
    onError: (error) => {
      console.error('Error creating facility:', error.message);
    },
  });

  const handleSubmit = () => {
    createMutation.mutate({
      facilityType: 'hospitals_&_clinics',
      facilityName: 'Test Hospital',
      contactNumber: '+233123456789',
      email: 'test@hospital.com',
      gpsAddress: 'GA-123-4567',
      area: 'Accra',
      district: 'Accra Metro',
      region: 'greater accra',
      country: 'Ghana',
      firstName: 'John',
      lastName: 'Doe',
      ownerEmail: 'owner@hospital.com',
      amenities: ['emergency', 'pharmacy'],
      services: ['general medicine', 'surgery'],
      businessHours: [],
      mediaUrls: [],
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={createMutation.isLoading}
        style={[
          styles.button,
          createMutation.isLoading && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {createMutation.isLoading ? 'Creating...' : 'Create Facility'}
        </Text>
      </TouchableOpacity>

      {createMutation.error && (
        <Text style={styles.errorText}>{createMutation.error.message}</Text>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  facilityCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facilityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  facilityLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  facilityType: {
    fontSize: 12,
    color: '#999',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  detailImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
  },
  detailSection: {
    marginTop: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#00796b',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#00796b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
