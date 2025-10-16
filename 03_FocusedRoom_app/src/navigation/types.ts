/**
 * FOCUSED ROOM - Navigation Types
 * 
 * Type-safe navigation for React Navigation.
 * 
 * This ensures we can't navigate to non-existent screens
 * or pass wrong parameters.
 * 
 * @format
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Root Stack Navigator Params
 * 
 * Top-level navigation structure.
 */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  // Future: Auth, Onboarding, Modals
};

/**
 * Main Tab Navigator Params
 * 
 * Bottom tab navigation with 5 tabs.
 */
export type MainTabParamList = {
  Home: undefined;
  Sessions: undefined;
  Reports: undefined;
  Learn: undefined;
  Profile: undefined;
};

/**
 * Home Stack Navigator Params
 */
export type HomeStackParamList = {
  HomeScreen: undefined;
  // Future: SessionConfig, etc.
};

/**
 * Sessions Stack Navigator Params
 */
export type SessionsStackParamList = {
  SessionsList: undefined;
  // Future: ActiveSession, SessionComplete, etc.
};

/**
 * Reports Stack Navigator Params
 */
export type ReportsStackParamList = {
  ReportsScreen: undefined;
  // Future: DetailedReport, ExportReport, etc.
};

/**
 * Learn Stack Navigator Params
 */
export type LearnStackParamList = {
  LearnScreen: undefined;
  // Future: ArticleDetail, etc.
};

/**
 * Profile Stack Navigator Params
 */
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  // Future: EditProfile, Settings, etc.
};

// Re-export navigation types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

