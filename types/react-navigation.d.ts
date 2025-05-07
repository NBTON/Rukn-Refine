declare module '@react-navigation/native' {
  import * as React from 'react';

  export interface Theme {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
  }

  export const DefaultTheme: Theme;
  export const DarkTheme: Theme;

  export type NavigationState = {
    index: number;
    routes: Array<{
      name: string;
      params?: object;
      state?: NavigationState;
    }>;
  };

  export type NavigationProp<ParamList, RouteName extends keyof ParamList = string> = {
    navigate<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
    goBack(): void;
    reset(state: NavigationState): void;
    // Add other methods as needed
  };

  export type RouteProp<ParamList, RouteName extends keyof ParamList = string> = {
    key: string;
    name: RouteName;
    params: ParamList[RouteName];
  };

  export function useNavigation<T = any>(): T;
  export function useRoute<T = any>(): T;

  export interface NavigationContainerProps {
    theme?: Theme;
    children?: React.ReactNode;
    // Add other props as needed
  }

  export interface ThemeProviderProps {
    value: Theme;
    children?: React.ReactNode;
  }

  export const NavigationContainer: React.FC<NavigationContainerProps>;
  export const ThemeProvider: React.FC<ThemeProviderProps>;
}
