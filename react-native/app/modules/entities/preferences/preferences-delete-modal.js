import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import PreferencesActions from './preferences.reducer';

import styles from './preferences-styles';

function PreferencesDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deletePreferences(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Preferences');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Preferences {entity.id}?</Text>
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
    preferences: state.preferences.preferences,
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

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesDeleteModal);
