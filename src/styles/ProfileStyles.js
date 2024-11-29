import { StyleSheet } from 'react-native';

// Styles for ProfileScreen
const profileScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
    },
    button: {
        width: '80%',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF69B4',
        marginTop: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FF69B4',
        fontSize: 16,
    },
    photoContainer: {
        marginTop: 20,
        position: 'relative',
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        fontSize: 30,
        color: '#666',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        color: '#000',
    },
    likesContainer: {
        marginTop: 12,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#FFE4E1',
    },
    likesText: {
        color: '#FF69B4',
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF69B4',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
});

// Styles for EditProfileScreen
const editProfileScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 16,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    photoText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    photoWallContainer: {
        width: '100%',
        padding: 10,
    },
    photoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 10,
    },
    photoWallImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    addPhotoButton: {
        width: 100,
        height: 100,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    addPhotoButtonText: {
        fontSize: 30,
        color: '#FF69B4',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#FF69B4',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#000',
    },
    aboutMeInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#FF69B4',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoWallHeader: {
        alignItems: 'center',
        marginBottom: 12,
    },
    photoWallTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    photoWallDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    photoWrapper: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 10,
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF0000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    addButtonsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    cameraButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
        width: '100%',
    },
});

// Styles for DisplayProfileScreen
const displayProfileScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    likeButton: {
        marginTop: 10,
    },
    infoContainer: {
        padding: 20,
    },
    infoItem: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#666',
    },
    photoWallSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    photoWallContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    photoWallImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    noPhotosText: {
        color: '#666',
        fontStyle: 'italic',
    },
});

// Styles for LikedListScreen
const likedListScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
        color: '#000',
    },
    listContent: {
        padding: 16,
    },
    likeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    username: {
        fontSize: 16,
        color: '#000',
    },
    noLikesText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});

// Styles for date plan screen
const datePlanScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF69B4',
        textAlign: 'center',
        marginVertical: 10,
    },
    decorationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 15,
    },
    decorationLine: {
        height: 1,
        width: 50,
        backgroundColor: '#FFB6C1',
        marginHorizontal: 10,
    },
    decorationHeart: {
        color: '#FF69B4',
        fontSize: 20,
    },
    subHeaderText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 5,
    },
    dateItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF0F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#FFB6C1',
    },
    pastDateItem: {
        opacity: 0.7,
        backgroundColor: '#F8F8F8',
        borderColor: '#D3D3D3',
    },
    dateContent: {
        flex: 1,
        marginRight: 12,
    },
    matchName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    location: {
        fontSize: 16,
        color: '#444',
        marginBottom: 6,
        fontWeight: '500',
    },
    dateTime: {
        fontSize: 15,
        color: '#555',
        marginBottom: 6,
        fontWeight: '400',
    },
    alertText: {
        fontSize: 14,
        color: '#FF1493',
        fontWeight: '500',
        fontStyle: 'italic',
    },
    deleteButton: {
        padding: 8,
        backgroundColor: '#FFF0F5',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF69B4',
        textAlign: 'center',
        marginBottom: 20,
    },
    picker: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
    },
    saveButton: {
        backgroundColor: '#FF69B4',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
    // Date and Time inputs
    dateTimeContainer: {
        marginBottom: 16,
    },
    dateTimeLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    completedDateItem: {
        backgroundColor: '#F0F0F0',
        borderColor: '#D3D3D3',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
        color: '#FF69B4',
        textTransform: 'capitalize',
    },
    completedStatusText: {
        color: '#888',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    selectedValueContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#f8f8f8',
    },
    selectedValueText: {
        fontSize: 16,
        color: '#333',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#FF69B4',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
});

export {
    profileScreenStyles,
    editProfileScreenStyles,
    displayProfileScreenStyles,
    likedListScreenStyles,
    datePlanScreenStyles,
};