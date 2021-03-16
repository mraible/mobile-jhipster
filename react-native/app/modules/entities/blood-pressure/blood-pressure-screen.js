import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import BloodPressureActions from './blood-pressure.reducer';
import styles from './blood-pressure-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function BloodPressureScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { bloodPressure, bloodPressureList, getAllBloodPressures, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('BloodPressure entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchBloodPressures();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [bloodPressure, fetchBloodPressures]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('BloodPressureDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No BloodPressures Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchBloodPressures = React.useCallback(() => {
    getAllBloodPressures({ page: page - 1, sort, size });
  }, [getAllBloodPressures, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchBloodPressures();
  };
  return (
    <View style={styles.container} testID="bloodPressureScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={bloodPressureList}
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
    bloodPressureList: state.bloodPressures.bloodPressureList,
    bloodPressure: state.bloodPressures.bloodPressure,
    fetching: state.bloodPressures.fetchingAll,
    error: state.bloodPressures.errorAll,
    links: state.bloodPressures.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllBloodPressures: (options) => dispatch(BloodPressureActions.bloodPressureAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BloodPressureScreen);
