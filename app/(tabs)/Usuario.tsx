import { Ionicons } from '@expo/vector-icons'; // <--- Importação nova para garantir o ícone
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUsuarios, Usuario } from '../contexts/UsuarioContext';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View, Alert } from 'react-native';
import { Stack } from 'expo-router';

const NEON_GREEN = '#00FF7F';
const CARD_BACKGROUND = '#333333';
const MAIN_BACKGROUND = '#1C1C1E';
const ACCENT_RED = '#CC0000';

export default function UsuariosScreen() {
  const { usuariosList, addUsuario, deleteUsuario } = useUsuarios();
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleCreate = async () => {
    await addUsuario(nome, email);
    setNome('');
    setEmail('');
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Excluir', 'Deseja remover este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteUsuario(id) }
    ]);
  };

  const renderItem = ({ item }: { item: Usuario }) => (
    <ThemedView style={styles.userItem}>
      <View style={{ flex: 1 }}>
        <ThemedText type="subtitle" style={styles.userName}>{item.nome}</ThemedText>
        <ThemedText style={styles.userEmail}>{item.email}</ThemedText>
      </View>
      <Pressable onPress={() => handleDelete(item.id)}>
        <IconSymbol name="trash.fill" size={24} color={ACCENT_RED} />
      </Pressable>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Usuários' }} />

      <FlatList
        data={usuariosList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>Nenhum usuário cadastrado.</ThemedText>}
      />

      {/* Botão Flutuante para Abrir Modal */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        {/* Usando Ionicons diretamente para garantir que o ícone apareça */}
        <Ionicons name="add" size={30} color="#000" />
      </Pressable>

      {/* --- O MODAL DE CRIAÇÃO --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>Novo Usuário</ThemedText>
            
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <Pressable style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                <ThemedText style={{color: '#FFF'}}>Cancelar</ThemedText>
              </Pressable>
              
              <Pressable style={[styles.btn, styles.btnSave]} onPress={handleCreate}>
                <ThemedText style={{color: '#000', fontWeight: 'bold'}}>Salvar</ThemedText>
              </Pressable>
            </View>

          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAIN_BACKGROUND },
  listPadding: { padding: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  
  userItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: CARD_BACKGROUND, 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: NEON_GREEN
  },
  userName: { color: '#FFF', fontSize: 18 },
  userEmail: { color: '#AAA', fontSize: 14 },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: NEON_GREEN,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { width: '85%', padding: 20, borderRadius: 15, backgroundColor: '#2C2C2E', borderWidth: 1, borderColor: '#444' },
  modalTitle: { textAlign: 'center', marginBottom: 20, color: NEON_GREEN },
  input: { backgroundColor: '#444', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#555' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  btn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center' },
  btnCancel: { backgroundColor: '#444' },
  btnSave: { backgroundColor: NEON_GREEN },
});