import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import TagActions from './tag.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import TagDeleteModal from './tag-delete-modal';
import styles from './tag-styles';

function TagDetailScreen(props) {
  const { route, getTag, navigation, tag, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = tag?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Tag');
      } else {
        setDeleteModalVisible(false);
        getTag(routeEntityId);
      }
    }, [routeEntityId, getTag, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Tag.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="tagDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{tag.id}</Text>
      {/* Name Field */}
      <Text style={styles.label}>Name:</Text>
      <Text testID="name">{tag.name}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('TagEdit', { entityId })}
          accessibilityLabel={'Tag Edit Button'}
          testID="tagEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Tag Delete Button'}
          testID="tagDeleteButton"
        />
        {deleteModalVisible && (
          <TagDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={tag}
            testID="tagDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    tag: state.tags.tag,
    error: state.tags.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(TagDetailScreen);
