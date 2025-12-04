import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGeneros } from './contexts/GenerosContext';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput, View, ScrollView } from 'react-native';
import * as Location from 'expo-location';

const NEON_GREEN = '#00FF7F';
const ACCENT_RED = '#CC0000';

export default function EditGeneroScreen() {
  const { id } = useLocalSearchParams();
  const { generosList, updateGenero, deleteGenero } = useGeneros();
  
  const [nome, setNome] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    const generoEncontrado = generosList.find(g => g.id === id);
    if (generoEncontrado) {
      setNome(generoEncontrado.nome);
    } else {
      router.back();
    }
  }, [id, generosList]);

  const handleUpdate = async (updateLocation: boolean) => {
    if (!id || typeof id !== 'string') return;
    let locationData = undefined;

    if (updateLocation) {
      setIsLoadingLocation(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getCurrentPositionAsync({});
          locationData = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        } else {
            Alert.alert('Permissão negada', 'Atualizando apenas texto.');
        }
      } catch (e) {
        Alert.alert('Erro', 'Falha no GPS');
      } finally {
        setIsLoadingLocation(false);
      }
    }
    await updateGenero(id, nome, locationData);
    router.back();
  };

  const handleDelete = async () => {
    if (!id || typeof id !== 'string') return;
    Alert.alert('Excluir', 'Confirmar exclusão?', [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: async () => { await deleteGenero(id); router.back(); } }]);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Editar Gênero' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>Editar Gênero</ThemedText>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" placeholderTextColor="#888" />
        
        <Pressable style={styles.saveButton} onPress={() => handleUpdate(false)}>
            <ThemedText style={styles.saveText}>Salvar (Manter Local)</ThemedText>
        </Pressable>

        <Pressable style={styles.gpsButton} onPress={() => handleUpdate(true)} disabled={isLoadingLocation}>
            {isLoadingLocation ? <ActivityIndicator color="#000"/> : <ThemedText style={styles.gpsText}>Salvar e Atualizar GPS 📍</ThemedText>}
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <ThemedText style={styles.deleteText}>Excluir Gênero</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1E' },
  content: { padding: 20 },
  title: { color: NEON_GREEN, marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#444', color: '#FFF', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: NEON_GREEN },
  saveButton: { backgroundColor: '#444', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#FFF' },
  saveText: { color: '#FFF', fontWeight: 'bold'},
  gpsButton: { backgroundColor: NEON_GREEN, padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  gpsText: { color: '#000', fontWeight: 'bold'},
  deleteButton: { backgroundColor: ACCENT_RED, padding: 15, borderRadius: 8, alignItems: 'center' },
  deleteText: { color: '#FFF', fontWeight: 'bold' }
});