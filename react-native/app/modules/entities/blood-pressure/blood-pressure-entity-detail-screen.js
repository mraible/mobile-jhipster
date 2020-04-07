import React from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { bloodPressureEntityEditScreen } from '../../../navigation/layouts'

import BloodPressureActions from './blood-pressure.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './blood-pressure-entity-detail-screen-style'

class BloodPressureEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getBloodPressure(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.getAllBloodPressures()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete BloodPressure?',
      'Are you sure you want to delete the BloodPressure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteBloodPressure(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.bloodPressure) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <Text>ID: {this.props.bloodPressure.id}</Text>
        <Text testID="timestamp">Timestamp: {String(this.props.bloodPressure.timestamp)}</Text>
        <Text testID="systolic">Systolic: {this.props.bloodPressure.systolic}</Text>
        <Text testID="diastolic">Diastolic: {this.props.bloodPressure.diastolic}</Text>
        <RoundedButton text="Edit" onPress={bloodPressureEntityEditScreen.bind(this, { entityId: this.props.bloodPressure.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  return {
    bloodPressure: state.bloodPressures.bloodPressure,
    deleting: state.bloodPressures.deleting,
    errorDeleting: state.bloodPressures.errorDeleting,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getBloodPressure: id => dispatch(BloodPressureActions.bloodPressureRequest(id)),
    getAllBloodPressures: options => dispatch(BloodPressureActions.bloodPressureAllRequest(options)),
    deleteBloodPressure: id => dispatch(BloodPressureActions.bloodPressureDeleteRequest(id)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BloodPressureEntityDetailScreen)
