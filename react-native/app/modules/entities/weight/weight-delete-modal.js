import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import WeightActions from './weight.reducer';

import styles from './weight-styles';

function WeightDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteWeight(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Weight');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Weight {entity.id}?</Text>
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
    weight: state.weights.weight,
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

export default connect(mapStateToProps, mapDispatchToProps)(WeightDeleteModal);
