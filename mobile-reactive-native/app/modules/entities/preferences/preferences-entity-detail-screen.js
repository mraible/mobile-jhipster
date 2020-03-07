import React from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { preferenceEntityEditScreen } from '../../../navigation/layouts'

import PreferenceActions from './preferences.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './preferences-entity-detail-screen-style'

class PreferenceEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getPreference(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.getAllPreferences()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Preference?',
      'Are you sure you want to delete the Preference?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deletePreference(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.preference) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <Text>ID: {this.props.preference.id}</Text>
        <Text testID="weeklyGoal">WeeklyGoal: {this.props.preference.weeklyGoal}</Text>
        <Text testID="weightUnits">WeightUnits: {this.props.preference.weightUnits}</Text>
        <RoundedButton text="Edit" onPress={preferenceEntityEditScreen.bind(this, { entityId: this.props.preference.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  return {
    preference: state.preferences.preference,
    deleting: state.preferences.deleting,
    errorDeleting: state.preferences.errorDeleting,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPreference: id => dispatch(PreferenceActions.preferenceRequest(id)),
    getAllPreferences: options => dispatch(PreferenceActions.preferenceAllRequest(options)),
    deletePreference: id => dispatch(PreferenceActions.preferenceDeleteRequest(id)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferenceEntityDetailScreen)
