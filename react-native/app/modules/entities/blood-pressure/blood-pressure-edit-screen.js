import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import BloodPressureActions from './blood-pressure.reducer';
import UserActions from '../../../shared/reducers/user.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './blood-pressure-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  timestamp: Yup.date().required(),
  systolic: Yup.number().required(),
  diastolic: Yup.number().required(),
});

function BloodPressureEditScreen(props) {
  const {
    getBloodPressure,
    updateBloodPressure,
    route,
    bloodPressure,
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
      getBloodPressure(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getBloodPressure, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(bloodPressure));
    }
  }, [bloodPressure, fetching, isNewEntity]);

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
        isNewEntity ? navigation.replace('BloodPressureDetail', { entityId: bloodPressure?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateBloodPressure(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const timestampRef = createRef();
  const systolicRef = createRef();
  const diastolicRef = createRef();
  const userRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="bloodPressureEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="timestamp"
              ref={timestampRef}
              label="Timestamp"
              placeholder="Enter Timestamp"
              testID="timestampInput"
              inputType="datetime"
              onSubmitEditing={() => systolicRef.current?.focus()}
            />
            <FormField
              name="systolic"
              ref={systolicRef}
              label="Systolic"
              placeholder="Enter Systolic"
              testID="systolicInput"
              inputType="number"
              onSubmitEditing={() => diastolicRef.current?.focus()}
            />
            <FormField
              name="diastolic"
              ref={diastolicRef}
              label="Diastolic"
              placeholder="Enter Diastolic"
              testID="diastolicInput"
              inputType="number"
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
    timestamp: value.timestamp ?? null,
    systolic: value.systolic ?? null,
    diastolic: value.diastolic ?? null,
    user: value.user && value.user.id ? value.user.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    timestamp: value.timestamp ?? null,
    systolic: value.systolic ?? null,
    diastolic: value.diastolic ?? null,
  };
  entity.user = value.user ? { id: value.user } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    userList: state.users.userList ?? [],
    bloodPressure: state.bloodPressures.bloodPressure,
    fetching: state.bloodPressures.fetchingOne,
    updating: state.bloodPressures.updating,
    updateSuccess: state.bloodPressures.updateSuccess,
    errorUpdating: state.bloodPressures.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUsers: (options) => dispatch(UserActions.userAllRequest(options)),
    getBloodPressure: (id) => dispatch(BloodPressureActions.bloodPressureRequest(id)),
    getAllBloodPressures: (options) => dispatch(BloodPressureActions.bloodPressureAllRequest(options)),
    updateBloodPressure: (bloodPressure) => dispatch(BloodPressureActions.bloodPressureUpdateRequest(bloodPressure)),
    reset: () => dispatch(BloodPressureActions.bloodPressureReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BloodPressureEditScreen);
