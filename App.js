import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/bottomTabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
