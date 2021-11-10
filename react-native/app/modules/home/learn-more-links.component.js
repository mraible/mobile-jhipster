/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// slightly modified version of https://github.com/facebook/react-native/blob/e028ac7af2d5b48860f01055f3bbacf91f6b6956/Libraries/NewAppScreen/components/LearnMoreLinks.js

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import React from 'react';
import { Colors } from '../../shared/themes';

const links = [
  {
    id: 0,
    title: 'OAuth2 Login Config',
    link: 'https://github.com/jhipster/generator-jhipster-react-native/blob/main/docs/oauth2-oidc.md',
    description: 'Configuring Keycloak or Okta for login.',
  },
  {
    id: 1,
    title: 'Project Structure',
    link: 'https://github.com/jhipster/generator-jhipster-react-native/blob/main/docs/project-structure.md',
    description: "Explains this app's project structure.",
  },
  {
    id: 2,
    title: 'The Basics',
    link: 'https://reactnative.dev/docs/tutorial',
    description: 'Explains a Hello World for React Native.',
  },
  {
    id: 3,
    title: 'Style',
    link: 'https://reactnative.dev/docs/style',
    description: 'Covers how to use the prop named style which controls the visuals.',
  },
  {
    id: 4,
    title: 'Layout',
    link: 'https://reactnative.dev/docs/flexbox',
    description: 'React Native uses flexbox for layout, learn how it works.',
  },
  {
    id: 5,
    title: 'Components',
    link: 'https://reactnative.dev/docs/components-and-apis',
    description: 'The full list of components and APIs inside React Native.',
  },
  {
    id: 6,
    title: 'Navigation',
    link: 'https://reactnavigation.org/docs/getting-started',
    description: 'How to handle moving between screens inside your application.',
  },
  {
    id: 7,
    title: 'Storybook',
    link: 'https://github.com/jhipster/generator-jhipster-react-native/blob/main/docs/storybook.md',
    description: 'How to use Storybook with React Native.',
  },
];

const LinkList = () => (
  <View style={styles.container}>
    {links.map(({ id, title, link, description }) => {
      return (
        <React.Fragment key={id}>
          <View style={styles.separator} />
          <TouchableOpacity accessibilityRole={'button'} onPress={() => Linking.openURL(link)} style={styles.linkContainer}>
            <Text style={styles.link}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </TouchableOpacity>
        </React.Fragment>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  linkContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  link: {
    flex: 2,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  description: {
    flex: 3,
    paddingVertical: 5,
    fontWeight: '400',
    fontSize: 18,
    color: Colors.white,
  },
  separator: {
    backgroundColor: Colors.light,
    height: 1,
  },
});

export default LinkList;
