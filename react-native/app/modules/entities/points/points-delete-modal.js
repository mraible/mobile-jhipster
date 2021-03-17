import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import PointsActions from './points.reducer';

import styles from './points-styles';

function PointsDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deletePoints(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Points');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Points {entity.id}?</Text>
          </View>
          <View style={[styles.flexRow]}>
            <TouchableHighlight
              style={[styles.openButton, styles.cancelButton]}
              onPress={() => {
                setVisible(false);
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.openButton, styles.submitButton]} onPress={deleteEntity} testID="deleteButton">
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const mapStateToProps = (state) => {
  return {
    points: state.points.points,
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

export default connect(mapStateToProps, mapDispatchToProps)(PointsDeleteModal);
