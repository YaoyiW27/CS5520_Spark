import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

// Mock data for nearby users
const MOCK_NEARBY_USERS = [
  {
    id: "1",
    userName: "Alex",
    profileImage: "https://via.placeholder.com/150",
    gender: "men",
    age: 25,
    location: {
      latitude: 49.2488,
      longitude: -122.9805,
    },
  },
  {
    id: "2",
    userName: "Emma",
    profileImage: "https://via.placeholder.com/150",
    gender: "women",
    age: 30,
    location: {
      latitude: 49.2398,
      longitude: -122.9685,
    },
  },
];

export default function MapScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = useAuth();
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const [nearbyUsers, setNearbyUsers] = useState(MOCK_NEARBY_USERS);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);

  // State to hold current filters
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

  // Function to navigate to FilterScreen with current filters
  const handleFilterPress = () => {
    navigation.navigate("FilterScreen", { filters });
  };

  // Load nearby users (mocked here)
  const loadNearbyUsers = async () => {
    try {
      // In a real app, fetch data from API
      setNearbyUsers(MOCK_NEARBY_USERS);
    } catch (error) {
      console.error("Error loading nearby users:", error);
    }
  };

  // Verify location permissions and get current location
  const verifyAndGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location services to use this feature."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setLocation(newRegion);
      setCurrentRegion(newRegion);

      // Animate map to current location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (err) {
      console.error("Location error:", err);
      Alert.alert("Error", "Failed to get location");
    }
  };

  // Get user location on component mount
  useEffect(() => {
    verifyAndGetLocation();
  }, []);

  // Load nearby users when location is available
  useEffect(() => {
    if (location) {
      loadNearbyUsers();
    }
  }, [location]);

  // Filter users based on current filters
  useEffect(() => {
    const filterUsers = () => {
      const { gender, ageRange } = filters;

      const filtered = nearbyUsers.filter((user) => {
        const matchesGender = gender === "all" || user.gender === gender;
        const matchesAge = user.age >= ageRange[0] && user.age <= ageRange[1];
        return matchesGender && matchesAge;
      });

      setFilteredUsers(filtered);
    };

    filterUsers();
  }, [filters, nearbyUsers]);

  // Function to navigate to user's profile when marker is pressed
  const handleUserPress = (userId) => {
    navigation.navigate("DisplayProfile", { userId });
  };

  // Update current region when map region changes
  const handleRegionChangeComplete = (region) => {
    setCurrentRegion(region);
  };

  // Determine if a marker should be visible based on map region
  const isMarkerVisible = (markerLocation) => {
    if (!currentRegion) return true;
    return (
      markerLocation.latitude >=
        currentRegion.latitude - currentRegion.latitudeDelta / 2 &&
      markerLocation.latitude <=
        currentRegion.latitude + currentRegion.latitudeDelta / 2 &&
      markerLocation.longitude >=
        currentRegion.longitude - currentRegion.longitudeDelta / 2 &&
      markerLocation.longitude <=
        currentRegion.longitude + currentRegion.longitudeDelta / 2
    );
  };

  // Use memoization to optimize performance
  const displayedUsers = useMemo(() => {
    return filteredUsers.length > 0 ? filteredUsers : nearbyUsers;
  }, [filteredUsers, nearbyUsers]);

  // Prefetch user images for smoother rendering
  useEffect(() => {
    displayedUsers.forEach((user) => {
      Image.prefetch(user.profileImage);
    });
  }, [displayedUsers]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.subHeader}>
        <View style={styles.peopleNearbyContainer}>
          <Text style={styles.peopleNearbyText}>People nearby</Text>
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#FF69B4" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={location}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsMyLocationButton={true}
        >
          {/* Marker for Current User */}
          <Marker coordinate={location}>
            <View style={styles.currentUserMarker}>
              <Image
                source={{
                  uri: userProfile?.profileImage || "https://via.placeholder.com/150",
                }}
                style={styles.currentUserImage}
              />
            </View>
          </Marker>

          {/* Markers for Nearby Users */}
          {displayedUsers
            .filter((user) => isMarkerVisible(user.location))
            .map((user) => (
              <Marker
                key={user.id}
                coordinate={user.location}
                title={user.userName}
                onPress={() => handleUserPress(user.id)}
              >
                <View style={styles.userMarker}>
                  <Image
                    source={{ uri: user.profileImage }}
                    style={styles.markerImage}
                  />
                </View>
              </Marker>
            ))}
        </MapView>
      )}
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
  currentUserMarker: {
    padding: 2,
    borderRadius: 25,
    backgroundColor: "#FF69B4",
    borderWidth: 2,
    borderColor: "#fff",
  },
  currentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userMarker: {
    padding: 2,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  markerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});