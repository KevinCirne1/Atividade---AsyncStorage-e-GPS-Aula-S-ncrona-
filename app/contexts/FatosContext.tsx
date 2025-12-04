import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

export type Fato = {
  id: string;
  titulo: string;
  conteudo: string;
  generoId: number;
  location?: { latitude: number; longitude: number };
};

type FatosContextType = {
  fatosList: Fato[];
  addFato: (titulo: string, conteudo: string, location?: { latitude: number; longitude: number }) => Promise<boolean>;
  updateFato: (id: string, titulo: string, conteudo: string, location?: { latitude: number; longitude: number }) => Promise<void>;
  deleteFato: (id: string) => Promise<void>;
};

const STORAGE_KEY = '@app_fatos';

const initialFatos: Fato[] = [
  { id: '1', titulo: 'O Riff É A Base', conteudo: 'O Heavy Metal é construído sobre o riff.', generoId: 1 },
  { id: '2', titulo: 'A Nona Sinfonia', conteudo: 'Um marco na obra de Beethoven.', generoId: 2 },
];

const FatosContext = createContext<FatosContextType | undefined>(undefined);

export const FatosProvider = ({ children }: { children: ReactNode }) => {
  const [fatosList, setFatosList] = useState<Fato[]>([]);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setFatosList(JSON.parse(jsonValue));
      } else {
        setFatosList(initialFatos);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialFatos));
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os fatos.');
    }
  };

  const saveToStorage = async (newList: Fato[]) => {
    setFatosList(newList);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const addFato = async (titulo: string, conteudo: string, location?: { latitude: number; longitude: number }) => {
    if (titulo.trim() === '' || conteudo.trim() === '') {
      Alert.alert('Erro', 'Preencha o Título e o Conteúdo.');
      return false;
    }

    const maxId = fatosList.reduce((max, f) => (parseInt(f.id) > max ? parseInt(f.id) : max), 0);
    const newFato: Fato = {
      id: (maxId + 1).toString(),
      titulo: titulo.trim(),
      conteudo: conteudo.trim(),
      generoId: 1,
      location: location,
    };

    const newList = [newFato, ...fatosList];
    await saveToStorage(newList);
    Alert.alert('Sucesso', 'Novo fato criado.');
    return true;
  };

  const updateFato = async (id: string, titulo: string, conteudo: string, location?: { latitude: number; longitude: number }) => {
    if (titulo.trim() === '' || conteudo.trim() === '') return;
    
    const newList = fatosList.map(f => {
      if (f.id === id) {
        return { ...f, titulo, conteudo, location: location || f.location };
      }
      return f;
    });
    
    await saveToStorage(newList);
    Alert.alert('Sucesso', 'Fato atualizado.');
  };

  const deleteFato = async (id: string) => {
    const newList = fatosList.filter(f => f.id !== id);
    await saveToStorage(newList);
    Alert.alert('Sucesso', 'Fato excluído.');
  };

  return (
    <FatosContext.Provider value={{ fatosList, addFato, updateFato, deleteFato }}>
      {children}
    </FatosContext.Provider>
  );
};

export const useFatos = () => {
  const context = useContext(FatosContext);
  if (!context) throw new Error('useFatos deve ser usado dentro de um FatosProvider');
  return context;
};