import React from 'react'
import { Alert, ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import PreferenceActions from './preferences.reducer'
import UserActions from '../../../shared/reducers/user.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { preferenceEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './preferences-entity-edit-screen-style'

let Form = t.form.Form
const Units = t.enums({
  KG: 'KG',
  LB: 'LB',
})

class PreferenceEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        weeklyGoal: t.Number,
        weightUnits: Units,
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
          weeklyGoal: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('weightUnits').refs.input.focus(),
            testID: 'weeklyGoalInput',
          },
          weightUnits: {
            testID: 'weightUnitsInput',
          },
        },
      },
      preference: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getPreference(props.data.entityId)
    }
    this.props.getAllUsers()

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.preference !== prevState.preference && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.preference), preference: nextProps.preference }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        this.props.getAllPreferences({ page: 0, sort: 'id,asc', size: 20 })
        const entityId = this.props.preference.id
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: preferenceEntityDetailScreen.bind(this, { entityId }),
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
    const preference = this.form.getValue()
    if (preference) {
      // if validation fails, value will be null
      this.props.updatePreference(formValueToEntity(preference))
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
    weeklyGoal: value.weeklyGoal || null,
    weightUnits: value.weightUnits || null,
    userId: value.user && value.user.id ? value.user.id : null,
  }
}
const formValueToEntity = value => {
  const entity = {
    id: value.id || null,
    weeklyGoal: value.weeklyGoal || null,
    weightUnits: value.weightUnits || null,
  }
  if (value.userId) {
    entity.user = { id: value.userId }
  }
  return entity
}

const mapStateToProps = state => {
  return {
    users: state.users.users || [],
    preference: state.preferences.preference,
    fetching: state.preferences.fetchingOne,
    updating: state.preferences.updating,
    error: state.preferences.errorUpdating,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllUsers: options => dispatch(UserActions.userAllRequest(options)),
    getPreference: id => dispatch(PreferenceActions.preferenceRequest(id)),
    getAllPreferences: options => dispatch(PreferenceActions.preferenceAllRequest(options)),
    updatePreference: preference => dispatch(PreferenceActions.preferenceUpdateRequest(preference)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferenceEntityEditScreen)
