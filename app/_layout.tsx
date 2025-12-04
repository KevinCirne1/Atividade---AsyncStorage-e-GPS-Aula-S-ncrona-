import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FatosProvider } from './contexts/FatosContext';
import { GenerosProvider } from './contexts/GenerosContext';
import { UsuariosProvider } from './contexts/UsuarioContext'; 

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UsuariosProvider> 
        <FatosProvider>
          <GenerosProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </GenerosProvider>
        </FatosProvider>
      </UsuariosProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}