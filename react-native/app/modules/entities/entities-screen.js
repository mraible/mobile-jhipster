import React from 'react';
import { ScrollView, Text } from 'react-native';
// Styles
import RoundedButton from '../../shared/components/rounded-button/rounded-button';

import styles from './entities-screen.styles';

export default function EntitiesScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="entityScreenScrollList">
      <Text style={styles.centerText}>JHipster Entities will appear below</Text>
      <RoundedButton text="Points" onPress={() => navigation.navigate('Points')} testID="pointsEntityScreenButton" />
      <RoundedButton text="BloodPressure" onPress={() => navigation.navigate('BloodPressure')} testID="bloodPressureEntityScreenButton" />
      <RoundedButton text="Weight" onPress={() => navigation.navigate('Weight')} testID="weightEntityScreenButton" />
      <RoundedButton text="Preferences" onPress={() => navigation.navigate('Preferences')} testID="preferencesEntityScreenButton" />
      {/* jhipster-react-native-entity-screen-needle */}
    </ScrollView>
  );
}
