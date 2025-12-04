import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFatos, Fato } from '../contexts/FatosContext';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

const NEON_GREEN = '#00FF7F';
const CARD_BACKGROUND = '#333333';
const MAIN_BACKGROUND = '#1C1C1E';

export default function GerenciarFatosScreen() {
  const { fatosList } = useFatos();

  const handleNavigateToCreate = () => {
    router.push('/create-fato');
  };

  const handleNavigateToEdit = (id: string) => {
    router.push({ pathname: '/edit-fato', params: { id } });
  };

  const renderItem = ({ item }: { item: Fato }) => (
    <Pressable onPress={() => handleNavigateToEdit(item.id)}>
      <ThemedView style={styles.factItem}>
        <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.factTitle}>{item.titulo}</ThemedText>
            <IconSymbol name="pencil" size={20} color={NEON_GREEN} />
        </View>
        <ThemedText style={styles.factContent} numberOfLines={2}>{item.conteudo}</ThemedText>
        {item.location && (
          <ThemedText style={styles.locationText}>
            📍 Lat: {item.location.latitude.toFixed(4)}, Long: {item.location.longitude.toFixed(4)}
          </ThemedText>
        )}
      </ThemedView>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.headerTitle}>Gerenciar Fatos</ThemedText>
      <FlatList<Fato>
        data={fatosList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListPadding}
        style={styles.flatListBase}
      />
      <View style={styles.footerButtonContainer}>
        <Pressable style={styles.addButton} onPress={handleNavigateToCreate}>
          <IconSymbol name="plus.circle.fill" size={24} color="#FFF" />
          <ThemedText style={styles.addButtonText}>Criar Novo Fato</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAIN_BACKGROUND },
  flatListBase: { paddingHorizontal: 20 },
  flatListPadding: { paddingTop: 10, paddingBottom: 80 },
  headerTitle: { textAlign: 'center', marginBottom: 5, color: NEON_GREEN, paddingTop: 20 },
  footerButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'rgba(28, 28, 30, 0.95)', borderTopWidth: 1, borderTopColor: '#333333' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: NEON_GREEN, padding: 15, borderRadius: 8, elevation: 8 },
  addButtonText: { color: '#000', fontWeight: 'bold', marginLeft: 10, fontSize: 18 },
  factItem: { backgroundColor: CARD_BACKGROUND, padding: 18, marginBottom: 12, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: NEON_GREEN },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  factTitle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, flex: 1, marginRight: 10 },
  factContent: { color: '#E0E0E0', marginTop: 5 },
  locationText: { color: NEON_GREEN, fontSize: 12, marginTop: 8 },
});