import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import TagActions from './tag.reducer';
import styles from './tag-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function TagScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { tag, tagList, getAllTags, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Tag entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchTags();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [tag, fetchTags]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('TagDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Tags Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchTags = React.useCallback(() => {
    getAllTags({ page: page - 1, sort, size });
  }, [getAllTags, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchTags();
  };
  return (
    <View style={styles.container} testID="tagScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={tagList}
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
    tagList: state.tags.tagList,
    tag: state.tags.tag,
    fetching: state.tags.fetchingAll,
    error: state.tags.errorAll,
    links: state.tags.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllTags: (options) => dispatch(TagActions.tagAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TagScreen);
