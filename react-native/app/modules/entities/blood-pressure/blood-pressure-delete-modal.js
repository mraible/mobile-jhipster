import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import BloodPressureActions from './blood-pressure.reducer';

import styles from './blood-pressure-styles';

function BloodPressureDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteBloodPressure(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('BloodPressure');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete BloodPressure {entity.id}?</Text>
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
    bloodPressure: state.bloodPressures.bloodPressure,
    fetching: state.bloodPressures.fetchingOne,
    deleting: state.bloodPressures.deleting,
    errorDeleting: state.bloodPressures.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBloodPressure: (id) => dispatch(BloodPressureActions.bloodPressureRequest(id)),
    getAllBloodPressures: (options) => dispatch(BloodPressureActions.bloodPressureAllRequest(options)),
    deleteBloodPressure: (id) => dispatch(BloodPressureActions.bloodPressureDeleteRequest(id)),
    resetBloodPressures: () => dispatch(BloodPressureActions.bloodPressureReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BloodPressureDeleteModal);
