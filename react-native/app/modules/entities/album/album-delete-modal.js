import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import AlbumActions from './album.reducer';

import styles from './album-styles';

function AlbumDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteAlbum(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Album');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Album {entity.id}?</Text>
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
    album: state.albums.album,
    fetching: state.albums.fetchingOne,
    deleting: state.albums.deleting,
    errorDeleting: state.albums.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAlbum: (id) => dispatch(AlbumActions.albumRequest(id)),
    getAllAlbums: (options) => dispatch(AlbumActions.albumAllRequest(options)),
    deleteAlbum: (id) => dispatch(AlbumActions.albumDeleteRequest(id)),
    resetAlbums: () => dispatch(AlbumActions.albumReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumDeleteModal);
