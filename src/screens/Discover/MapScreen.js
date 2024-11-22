import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
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

const { width } = Dimensions.get("window");

const UserMarkerWithDistance = ({ user, onPress }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.userMarker}>
        <Image 
          source={{ uri: imageError ? 'https://via.placeholder.com/150' : user.profileImage }}
          style={styles.markerImage}
          onError={(e) => {
            console.log(`Error loading image for user ${user.id}:`, e.nativeEvent.error);
            setImageError(true);
          }}
        />
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{user.distance}km</Text>
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
  const [filteredUsers, setFilteredUsers] = useState([]);
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

  useEffect(() => {
    const loadAndSubscribe = async () => {
      if (location) {
        try {
          const unsubscribe = onSnapshot(collection(db, 'Users'), async (snapshot) => {
            console.log("Snapshot updated");
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

  useEffect(() => {
    if (route.params?.filters) {
      setFilters(route.params.filters);
    }
  }, [route.params?.filters]);

  const handleFilterPress = () => {
    navigation.navigate("FilterScreen", { filters });
  };

  const loadNearbyUsers = async (userLocation) => {
    try {
      const users = await getNearbyUsers(userLocation);
      console.log("Loaded nearby users:", users);
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
    console.log(`User pressed: ${userId}`);
    navigation.navigate("DisplayProfile", { userId });
  };

  useEffect(() => {
    const filterUsers = () => {
      const { gender, ageRange, distanceRange } = filters;

      const filtered = nearbyUsers.filter((user) => {
        const matchesGender = gender === "all" || user.gender === gender;
        const matchesAge = user.age >= ageRange[0] && user.age <= ageRange[1];
        const matchesDistance = user.distance >= distanceRange[0] && user.distance <= distanceRange[1];
        return matchesGender && matchesAge && matchesDistance;
      });

      setFilteredUsers(filtered);
    };

    filterUsers();
  }, [filters, nearbyUsers]);

  const handleRegionChangeComplete = (region) => {
    setCurrentRegion(region);
  };

  const displayedUsers = useMemo(() => {
    return filteredUsers.length > 0 ? filteredUsers : nearbyUsers;
  }, [filteredUsers, nearbyUsers]);

    const handleMapPress = (event) => {
      if (isSelectingLocation) {
        const { coordinate } = event.nativeEvent;
        setTempLocation(coordinate);
        setShowConfirmModal(true);
      }
    };
  
    // confirm location selection
    const confirmLocationSelection = async () => {
      if (tempLocation) {
        setSelectedLocation(tempLocation);
        setLocation({
          ...currentRegion,
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
        });
  
        // update user location
        await updateUserLocation(user.email, {
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
          isVirtual: true, // manually set virtual location
        });
  
        // load nearby users
        await loadNearbyUsers({
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
        });
  
        setShowUsers(true);
        setIsSelectingLocation(false);
      }
      setShowConfirmModal(false);
    };
  
    // start location selection
    const startLocationSelection = () => {
      setIsSelectingLocation(true);
      Alert.alert(
        "Choose Location",
        "Choose a location on the map to set as your virtual location." 
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <View style={styles.peopleNearbyContainer}>
            <Text style={styles.peopleNearbyText}>People nearby</Text>
            <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
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
  
        {/* locate me button */}
        <TouchableOpacity
          style={styles.locateButton}
          onPress={verifyAndGetLocation}
        >
          <Ionicons name="locate" size={24} color="#FF69B4" />
        </TouchableOpacity>
  
        {/* choose a location button */}
        <TouchableOpacity
          style={styles.selectLocationButton}
          onPress={startLocationSelection}
        >
          <Ionicons name="location" size={24} color="#FF69B4" />
        </TouchableOpacity>
  
        {/* location confirmation modal */}
        <Modal
          visible={showConfirmModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm location</Text>
              <Text style={styles.modalText}>Do you want to set this as your virtual location?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowConfirmModal(false);
                    setTempLocation(null);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  subHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  peopleNearbyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  peopleNearbyText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  map: {
    flex: 1,
    width: width,
  },
  userMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FF69B4',
    backgroundColor: '#fff',
  },
  distanceContainer: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: '#FF69B4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'center',
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  locateButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectLocationButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#FF69B4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});