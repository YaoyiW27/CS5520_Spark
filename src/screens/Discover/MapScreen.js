import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { updateUserLocation, getNearbyUsers } from "../../Firebase/firebaseHelper";
import { db } from "../../Firebase/firebaseSetup";
import { collection, onSnapshot } from 'firebase/firestore';
import { mapScreenStyles as styles } from '../../styles/DiscoverStyles';

const UserMarkerWithDistance = ({ user, onPress }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.mapUserMarker}>
        <Image 
          source={{ uri: imageError ? 'https://via.placeholder.com/150' : user.profileImage }}
          style={styles.mapMarkerImage}
          onError={(e) => {
            console.log(`Error loading image for user ${user.id}:`, e.nativeEvent.error);
            setImageError(true);
          }}
        />
        <View style={styles.mapDistanceContainer}>
          <Text style={styles.mapDistanceText}>{user.distance}km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MapScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [filters, setFilters] = useState(route.params?.filters || {
    gender: "all",
    distanceRange: [0, 75],
    ageRange: [18, 80],
  });

  // Update filters when route params change
  useEffect(() => {
    if (route.params?.filters) {
      setFilters(route.params.filters);
    }
  }, [route.params?.filters]);

  // Reload users when filters or location changes
  useEffect(() => {
    if (location) {
      loadNearbyUsers({
        latitude: location.latitude,
        longitude: location.longitude
      });
    }
  }, [filters, location]);

  // Subscribe to user updates
  useEffect(() => {
    const loadAndSubscribe = async () => {
      if (location) {
        try {
          const unsubscribe = onSnapshot(collection(db, 'Users'), async () => {
            await loadNearbyUsers({
              latitude: location.latitude,
              longitude: location.longitude
            });
          });
          
          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.error("Error setting up user subscription:", error);
        }
      }
    };
  
    loadAndSubscribe();
  }, [location]);

  const handleFilterPress = () => {
    navigation.navigate("FilterScreen", { filters });
  };

  const loadNearbyUsers = async (userLocation) => {
    try {
      const users = await getNearbyUsers(userLocation, filters);
      setNearbyUsers(users.filter(u => u.id !== user.email));
    } catch (error) {
      console.error("Error loading nearby users:", error);
      Alert.alert("Error", "Failed to load nearby users");
    }
  };

  const verifyAndGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location services to see nearby users."
        );
        setLocationPermission(false);
        return;
      }

      setLocationPermission(true);
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setLocation(newRegion);
      setCurrentRegion(newRegion);
      setShowUsers(true);

      await updateUserLocation(user.email, {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      await loadNearbyUsers({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

    } catch (err) {
      console.error("Location error:", err);
      Alert.alert("Error", "Failed to get location");
    }
  };

  const handleUserPress = (userId) => {
    navigation.navigate("DisplayProfile", { userId });
  };

  const handleRegionChangeComplete = (region) => {
    setCurrentRegion(region);
  };

  const displayedUsers = useMemo(() => nearbyUsers, [nearbyUsers]);

  const handleMapPress = (event) => {
    if (isSelectingLocation) {
      const { coordinate } = event.nativeEvent;
      setTempLocation(coordinate);
      setShowConfirmModal(true);
    }
  };

  const confirmLocationSelection = async () => {
    if (tempLocation) {
      setSelectedLocation(tempLocation);
      setLocation({
        ...currentRegion,
        latitude: tempLocation.latitude,
        longitude: tempLocation.longitude,
      });

      await updateUserLocation(user.email, {
        latitude: tempLocation.latitude,
        longitude: tempLocation.longitude,
        isVirtual: true,
      });

      await loadNearbyUsers({
        latitude: tempLocation.latitude,
        longitude: tempLocation.longitude,
      });

      setShowUsers(true);
      setIsSelectingLocation(false);
    }
    setShowConfirmModal(false);
  };

  const startLocationSelection = () => {
    setIsSelectingLocation(true);
    Alert.alert(
      "Choose Location",
      "Choose a location on the map to set as your virtual location."
    );
  };

  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapSubHeader}>
        <View style={styles.mapPeopleNearbyContainer}>
          <Text style={styles.mapPeopleNearbyText}>People nearby</Text>
          <TouchableOpacity onPress={handleFilterPress} style={styles.mapFilterButton}>
            <Ionicons name="options-outline" size={24} color="#FF69B4" />
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={locationPermission && !isSelectingLocation}
        showsCompass={true}
        onPress={handleMapPress}
      >
        {showUsers && displayedUsers.map((user) => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: user.location.latitude,
              longitude: user.location.longitude
            }}
            tracksViewChanges={false}
          >
            <UserMarkerWithDistance 
              user={user}
              onPress={() => handleUserPress(user.id)}
            />
          </Marker>
        ))}
        {tempLocation && isSelectingLocation && (
          <Marker
            coordinate={tempLocation}
            pinColor="#FF69B4"
          />
        )}
        {selectedLocation && !isSelectingLocation && (
          <Marker
            coordinate={selectedLocation}
          >
            <View style={styles.virtualLocationMarker}>
              <Ionicons name="location" size={30} color="#FF69B4" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Locate me button */}
      <TouchableOpacity
        style={styles.MapLocateButton}
        onPress={verifyAndGetLocation}
      >
        <Ionicons name="locate" size={24} color="#FF69B4" />
      </TouchableOpacity>

      {/* Choose location button */}
      <TouchableOpacity
        style={styles.mapSelectLocationButton}
        onPress={startLocationSelection}
      >
        <Ionicons name="location" size={24} color="#FF69B4" />
      </TouchableOpacity>

      {/* Location confirmation modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.mapModalContainer}>
          <View style={styles.mapModalContent}>
            <Text style={styles.mapModalTitle}>Confirm location</Text>
            <Text style={styles.mapModalText}>Do you want to set this as your virtual location?</Text>
            <View style={styles.mapModalButtons}>
              <TouchableOpacity
                style={[styles.mapModalButton, styles.mapCancelButton]}
                onPress={() => {
                  setShowConfirmModal(false);
                  setTempLocation(null);
                }}
              >
                <Text style={styles.mapButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.mapModalButton, styles.mapConfirmButton]}
                onPress={confirmLocationSelection}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}