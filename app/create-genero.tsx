import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGeneros } from './contexts/GenerosContext';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput } from 'react-native';
import * as Location from 'expo-location';

const NEON_GREEN = '#00FF7F';

export default function CreateGeneroScreen() {
  const [newGeneroName, setNewGeneroName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false); // Novo estado
  const { addGenero } = useGeneros();

  const handleSubmit = async () => {
    if (newGeneroName.trim() === '') {
       Alert.alert('Erro', 'O nome do gênero não pode estar vazio.');
       return;
    }

    setIsLoadingLocation(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Salvando sem GPS.');
        await saveGenero(null);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      await saveGenero({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

    } catch (error) {
      Alert.alert('Erro GPS', 'Falha ao obter localização.');
      await saveGenero(null);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const saveGenero = async (locationData: { latitude: number; longitude: number } | null) => {
    const sucesso = await addGenero(newGeneroName, locationData || undefined);
    if (sucesso) {
      router.back();
    }
  };

  return (
    <ThemedView style={styles.modalContent}>
      <Stack.Screen options={{ title: 'Novo Gênero' }} />
      <ThemedText type="title" style={styles.modalHeaderTitle}>Criar Novo Gênero</ThemedText>
      <TextInput
        placeholder="Nome do Gênero"
        value={newGeneroName}
        onChangeText={setNewGeneroName}
        style={styles.input}
        placeholderTextColor="#888"
      />
      
      <Pressable 
        style={[styles.modalButton, isLoadingLocation && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={isLoadingLocation}
      >
        {isLoadingLocation ? (
          <ActivityIndicator color="#000" />
        ) : (
          <ThemedText style={styles.modalButtonText}>Obter GPS e Criar Gênero</ThemedText>
        )}
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => router.back()} disabled={isLoadingLocation}>
        <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  modalContent: { flex: 1, padding: 30, paddingTop: 80, alignItems: 'center', backgroundColor: '#2C2C2E' },
  modalHeaderTitle: { color: NEON_GREEN, marginBottom: 20 },
  input: { width: '100%', padding: 15, borderWidth: 1, borderColor: NEON_GREEN, borderRadius: 8, marginBottom: 15, fontSize: 16, backgroundColor: '#444444', color: '#EFEFEF' },
  modalButton: { backgroundColor: NEON_GREEN, padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10, height: 50, justifyContent: 'center' },
  disabledButton: { opacity: 0.7 },
  modalButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  cancelButton: { marginTop: 15 },
  cancelButtonText: { color: '#EFEFEF' },
});