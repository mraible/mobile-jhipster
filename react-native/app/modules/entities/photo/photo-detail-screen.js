import React from 'react';
import { ActivityIndicator, ScrollView, Text, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import PhotoActions from './photo.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import PhotoDeleteModal from './photo-delete-modal';
import styles from './photo-styles';

function PhotoDetailScreen(props) {
  const { route, getPhoto, navigation, photo, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = photo?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Photo');
      } else {
        setDeleteModalVisible(false);
        getPhoto(routeEntityId);
      }
    }, [routeEntityId, getPhoto, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Photo.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="photoDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{photo.id}</Text>
      {/* Title Field */}
      <Text style={styles.label}>Title:</Text>
      <Text testID="title">{photo.title}</Text>
      {/* Description Field */}
      <Text style={styles.label}>Description:</Text>
      <Text testID="description">{photo.description}</Text>
      {/* Image Field */}
      <Text style={styles.label}>Image:</Text>
      <Text testID="imageContentType">{photo.imageContentType}</Text>
      <Image testID="image" style={styles.imageBlob} source={{ uri: `data:${photo.imageContentType};base64,${photo.image}` }} />
      {/* Height Field */}
      <Text style={styles.label}>Height:</Text>
      <Text testID="height">{photo.height}</Text>
      {/* Width Field */}
      <Text style={styles.label}>Width:</Text>
      <Text testID="width">{photo.width}</Text>
      {/* Taken Field */}
      <Text style={styles.label}>Taken:</Text>
      <Text testID="taken">{String(photo.taken)}</Text>
      {/* Uploaded Field */}
      <Text style={styles.label}>Uploaded:</Text>
      <Text testID="uploaded">{String(photo.uploaded)}</Text>
      <Text style={styles.label}>Album:</Text>
      <Text testID="album">{String(photo.album ? photo.album.title : '')}</Text>
      <Text style={styles.label}>Tag:</Text>
      {photo.tags &&
        photo.tags.map((entity, index) => (
          <Text key={index} testID={`tags-${index}`}>
            {String(entity.name || '')}
          </Text>
        ))}

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('PhotoEdit', { entityId })}
          accessibilityLabel={'Photo Edit Button'}
          testID="photoEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Photo Delete Button'}
          testID="photoDeleteButton"
        />
        {deleteModalVisible && (
          <PhotoDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={photo}
            testID="photoDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    photo: state.photos.photo,
    error: state.photos.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetailScreen);
