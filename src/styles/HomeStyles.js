import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Styles for SearchScreen
const searchScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    listContainer: {
        padding: 10,
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
    },
    name: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    loader: {
        marginTop: 20,
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        lineHeight: 24,
    },
});

// Styles for SwipeScreen
const swipeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        height: SCREEN_WIDTH * 1.25,
        width: SCREEN_WIDTH * 0.8,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignSelf: 'center',
        position: 'relative',
        marginTop: 20,
    },
    photoContainer: {
        flex: 3.5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    userInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
});

export { searchScreenStyles, swipeScreenStyles };
