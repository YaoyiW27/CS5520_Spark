import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { filterScreenStyles as styles } from '../../styles/DiscoverStyles';

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
    <View style={styles.filterContainer}>
      {/* Gender Filter */}
      <Text style={styles.filterTitle}>Gender</Text>
      <View style={styles.filterGenderButtons}>
        <TouchableOpacity
          style={[
            styles.filterGenderButton,
            gender === "male" && styles.filterActiveButton,
            { flex: 1 },
          ]}
          onPress={() => setGender("male")}
        >
          <Text style={[styles.filterButtonText, gender === "male" && styles.filterActiveText]}>
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterGenderButton,
            gender === "female" && styles.filterActiveButton,
            { flex: 1 },
          ]}
          onPress={() => setGender("female")}
        >
          <Text style={[styles.filterButtonText, gender === "female" && styles.filterActiveText]}>
            Female
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterGenderButton,
            gender === "non-binary" && styles.filterActiveButton,
            { flex: 1 },
          ]}
          onPress={() => setGender("non-binary")}
        >
          <Text style={[styles.filterButtonText, gender === "non-binary" && styles.filterActiveText]}>
            Non-binary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterGenderButton,
            gender === "all" && styles.filterActiveButton,
            { flex: 1 },
          ]}
          onPress={() => setGender("all")}
        >
          <Text style={[styles.filterButtonText, gender === "all" && styles.filterActiveText]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Distance Range Filter */}
      <View style={styles.filterRangeContainer}>
        <Text style={styles.filterTitle}>Distance (km)</Text>
        <Text style={styles.filterRangeText}>{`${distanceRange[0]} - ${distanceRange[1]}`}</Text>
        <Slider
          style={styles.filterSlider}
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
      <View style={styles.filterRangeContainer}>
        <Text style={styles.filterTitle}>Age Range</Text>
        <Text style={styles.rangeText}>{`${ageRange[0]} - ${ageRange[1]}`}</Text>
        <Slider
          style={styles.filterSlider}
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
      <TouchableOpacity style={styles.filterApplyButton} onPress={handleApply}>
        <Text style={styles.filterApplyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterScreen;