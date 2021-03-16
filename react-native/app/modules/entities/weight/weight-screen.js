import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import WeightActions from './weight.reducer';
import styles from './weight-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function WeightScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { weight, weightList, getAllWeights, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Weight entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchWeights();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [weight, fetchWeights]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('WeightDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Weights Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchWeights = React.useCallback(() => {
    getAllWeights({ page: page - 1, sort, size });
  }, [getAllWeights, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchWeights();
  };
  return (
    <View style={styles.container} testID="weightScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={weightList}
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
    weightList: state.weights.weightList,
    weight: state.weights.weight,
    fetching: state.weights.fetchingAll,
    error: state.weights.errorAll,
    links: state.weights.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllWeights: (options) => dispatch(WeightActions.weightAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WeightScreen);
