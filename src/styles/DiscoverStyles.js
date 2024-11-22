import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

// Styles for FilterScreen
const filterScreenStyles = StyleSheet.create({
    filterContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    filterTitle: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
        color: "#333",
    },
    filterGenderButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    filterGenderButton: {
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#FF69B4",
        alignItems: "center",
    },
    filterActiveButton: {
        backgroundColor: "#FF69B4",
    },
    filterButtonText: {
        color: "#FF69B4",
        fontSize: 16,
    },
    filterActiveText: {
        color: "#fff",
    },
    filterRangeContainer: {
        marginBottom: 30,
    },
    filterRangeText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    filterSlider: {
        width: "100%",
        height: 40,
    },
    filterApplyButton: {
        backgroundColor: "#FF69B4",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
    },
    filterApplyText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

// Styles for MapScreen
const mapScreenStyles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    mapSubHeader: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    mapPeopleNearbyContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    mapPeopleNearbyText: {
        fontSize: 24,
        fontWeight: "600",
        color: "#000",
    },
    mapFilterButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f8f8f8",
    },
    map: {
        flex: 1,
        width: width,
    },
    mapUserMarker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapMarkerImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#FF69B4',
        backgroundColor: '#fff',
    },
    mapDistanceContainer: {
        position: 'absolute',
        bottom: -20,
        backgroundColor: '#FF69B4',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        alignSelf: 'center',
    },
    mapDistanceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    MapLocateButton: {
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
    mapSelectLocationButton: {
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
    mapModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    mapModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    mapModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mapModalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    mapModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mapModalButton: {
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    mapCancelButton: {
        backgroundColor: '#ccc',
    },
    mapConfirmButton: {
        backgroundColor: '#FF69B4',
    },
    mapButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
    

export { filterScreenStyles, mapScreenStyles };