import React from 'react';
import { ScrollView, Text } from 'react-native';
// Styles
import RoundedButton from '../../shared/components/rounded-button/rounded-button';

import styles from './entities-screen.styles';

export default function EntitiesScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="entityScreenScrollList">
      <Text style={styles.centerText}>JHipster Entities will appear below</Text>
      <RoundedButton text="Album" onPress={() => navigation.navigate('Album')} testID="albumEntityScreenButton" />
      <RoundedButton text="Photo" onPress={() => navigation.navigate('Photo')} testID="photoEntityScreenButton" />
      <RoundedButton text="Tag" onPress={() => navigation.navigate('Tag')} testID="tagEntityScreenButton" />
      {/* jhipster-react-native-entity-screen-needle */}
    </ScrollView>
  );
}
