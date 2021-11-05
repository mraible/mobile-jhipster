import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import AlbumActions from './album.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import AlbumDeleteModal from './album-delete-modal';
import styles from './album-styles';

function AlbumDetailScreen(props) {
  const { route, getAlbum, navigation, album, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = album?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Album');
      } else {
        setDeleteModalVisible(false);
        getAlbum(routeEntityId);
      }
    }, [routeEntityId, getAlbum, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Album.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="albumDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{album.id}</Text>
      {/* Title Field */}
      <Text style={styles.label}>Title:</Text>
      <Text testID="title">{album.title}</Text>
      {/* Description Field */}
      <Text style={styles.label}>Description:</Text>
      <Text testID="description">{album.description}</Text>
      {/* Created Field */}
      <Text style={styles.label}>Created:</Text>
      <Text testID="created">{String(album.created)}</Text>
      <Text style={styles.label}>User:</Text>
      <Text testID="user">{String(album.user ? album.user.login : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('AlbumEdit', { entityId })}
          accessibilityLabel={'Album Edit Button'}
          testID="albumEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Album Delete Button'}
          testID="albumDeleteButton"
        />
        {deleteModalVisible && (
          <AlbumDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={album}
            testID="albumDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    album: state.albums.album,
    error: state.albums.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(AlbumDetailScreen);
