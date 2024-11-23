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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 10,
    },
    photoWallImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    addPhotoButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FF69B4',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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

// Styles for NotificationScreen
const notificationScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    addButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1,
        padding: 10,
    },
    reminderItem: {
        flexDirection: 'row',
        backgroundColor: 'black',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    reminderContent: {
        flex: 1,
        marginRight: 10,
    },
    reminderTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color: 'white',
    },
    reminderDate: {
        fontSize: 14,
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 8,
    },
    timeInput: {
        marginVertical: 15,
    },
    listContainer: {
        padding: 16,
    },
    pastReminderItem: {
        opacity: 0.6,
    },
    pastReminderText: {
        textDecorationLine: 'line-through',
    },
});

export {
    profileScreenStyles,
    editProfileScreenStyles,
    displayProfileScreenStyles,
    likedListScreenStyles,
    notificationScreenStyles,
};
