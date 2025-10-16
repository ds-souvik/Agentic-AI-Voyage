/**
 * FOCUSED ROOM - Main Tab Navigator
 * 
 * Bottom tab navigation with 5 tabs:
 * - Home: Dashboard, quick actions
 * - Sessions: Start/manage deep work sessions
 * - Reports: Analytics and insights
 * - Learn: Blog articles and tips
 * - Profile: User profile and settings
 * 
 * Psychology:
 * - Tab order optimized for user flow (Home first, Profile last)
 * - Icons are intuitive and recognizable
 * - Active state uses calming teal (motivating but not aggressive)
 * - Smooth transitions reduce cognitive load
 * 
 * @format
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';
import type { MainTabParamList } from './types';

// Import screens (we'll create these next)
import HomeScreen from '../screens/home/HomeScreen';
import SessionsScreen from '../screens/sessions/SessionsScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import LearnScreen from '../screens/learn/LearnScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tab Navigator
 * 
 * Bottom navigation with 5 tabs.
 * Uses icons and labels for clarity.
 */
export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        // Header styling
        headerStyle: {
          backgroundColor: theme.colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.neutral[200],
        },
        headerTitleStyle: {
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.semibold as any,
          color: theme.colors.text.primary,
        },
        
        // Tab bar styling
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral[200],
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.primary[500], // Teal when active
        tabBarInactiveTintColor: theme.colors.neutral[500], // Gray when inactive
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.xs,
          fontWeight: theme.typography.weights.medium as any,
          marginTop: 4,
        },
        
        // Animation
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🏠" color={color} size={size} />
          ),
          headerTitle: 'Focused Room',
        }}
      />
      
      <Tab.Screen
        name="Sessions"
        component={SessionsScreen}
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="⏱️" color={color} size={size} />
          ),
          headerTitle: 'Deep Work Sessions',
        }}
      />
      
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📊" color={color} size={size} />
          ),
          headerTitle: 'Reports & Analytics',
        }}
      />
      
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📚" color={color} size={size} />
          ),
          headerTitle: 'The Focus Formula',
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="👤" color={color} size={size} />
          ),
          headerTitle: 'Your Profile',
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Tab Icon Component
 * 
 * Simple emoji-based icons for now.
 * Can be replaced with vector icons later.
 */
interface TabIconProps {
  icon: string;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, size }) => {
  return (
    <Text style={{ fontSize: size }}>
      {icon}
    </Text>
  );
};

export default MainTabNavigator;

