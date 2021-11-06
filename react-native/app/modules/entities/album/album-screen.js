import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import AlbumActions from './album.reducer';
import styles from './album-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function AlbumScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { album, albumList, getAllAlbums, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Album entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchAlbums();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [album, fetchAlbums]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('AlbumDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Albums Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchAlbums = React.useCallback(() => {
    getAllAlbums({ page: page - 1, sort, size });
  }, [getAllAlbums, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchAlbums();
  };
  return (
    <View style={styles.container} testID="albumScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={albumList}
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
    albumList: state.albums.albumList,
    album: state.albums.album,
    fetching: state.albums.fetchingAll,
    error: state.albums.errorAll,
    links: state.albums.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllAlbums: (options) => dispatch(AlbumActions.albumAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumScreen);
