import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import PointsActions from './points.reducer';
import styles from './points-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function PointsScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { points, pointsList, getAllPoints, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Points entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchPoints();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [points, fetchPoints]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('PointsDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Points Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchPoints = React.useCallback(() => {
    getAllPoints({ page: page - 1, sort, size });
  }, [getAllPoints, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchPoints();
  };
  return (
    <View style={styles.container} testID="pointsScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={pointsList}
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
    pointsList: state.points.pointsList,
    points: state.points.points,
    fetching: state.points.fetchingAll,
    error: state.points.errorAll,
    links: state.points.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllPoints: (options) => dispatch(PointsActions.pointsAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PointsScreen);
