import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StyleSheet } from 'react-native';


export default function MusicScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#444444', dark: '#111111' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#ffc107" 
          name="guitars.fill" 
          style={styles.headerImage}
        />
      }>
    
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Um pouco da história da Música</ThemedText>
      </ThemedView>
      <ThemedText style={{ marginBottom: 15 }}>
        Uma jornada por fatos e curiosidades sobre os gêneros que definiram a cultura sonora ocidental.
      </ThemedText>
      
      
      {/*Metal*/}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle" style={{ marginTop: 20 }}>
          Heavy Metal
        </ThemedText>
      </ThemedView>
      
      <ThemedText style={{ marginBottom: 15 }}>
        O gênero que chocou o mundo com riffs pesados e temas sombrios.
      </ThemedText>
      
      
      <Collapsible title="O Início de Tudo: Black Sabbath">
        <ThemedText>
          O som do Heavy Metal é frequentemente creditado ao álbum Paranoid (1970) do 
          <ThemedText type="defaultSemiBold"> Black Sabbath</ThemedText>. Eles introduziram
          o uso de *riffs* pesados, afinações baixas e temas sombrios, que definiram o gênero.
        </ThemedText>
      </Collapsible>

      <Collapsible title="A Ascensão do Thrash">
        <ThemedText>
          O <ThemedText type="defaultSemiBold">Thrash Metal</ThemedText> surgiu no início dos anos 80,
          acelerando o ritmo e aumentando a agressividade. O Big Four (Metallica, Megadeth, Slayer e Anthrax)
          dominou essa era, com o álbum Master of Puppets do Metallica sendo um marco.
        </ThemedText>
      </Collapsible>

      <Collapsible title="O Mascote Mais Famoso">
        <ThemedText>
          <ThemedText type="defaultSemiBold">Eddie the Head</ThemedText> do Iron Maiden é um dos mascotes mais famosos
          da música, aparecendo em quase todas as capas de álbuns e shows da banda.
        </ThemedText>
      </Collapsible>



      {/*Música Clássica*/}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle" style={{ marginTop: 20 }}>
          Contraste: A Música Clássica
        </ThemedText>
      </ThemedView>

      <ThemedText style={{ marginBottom: 15 }}>
        A base de toda a música ocidental, desde o Barroco até o Romantismo.
      </ThemedText>

      <Collapsible title="Compositores e Períodos">
        <ThemedText>
          A música clássica, ou erudita, abrange um período de séculos, do Barroco (Bach, Vivaldi) ao Romantismo (Beethoven, Chopin). Muitos a consideram a base para toda a música ocidental moderna.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Instrumentação">
        <ThemedText>
          Enquanto o Metal foca na guitarra elétrica e bateria, a música erudita é dominada por instrumentos acústicos como violinos, violoncelos e piano. A orquestra sinfônica é seu maior veículo de expressão.
        </ThemedText>
      </Collapsible>
      


      {/*Jazz*/}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle" style={{ marginTop: 20 }}>
          O Ritmo Sincopado: Jazz
        </ThemedText>
      </ThemedView>

      <ThemedText style={{ marginBottom: 15 }}>
        Nascido em Nova Orleans, o Jazz é definido pela improvisação e síncopa rítmica.
      </ThemedText>

      <Collapsible title="Origem e Improvisação">
        <ThemedText>
          O <ThemedText type="defaultSemiBold">Jazz</ThemedText> nasceu em Nova Orleans, no final do século XIX, misturando a música folclrica africana com a europeia. A sua característica mais marcante é a <ThemedText type="defaultSemiBold">improvisação</ThemedText> e o uso de síncopas rítmicas.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Grandes Nomes">
        <ThemedText>
          Artistas icónicos como Louis Armstrong, Duke Ellington e Miles Davis foram cruciais para a evolução do Jazz. O álbum Kind of Blue de Miles Davis é frequentemente citado como o álbum de Jazz mais importante da história.
        </ThemedText>
      </Collapsible>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#ffc107',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});