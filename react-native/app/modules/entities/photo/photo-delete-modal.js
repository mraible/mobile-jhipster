import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import PhotoActions from './photo.reducer';

import styles from './photo-styles';

function PhotoDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deletePhoto(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Photo');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Photo {entity.id}?</Text>
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
    photo: state.photos.photo,
    fetching: state.photos.fetchingOne,
    deleting: state.photos.deleting,
    errorDeleting: state.photos.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPhoto: (id) => dispatch(PhotoActions.photoRequest(id)),
    getAllPhotos: (options) => dispatch(PhotoActions.photoAllRequest(options)),
    deletePhoto: (id) => dispatch(PhotoActions.photoDeleteRequest(id)),
    resetPhotos: () => dispatch(PhotoActions.photoReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDeleteModal);
