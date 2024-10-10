import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen'
import ScanScreen from "./src/screens/ScanScreen"
import { ThemeProvider } from "./src/components/ThemeProvider"

const Stack = createNativeStackNavigator();

const App = () => {
  const [USDColor, setUSDColor] = useState("#85BB65");

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="Scan Receipt"
            component={ScanScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;