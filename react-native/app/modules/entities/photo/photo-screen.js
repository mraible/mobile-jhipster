import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import PhotoActions from './photo.reducer';
import styles from './photo-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function PhotoScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { photo, photoList, getAllPhotos, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Photo entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchPhotos();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [photo, fetchPhotos]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('PhotoDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Photos Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchPhotos = React.useCallback(() => {
    getAllPhotos({ page: page - 1, sort, size });
  }, [getAllPhotos, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchPhotos();
  };
  return (
    <View style={styles.container} testID="photoScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={photoList}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        initialNumToRender={oneScreensWorth}
        onEndReached={handleLoadMore}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
    photoList: state.photos.photoList,
    photo: state.photos.photo,
    fetching: state.photos.fetchingAll,
    error: state.photos.errorAll,
    links: state.photos.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllPhotos: (options) => dispatch(PhotoActions.photoAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoScreen);
