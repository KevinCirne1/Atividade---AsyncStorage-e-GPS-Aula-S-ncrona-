import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFatos } from './contexts/FatosContext';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput, View, ScrollView } from 'react-native';
import * as Location from 'expo-location';

const NEON_GREEN = '#00FF7F';
const ACCENT_RED = '#CC0000';

export default function EditFatoScreen() {
  const { id } = useLocalSearchParams();
  const { fatosList, updateFato, deleteFato } = useFatos();
  
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    const fatoEncontrado = fatosList.find(f => f.id === id);
    if (fatoEncontrado) {
      setTitulo(fatoEncontrado.titulo);
      setConteudo(fatoEncontrado.conteudo);
    } else {
      Alert.alert('Erro', 'Fato não encontrado');
      router.back();
    }
  }, [id, fatosList]);

  const handleUpdate = async (updateLocation: boolean) => {
    if (!id || typeof id !== 'string') return;

    let locationData = undefined;

    if (updateLocation) {
      setIsLoadingLocation(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Atualizando apenas texto.');
        } else {
          let location = await Location.getCurrentPositionAsync({});
          locationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
        }
      } catch (e) {
        Alert.alert('Erro GPS', 'Não foi possível obter a localização.');
      } finally {
        setIsLoadingLocation(false);
      }
    }

    await updateFato(id, titulo, conteudo, locationData);
    router.back();
  };

  const handleDelete = async () => {
    if (!id || typeof id !== 'string') return;
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          await deleteFato(id);
          router.back();
        } 
      }
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Editar Fato', headerBackTitle: 'Voltar' }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>Editar Fato</ThemedText>
        
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          placeholderTextColor="#888"
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={conteudo}
          onChangeText={setConteudo}
          placeholder="Conteúdo"
          placeholderTextColor="#888"
          multiline
        />

        {/* Botão Salvar Mantendo Localização Antiga */}
        <Pressable style={styles.saveButton} onPress={() => handleUpdate(false)} disabled={isLoadingLocation}>
          <ThemedText style={styles.btnText}>Salvar (Manter Local)</ThemedText>
        </Pressable>

        {/* Botão Salvar Atualizando GPS */}
        <Pressable style={[styles.gpsButton, isLoadingLocation && {opacity: 0.7}]} onPress={() => handleUpdate(true)} disabled={isLoadingLocation}>
          {isLoadingLocation ? <ActivityIndicator color="#000" /> : <ThemedText style={styles.btnText}>Salvar e Atualizar GPS 📍</ThemedText>}
        </Pressable>

        {/* Botão Excluir */}
        <Pressable style={styles.deleteButton} onPress={handleDelete} disabled={isLoadingLocation}>
          <ThemedText style={[styles.btnText, {color: '#FFF'}]}>Excluir Fato</ThemedText>
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
  gpsButton: { backgroundColor: NEON_GREEN, padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  deleteButton: { backgroundColor: ACCENT_RED, padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { fontWeight: 'bold', fontSize: 16, color: '#000' }
});