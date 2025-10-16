/**
 * FOCUSED ROOM - Main App Entry Point
 * 
 * This is the root component of the Focused Room mobile app.
 * It sets up:
 * - Theme provider (light/dark mode)
 * - Redux store
 * - Navigation
 * - Initial app state
 * 
 * Design Philosophy:
 * - Clean, minimal entry point
 * - All configuration in separate files
 * - Easy to test and maintain
 * 
 * @format
 */

import React from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

// Theme
import { theme, darkTheme } from './src/theme';

// Navigation
import { MainTabNavigator } from './src/navigation/MainTabNavigator';

/**
 * Root App Component
 * 
 * Full navigation with 5 bottom tabs:
 * - Home: Dashboard with streak and stats
 * - Sessions: Start/manage deep work sessions
 * - Reports: Analytics and insights
 * - Learn: Blog articles and tips
 * - Profile: User profile and settings
 */
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const currentTheme = isDarkMode ? darkTheme : theme;

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.white}
      />
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

