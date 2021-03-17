import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import PreferencesActions from './preferences.reducer';
import UserActions from '../../../shared/reducers/user.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './preferences-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  weeklyGoal: Yup.number().required().min(10).max(21),
  weightUnits: Yup.string().required(),
});

const Units = [
  {
    label: 'KG',
    value: 'KG',
  },
  {
    label: 'LB',
    value: 'LB',
  },
];

function PreferencesEditScreen(props) {
  const {
    getPreferences,
    updatePreferences,
    route,
    preferences,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllUsers,
    userList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getPreferences(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getPreferences, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(preferences));
    }
  }, [preferences, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity ? navigation.replace('PreferencesDetail', { entityId: preferences?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updatePreferences(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const weeklyGoalRef = createRef();
  const weightUnitsRef = createRef();
  const userRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="preferencesEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="weeklyGoal"
              ref={weeklyGoalRef}
              label="Weekly Goal"
              placeholder="Enter Weekly Goal"
              testID="weeklyGoalInput"
              inputType="number"
              onSubmitEditing={() => weightUnitsRef.current?.focus()}
            />
            <FormField
              name="weightUnits"
              ref={weightUnitsRef}
              label="Weight Units"
              placeholder="Enter Weight Units"
              testID="weightUnitsInput"
              inputType="select-one"
              listItems={Units}
            />
            <FormField
              name="user"
              inputType="select-one"
              ref={userRef}
              listItems={userList}
              listItemLabelField="login"
              label="User"
              placeholder="Select User"
              testID="userSelectInput"
            />

            <FormButton title={'Save'} testID={'submitButton'} />
          </Form>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

// convenience methods for customizing the mapping of the entity to/from the form value
const entityToFormValue = (value) => {
  if (!value) {
    return {};
  }
  return {
    id: value.id ?? null,
    weeklyGoal: value.weeklyGoal ?? null,
    weightUnits: value.weightUnits ?? null,
    user: value.user && value.user.id ? value.user.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    weeklyGoal: value.weeklyGoal ?? null,
    weightUnits: value.weightUnits ?? null,
  };
  entity.user = value.user ? { id: value.user } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    userList: state.users.userList ?? [],
    preferences: state.preferences.preferences,
    fetching: state.preferences.fetchingOne,
    updating: state.preferences.updating,
    updateSuccess: state.preferences.updateSuccess,
    errorUpdating: state.preferences.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUsers: (options) => dispatch(UserActions.userAllRequest(options)),
    getPreferences: (id) => dispatch(PreferencesActions.preferencesRequest(id)),
    getAllPreferences: (options) => dispatch(PreferencesActions.preferencesAllRequest(options)),
    updatePreferences: (preferences) => dispatch(PreferencesActions.preferencesUpdateRequest(preferences)),
    reset: () => dispatch(PreferencesActions.preferencesReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesEditScreen);
