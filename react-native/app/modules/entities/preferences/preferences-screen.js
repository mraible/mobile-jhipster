import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import PreferencesActions from './preferences.reducer';
import styles from './preferences-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function PreferencesScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { preferences, preferencesList, getAllPreferences, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Preferences entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchPreferences();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [preferences, fetchPreferences]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('PreferencesDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Preferences Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchPreferences = React.useCallback(() => {
    getAllPreferences({ page: page - 1, sort, size });
  }, [getAllPreferences, page, sort, size]);

  const handleLoadMore = () => {
    if (preferencesList.length) {
      return;
    }
    setPage(page + 1);
    fetchPreferences();
  };
  return (
    <View style={styles.container} testID="preferencesScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={preferencesList}
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
    preferencesList: state.preferences.preferencesList,
    preferences: state.preferences.preferences,
    fetching: state.preferences.fetchingAll,
    error: state.preferences.errorAll,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllPreferences: (options) => dispatch(PreferencesActions.preferencesAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesScreen);
