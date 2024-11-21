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
import { updateUserLocation, getNearbyUsers } from "../../Firebase/firebaseHelper";
import { db } from "../../Firebase/firebaseSetup";
import { collection, onSnapshot, query } from 'firebase/firestore';

const { width } = Dimensions.get("window");

const UserMarkerWithDistance = ({ user, onPress }) => {
  return (
    <View>
      <TouchableOpacity 
        style={styles.userMarker}
        onPress={onPress}
      >
        <Image
          source={{ uri: user.profileImage }}
          style={styles.markerImage}
        />
      </TouchableOpacity>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>{user.distance}km</Text>
      </View>
    </View>
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
    latitude: 49.2827,  // Vancouver's default coordinates
    longitude: -123.1207,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const [filters, setFilters] = useState(route.params?.filters || {
    gender: "all",
    distanceRange: [0, 75],
    ageRange: [18, 80],
  });

  // update nearby users when location changes
  useEffect(() => {
    const usersQuery = query(collection(db, 'Users'));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      if (location) {
        loadNearbyUsers({
          latitude: location.latitude,
          longitude: location.longitude
        });
      }
    });

    return () => unsubscribe();
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
        showsUserLocation={locationPermission}
        showsCompass={true}
      >
        {showUsers && displayedUsers.map((user) => (
          <Marker
            key={user.id}
            coordinate={user.location}
            tracksViewChanges={false}
          >
            <UserMarkerWithDistance 
              user={user}
              onPress={() => handleUserPress(user.id)}
            />
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.locateButton}
        onPress={verifyAndGetLocation}
      >
        <Ionicons name="locate" size={24} color="#FF69B4" />
      </TouchableOpacity>
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
});