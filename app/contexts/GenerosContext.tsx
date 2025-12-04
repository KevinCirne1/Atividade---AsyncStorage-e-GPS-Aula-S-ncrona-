import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

export type Genero = {
  id: string;
  nome: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

type GenerosContextType = {
  generosList: Genero[];
  addGenero: (nome: string, location?: { latitude: number; longitude: number }) => Promise<boolean>;
  updateGenero: (id: string, nome: string, location?: { latitude: number; longitude: number }) => Promise<void>;
  deleteGenero: (id: string) => Promise<void>;
};

const STORAGE_KEY = '@app_generos';

const initialGeneros: Genero[] = [
  { id: '1', nome: 'Heavy Metal' },
  { id: '2', nome: 'Música Clássica' },
  { id: '3', nome: 'Jazz' },
];

const GenerosContext = createContext<GenerosContextType | undefined>(undefined);

export const GenerosProvider = ({ children }: { children: ReactNode }) => {
  const [generosList, setGenerosList] = useState<Genero[]>([]);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setGenerosList(JSON.parse(jsonValue));
      } else {
        setGenerosList(initialGeneros);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialGeneros));
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os gêneros.');
    }
  };

  const saveToStorage = async (newList: Genero[]) => {
    setGenerosList(newList);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const addGenero = async (nome: string, location?: { latitude: number; longitude: number }) => {
    if (nome.trim() === '') {
      Alert.alert('Erro', 'O nome do gênero não pode estar vazio.');
      return false;
    }
    const maxId = generosList.reduce((max, g) => (parseInt(g.id) > max ? parseInt(g.id) : max), 0);
    
    const newGenero: Genero = { 
      id: (maxId + 1).toString(), 
      nome: nome.trim(),
      location: location, 
    };
    
    const newList = [newGenero, ...generosList];
    await saveToStorage(newList);
    Alert.alert('Sucesso', 'Novo gênero adicionado.');
    return true;
  };

  const updateGenero = async (id: string, nome: string, location?: { latitude: number; longitude: number }) => {
    if (nome.trim() === '') return;
    
    const newList = generosList.map(g => {
        if (g.id === id) {
            return { ...g, nome: nome.trim(), location: location || g.location };
        }
        return g;
    });

    await saveToStorage(newList);
    Alert.alert('Sucesso', 'Gênero atualizado.');
  };

  const deleteGenero = async (id: string) => {
    const newList = generosList.filter(g => g.id !== id);
    await saveToStorage(newList);
    Alert.alert('Sucesso', 'Gênero excluído.');
  };

  return (
    <GenerosContext.Provider value={{ generosList, addGenero, updateGenero, deleteGenero }}>
      {children}
    </GenerosContext.Provider>
  );
};

export const useGeneros = () => {
  const context = useContext(GenerosContext);
  if (!context) throw new Error('useGeneros deve ser usado dentro de um GenerosProvider');
  return context;
};