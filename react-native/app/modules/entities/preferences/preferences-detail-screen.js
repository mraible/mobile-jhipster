import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import PreferencesActions from './preferences.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import PreferencesDeleteModal from './preferences-delete-modal';
import styles from './preferences-styles';

function PreferencesDetailScreen(props) {
  const { route, getPreferences, navigation, preferences, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = preferences?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Preferences');
      } else {
        getPreferences(routeEntityId);
      }
    }, [routeEntityId, getPreferences, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Preferences.</Text>
      </View>
    );
  }
  if (!entityId || fetching || !correctEntityLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="preferencesDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{preferences.id}</Text>
      {/* WeeklyGoal Field */}
      <Text style={styles.label}>WeeklyGoal:</Text>
      <Text testID="weeklyGoal">{preferences.weeklyGoal}</Text>
      {/* WeightUnits Field */}
      <Text style={styles.label}>WeightUnits:</Text>
      <Text testID="weightUnits">{preferences.weightUnits}</Text>
      <Text style={styles.label}>User:</Text>
      <Text testID="user">{String(preferences.user ? preferences.user.login : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('PreferencesEdit', { entityId })}
          accessibilityLabel={'Preferences Edit Button'}
          testID="preferencesEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Preferences Delete Button'}
          testID="preferencesDeleteButton"
        />
        {deleteModalVisible && (
          <PreferencesDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={preferences}
            testID="preferencesDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    preferences: state.preferences.preferences,
    error: state.preferences.errorOne,
    fetching: state.preferences.fetchingOne,
    deleting: state.preferences.deleting,
    errorDeleting: state.preferences.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPreferences: (id) => dispatch(PreferencesActions.preferencesRequest(id)),
    getAllPreferences: (options) => dispatch(PreferencesActions.preferencesAllRequest(options)),
    deletePreferences: (id) => dispatch(PreferencesActions.preferencesDeleteRequest(id)),
    resetPreferences: () => dispatch(PreferencesActions.preferencesReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesDetailScreen);
