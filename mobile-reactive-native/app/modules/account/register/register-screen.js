import React from 'react'
import { Alert, ScrollView, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Navigation } from 'react-native-navigation'
import t from 'tcomb-form-native'

import RegisterActions from '../register/register.reducer'
// Styles
import styles from './register-screen.styles'

let Form = t.form.Form

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      accountModel: t.struct({
        login: t.String,
        password: t.String,
        confirmPassword: t.String,
        email: t.String,
        langKey: t.String,
      }),
      accountValue: { login: null, password: null, confirmPassword: null, email: null, langKey: 'en' },
      options: {
        fields: {
          login: {
            label: 'Username',
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('password').refs.input.focus(),
          },
          password: {
            secureTextEntry: true,
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('confirmPassword').refs.input.focus(),
          },
          confirmPassword: {
            secureTextEntry: true,
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('email').refs.input.focus(),
          },
          email: {
            returnKeyType: 'done',
            onSubmitEditing: () => this.submitUpdate(),
          },
          langKey: {
            hidden: true,
          },
        },
      },
    }
    this.submitUpdate = this.submitUpdate.bind(this)
    this.accountChange = this.accountChange.bind(this)
  }

  submitUpdate() {
    // call getValue() to get the values of the form
    const value = this.form.getValue()
    if (value) {
      // if validation fails, value will be null
      if (value.password !== value.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match', [{ text: 'OK' }])
        return
      }
      this.props.register(value)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetching && !this.props.fetching) {
      if (this.props.error) {
        Alert.alert('Error', this.props.error, [{ text: 'OK' }])
      } else {
        Navigation.popToRoot(this.props.componentId)
        Alert.alert('Registration Successful', 'Please check your email', [{ text: 'OK' }])
      }
    }
  }

  accountChange(newValue) {
    this.setState({
      accountValue: newValue,
    })
  }

  render() {
    return (
      <KeyboardAwareScrollView>
        <ScrollView style={styles.container}>
          <Form
            ref={c => {
              this.form = c
            }}
            type={this.state.accountModel}
            options={this.state.options}
            value={this.state.accountValue}
            onChange={this.accountChange}
          />
          <TouchableHighlight style={styles.button} onPress={this.submitUpdate} underlayColor="#99d9f4">
            <Text style={styles.buttonText}>Register</Text>
          </TouchableHighlight>
        </ScrollView>
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.register.fetching,
    error: state.register.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    register: account => dispatch(RegisterActions.registerRequest(account)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterScreen)
