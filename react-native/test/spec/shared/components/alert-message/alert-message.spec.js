import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { backgroundColor: 'red' },
});

import AlertMessage from '../../../../../app/shared/components/alert-message/alert-message';

test('AlertMessage component renders correctly if show is true', () => {
  const tree = renderer.create(<AlertMessage title="howdy" />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('AlertMessage component does not render if show is false', () => {
  const tree = renderer.create(<AlertMessage title="howdy" show={false} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('AlertMessage component renders correctly if backgroundColor prop is set', () => {
  const tree = renderer.create(<AlertMessage title="howdy" style={styles.container} />).toJSON();
  expect(tree).toMatchSnapshot();
});
