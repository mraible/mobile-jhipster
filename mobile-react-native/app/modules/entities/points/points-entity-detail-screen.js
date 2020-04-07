import React from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { pointEntityEditScreen } from '../../../navigation/layouts'
import { jsDateToLocalDate } from '../../../shared/util/date-transforms'

import PointActions from './points.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './points-entity-detail-screen-style'

class PointEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getPoint(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.getAllPoints()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Point?',
      'Are you sure you want to delete the Point?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deletePoint(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.point) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <Text>ID: {this.props.point.id}</Text>
        <Text testID="date">Date: {jsDateToLocalDate(this.props.point.date)}</Text>
        <Text testID="exercise">Exercise: {this.props.point.exercise}</Text>
        <Text testID="meals">Meals: {this.props.point.meals}</Text>
        <Text testID="alcohol">Alcohol: {this.props.point.alcohol}</Text>
        <Text testID="notes">Notes: {this.props.point.notes}</Text>
        <RoundedButton text="Edit" onPress={pointEntityEditScreen.bind(this, { entityId: this.props.point.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  return {
    point: state.points.point,
    deleting: state.points.deleting,
    errorDeleting: state.points.errorDeleting,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPoint: id => dispatch(PointActions.pointRequest(id)),
    getAllPoints: options => dispatch(PointActions.pointAllRequest(options)),
    deletePoint: id => dispatch(PointActions.pointDeleteRequest(id)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PointEntityDetailScreen)
