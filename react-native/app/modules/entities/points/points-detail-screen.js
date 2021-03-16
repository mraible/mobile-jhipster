import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { convertLocalDateToString } from '../../../shared/util/date-transforms';

import PointsActions from './points.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import PointsDeleteModal from './points-delete-modal';
import styles from './points-styles';

function PointsDetailScreen(props) {
  const { route, getPoints, navigation, points, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = points?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Points');
      } else {
        getPoints(routeEntityId);
      }
    }, [routeEntityId, getPoints, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Points.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="pointsDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{points.id}</Text>
      {/* Date Field */}
      <Text style={styles.label}>Date:</Text>
      <Text testID="date">{convertLocalDateToString(points.date)}</Text>
      {/* Exercise Field */}
      <Text style={styles.label}>Exercise:</Text>
      <Text testID="exercise">{points.exercise}</Text>
      {/* Meals Field */}
      <Text style={styles.label}>Meals:</Text>
      <Text testID="meals">{points.meals}</Text>
      {/* Alcohol Field */}
      <Text style={styles.label}>Alcohol:</Text>
      <Text testID="alcohol">{points.alcohol}</Text>
      {/* Notes Field */}
      <Text style={styles.label}>Notes:</Text>
      <Text testID="notes">{points.notes}</Text>
      <Text style={styles.label}>User:</Text>
      <Text testID="user">{String(points.user ? points.user.login : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('PointsEdit', { entityId })}
          accessibilityLabel={'Points Edit Button'}
          testID="pointsEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Points Delete Button'}
          testID="pointsDeleteButton"
        />
        {deleteModalVisible && (
          <PointsDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={points}
            testID="pointsDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    points: state.points.points,
    error: state.points.errorOne,
    fetching: state.points.fetchingOne,
    deleting: state.points.deleting,
    errorDeleting: state.points.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPoints: (id) => dispatch(PointsActions.pointsRequest(id)),
    getAllPoints: (options) => dispatch(PointsActions.pointsAllRequest(options)),
    deletePoints: (id) => dispatch(PointsActions.pointsDeleteRequest(id)),
    resetPoints: () => dispatch(PointsActions.pointsReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PointsDetailScreen);
