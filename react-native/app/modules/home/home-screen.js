import React from 'react';
import { ScrollView, Text, Image, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import LearnMoreLinks from './learn-more-links.component.js';
import { Images } from '../../shared/themes';
import styles from './home-screen.styles';

function HomeScreen(props) {
  const { account } = props;
  return (
    <View style={[styles.container, styles.mainContainer]} testID="homeScreen">
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.centered}>
          <Image source={Images.logoJhipster} style={styles.logo} />
          <Text style={styles.welcomeText}>Flickr2</Text>
          <Text style={styles.welcomeText}>Welcome to your JHipster React Native app.</Text>
        </View>
        {account && account.login ? (
          <View style={[styles.authContainer, styles.authContainerTrue]} testID="authDisplayTrue">
            <Text style={styles.authText}>
              <Ionicons name="md-checkmark-circle" size={22} color={'white'} /> You are signed in as {account.login}
            </Text>
          </View>
        ) : (
          <View style={[styles.authContainer, styles.authContainerFalse]} testID="authDisplayFalse">
            <Text style={styles.authText}>
              <Ionicons name="md-information-circle" size={22} color={'white'} /> You are not signed in.
            </Text>
          </View>
        )}
        <View style={styles.hairline} />
        {/* <Header /> */}
        {global.HermesInternal == null ? null : (
          <View style={styles.engine}>
            <Text style={styles.footer}>Engine: Hermes</Text>
          </View>
        )}
        <View style={styles.body}>
          {Platform.OS !== 'android' ? null : (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Running on Android</Text>
              <Text style={styles.sectionDescription}>
                Run <Text style={styles.highlight}>adb reverse tcp:8080 tcp:8080</Text> to be able to connect to your JHipster backend
                (Android only).
              </Text>
            </View>
          )}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Make Some Changes</Text>
            <Text style={styles.sectionDescription}>
              Edit <Text style={styles.highlight}>app/modules/home/home-screen.js</Text> to change this screen and then come back to see
              your edits.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Learn More</Text>
          </View>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => ({ account: state.account.account });
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
