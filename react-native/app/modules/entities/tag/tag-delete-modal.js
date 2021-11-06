import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import TagActions from './tag.reducer';

import styles from './tag-styles';

function TagDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteTag(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Tag');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Tag {entity.id}?</Text>
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
    tag: state.tags.tag,
    fetching: state.tags.fetchingOne,
    deleting: state.tags.deleting,
    errorDeleting: state.tags.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTag: (id) => dispatch(TagActions.tagRequest(id)),
    getAllTags: (options) => dispatch(TagActions.tagAllRequest(options)),
    deleteTag: (id) => dispatch(TagActions.tagDeleteRequest(id)),
    resetTags: () => dispatch(TagActions.tagReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TagDeleteModal);
