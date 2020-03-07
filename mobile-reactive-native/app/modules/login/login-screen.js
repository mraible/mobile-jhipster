import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Image, View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'

import styles from './login-screen.styles'
import { Images, Metrics } from '../../shared/themes'
import LoginActions from './login.reducer'

class LoginScreen extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    fetching: PropTypes.bool,
    attemptLogin: PropTypes.func,
  }

  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      username: '',
      password: '',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.fetching) {
      if (prevProps.fetching && this.props.error) {
        Alert.alert('Error', this.props.error, [{ text: 'OK' }])
      }
      if (!prevProps.account && this.props.account) {
        Navigation.dismissModal(this.props.componentId)
      }
    }
  }

  handlePressLogin = () => {
    const { username, password } = this.state
    // attempt a login - a saga is listening to pick it up from here.
    this.props.attemptLogin(username, password)
  }
  handlePressCancel = () => {
    this.props.logout()
    Navigation.dismissModal(this.props.componentId)
  }

  handleChangeUsername = text => {
    this.setState({ username: text })
  }

  handleChangePassword = text => {
    this.setState({ password: text })
  }

  render() {
    const { username, password } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? styles.textInput : styles.textInputReadonly
    return (
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={[styles.container, { height: this.state.visibleHeight }]}
        keyboardShouldPersistTaps="always">
        <Image source={Images.logoLogin} style={[styles.topLogo, this.state.topLogo]} />
        <View style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Username</Text>
            <TextInput
              ref={c => {
                this.usernameInput = c
              }}
              testID="loginScreenUsername"
              style={textInputStyle}
              value={username}
              editable={editable}
              keyboardType="default"
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={this.handleChangeUsername}
              underlineColorAndroid="transparent"
              onSubmitEditing={() => this.passwordInput.focus()}
              placeholder="Username"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Password</Text>
            <TextInput
              ref={c => {
                this.passwordInput = c
              }}
              testID="loginScreenPassword"
              style={textInputStyle}
              value={password}
              editable={editable}
              keyboardType="default"
              returnKeyType="go"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              onChangeText={this.handleChangePassword}
              underlineColorAndroid="transparent"
              onSubmitEditing={this.handlePressLogin}
              placeholder="Password"
            />
          </View>

          <View style={[styles.loginRow]}>
            <TouchableOpacity testID="loginScreenLoginButton" style={styles.loginButtonWrapper} onPress={this.handlePressLogin}>
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>Sign In</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity testID="loginScreenCancelButton" style={styles.loginButtonWrapper} onPress={this.handlePressCancel}>
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: state.account.account,
    fetching: state.login.fetching,
    error: state.login.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password)),
    logout: () => dispatch(LoginActions.logoutRequest()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen)
