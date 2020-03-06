import React from 'react'
import { Alert, ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import PointActions from './points.reducer'
import UserActions from '../../../shared/reducers/user.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { jsDateToLocalDate } from '../../../shared/util/date-transforms'
import { pointEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './points-entity-edit-screen-style'

let Form = t.form.Form

class PointEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        date: t.Date,
        exercise: t.maybe(t.Number),
        meals: t.maybe(t.Number),
        alcohol: t.maybe(t.Number),
        notes: t.maybe(t.String),
        userId: this.getUsers(),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          userId: {
            testID: 'userIdInput',
            label: 'User',
          },
          date: {
            mode: 'date',
            config: {
              format: date => jsDateToLocalDate(date),
            },
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('exercise').refs.input.focus(),
            testID: 'dateInput',
          },
          exercise: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('meals').refs.input.focus(),
            testID: 'exerciseInput',
          },
          meals: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('alcohol').refs.input.focus(),
            testID: 'mealsInput',
          },
          alcohol: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('notes').refs.input.focus(),
            testID: 'alcoholInput',
          },
          notes: {
            testID: 'notesInput',
          },
        },
      },
      point: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getPoint(props.data.entityId)
    }
    this.props.getAllUsers()

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.point !== prevState.point && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.point), point: nextProps.point }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        this.props.getAllPoints({ page: 0, sort: 'id,asc', size: 20 })
        const entityId = this.props.point.id
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: pointEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  getUsers = () => {
    const users = {}
    this.props.users.forEach(user => {
      users[user.id] = user.login ? user.login.toString() : user.id.toString()
    })
    return t.maybe(t.enums(users))
  }
  submitForm() {
    // call getValue() to get the values of the form
    const point = this.form.getValue()
    if (point) {
      // if validation fails, value will be null
      this.props.updatePoint(formValueToEntity(point))
    }
  }

  formChange(newValue) {
    this.setState({
      formValue: newValue,
    })
  }

  render() {
    if (this.props.fetching) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    return (
      <KeyboardAwareScrollView>
        <ScrollView style={styles.container} testID="entityScrollView">
          <Form
            ref={c => {
              this.form = c
            }}
            type={this.state.formModel}
            options={this.state.formOptions}
            value={this.state.formValue}
            onChange={this.formChange}
          />
          <TouchableHighlight style={styles.button} onPress={this.submitForm} underlayColor="#99d9f4" testID="submitButton">
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
        </ScrollView>
      </KeyboardAwareScrollView>
    )
  }
}
// convenience methods for customizing the mapping of the entity to/from the form value
const entityToFormValue = value => {
  if (!value) {
    return {}
  }
  return {
    id: value.id || null,
    date: value.date || null,
    exercise: value.exercise || null,
    meals: value.meals || null,
    alcohol: value.alcohol || null,
    notes: value.notes || null,
    userId: value.user && value.user.id ? value.user.id : null,
  }
}
const formValueToEntity = value => {
  const entity = {
    id: value.id || null,
    date: value.date || null,
    exercise: value.exercise || null,
    meals: value.meals || null,
    alcohol: value.alcohol || null,
    notes: value.notes || null,
  }
  if (value.userId) {
    entity.user = { id: value.userId }
  }
  return entity
}

const mapStateToProps = state => {
  return {
    users: state.users.users || [],
    point: state.points.point,
    fetching: state.points.fetchingOne,
    updating: state.points.updating,
    error: state.points.errorUpdating,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllUsers: options => dispatch(UserActions.userAllRequest(options)),
    getPoint: id => dispatch(PointActions.pointRequest(id)),
    getAllPoints: options => dispatch(PointActions.pointAllRequest(options)),
    updatePoint: point => dispatch(PointActions.pointUpdateRequest(point)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PointEntityEditScreen)
