import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { CameraAnalysisScreen } from '../screens/CameraAnalysisScreen';
import { TimerScreen } from '../screens/TimerScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CameraAnalysis"
          component={CameraAnalysisScreen}
          options={{ title: 'Analyze Beans' }}
        />
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={{ title: 'Brewing Timer' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Brew History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
