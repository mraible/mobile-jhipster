import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import WeightActions from './weight.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import WeightDeleteModal from './weight-delete-modal';
import styles from './weight-styles';

function WeightDetailScreen(props) {
  const { route, getWeight, navigation, weight, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = weight?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Weight');
      } else {
        getWeight(routeEntityId);
      }
    }, [routeEntityId, getWeight, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Weight.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="weightDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{weight.id}</Text>
      {/* Timestamp Field */}
      <Text style={styles.label}>Timestamp:</Text>
      <Text testID="timestamp">{String(weight.timestamp)}</Text>
      {/* Weight Field */}
      <Text style={styles.label}>Weight:</Text>
      <Text testID="weight">{weight.weight}</Text>
      <Text style={styles.label}>User:</Text>
      <Text testID="user">{String(weight.user ? weight.user.login : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('WeightEdit', { entityId })}
          accessibilityLabel={'Weight Edit Button'}
          testID="weightEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Weight Delete Button'}
          testID="weightDeleteButton"
        />
        {deleteModalVisible && (
          <WeightDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={weight}
            testID="weightDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    weight: state.weights.weight,
    error: state.weights.errorOne,
    fetching: state.weights.fetchingOne,
    deleting: state.weights.deleting,
    errorDeleting: state.weights.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWeight: (id) => dispatch(WeightActions.weightRequest(id)),
    getAllWeights: (options) => dispatch(WeightActions.weightAllRequest(options)),
    deleteWeight: (id) => dispatch(WeightActions.weightDeleteRequest(id)),
    resetWeights: () => dispatch(WeightActions.weightReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WeightDetailScreen);
