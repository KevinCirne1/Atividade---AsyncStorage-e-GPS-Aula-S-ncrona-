import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

export type Usuario = {
  id: string;
  nome: string;
  email: string;
};

type UsuariosContextType = {
  usuariosList: Usuario[];
  addUsuario: (nome: string, email: string) => Promise<void>;
  deleteUsuario: (id: string) => Promise<void>;
};

const STORAGE_KEY = '@app_usuarios';

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

export const UsuariosProvider = ({ children }: { children: ReactNode }) => {
  const [usuariosList, setUsuariosList] = useState<Usuario[]>([]);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setUsuariosList(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    }
  };

  const saveToStorage = async (newList: Usuario[]) => {
    setUsuariosList(newList);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const addUsuario = async (nome: string, email: string) => {
    if (nome.trim() === '' || email.trim() === '') {
      Alert.alert('Erro', 'Preencha nome e email.');
      return;
    }

    const newUsuario: Usuario = {
      id: Date.now().toString(), 
      nome: nome.trim(),
      email: email.trim(),
    };

    const newList = [newUsuario, ...usuariosList];
    await saveToStorage(newList);
    Alert.alert('Sucesso', 'Usuário criado!');
  };

  const deleteUsuario = async (id: string) => {
    const newList = usuariosList.filter(u => u.id !== id);
    await saveToStorage(newList);
  };

  return (
    <UsuariosContext.Provider value={{ usuariosList, addUsuario, deleteUsuario }}>
      {children}
    </UsuariosContext.Provider>
  );
};

export const useUsuarios = () => {
  const context = useContext(UsuariosContext);
  if (!context) throw new Error('useUsuarios deve ser usado dentro de um UsuariosProvider');
  return context;
};