import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";

const FilterScreen = ({ navigation, route }) => {
  // Initialize state with passed filters or default values
  const [gender, setGender] = useState(route.params?.filters?.gender || "all");
  const [distanceRange, setDistanceRange] = useState(
    route.params?.filters?.distanceRange || [0, 75]
  );
  const [ageRange, setAgeRange] = useState(
    route.params?.filters?.ageRange || [18, 80]
  );

  // Function to handle the Apply button press
  const handleApply = () => {
    // Navigate back to 'Discover' screen in 'Main' navigator with updated filters
    navigation.navigate("Main", {
      screen: "Discover",
      params: {
        filters: {
          gender,
          distanceRange,
          ageRange,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Gender Filter */}
      <Text style={styles.title}>Gender</Text>
      <View style={styles.genderButtons}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "men" && styles.activeButton,
            { flex: 1 },
          ]}
          onPress={() => setGender("men")}
        >
          <Text style={[styles.buttonText, gender === "men" && styles.activeText]}>
            Men
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "women" && styles.activeButton,
            { flex: 1 },
          ]}
          onPress={() => setGender("women")}
        >
          <Text style={[styles.buttonText, gender === "women" && styles.activeText]}>
            Women
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "all" && styles.activeButton,
            { flex: 1 },
          ]}
          onPress={() => setGender("all")}
        >
          <Text style={[styles.buttonText, gender === "all" && styles.activeText]}>
            Both
          </Text>
        </TouchableOpacity>
      </View>

      {/* Distance Range Filter */}
      <View style={styles.rangeContainer}>
        <Text style={styles.title}>Distance (km)</Text>
        <Text style={styles.rangeText}>{`${distanceRange[0]} - ${distanceRange[1]}`}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={75}
          value={distanceRange[1]}
          onValueChange={(value) => setDistanceRange([0, Math.round(value)])}
          minimumTrackTintColor="#FF69B4"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#FF69B4"
        />
      </View>

      {/* Age Range Filter */}
      <View style={styles.rangeContainer}>
        <Text style={styles.title}>Age Range</Text>
        <Text style={styles.rangeText}>{`${ageRange[0]} - ${ageRange[1]}`}</Text>
        <Slider
          style={styles.slider}
          minimumValue={18}
          maximumValue={80}
          value={ageRange[1]}
          onValueChange={(value) => setAgeRange([18, Math.round(value)])}
          minimumTrackTintColor="#FF69B4"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#FF69B4"
        />
      </View>

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  genderButton: {
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FF69B4",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#FF69B4",
  },
  buttonText: {
    color: "#FF69B4",
    fontSize: 16,
  },
  activeText: {
    color: "#fff",
  },
  rangeContainer: {
    marginBottom: 30,
  },
  rangeText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  applyButton: {
    backgroundColor: "#FF69B4",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  applyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FilterScreen;
