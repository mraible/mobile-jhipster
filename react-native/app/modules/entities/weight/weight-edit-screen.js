import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import WeightActions from './weight.reducer';
import UserActions from '../../../shared/reducers/user.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './weight-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  timestamp: Yup.date().required(),
  weight: Yup.number().required(),
});

function WeightEditScreen(props) {
  const {
    getWeight,
    updateWeight,
    route,
    weight,
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
      getWeight(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getWeight, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(weight));
    }
  }, [weight, fetching, isNewEntity]);

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
        isNewEntity ? navigation.replace('WeightDetail', { entityId: weight?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateWeight(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const timestampRef = createRef();
  const weightRef = createRef();
  const userRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="weightEditScrollView"
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
              onSubmitEditing={() => weightRef.current?.focus()}
            />
            <FormField name="weight" ref={weightRef} label="Weight" placeholder="Enter Weight" testID="weightInput" inputType="number" />
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
    weight: value.weight ?? null,
    user: value.user && value.user.id ? value.user.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    timestamp: value.timestamp ?? null,
    weight: value.weight ?? null,
  };
  entity.user = value.user ? { id: value.user } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    userList: state.users.userList ?? [],
    weight: state.weights.weight,
    fetching: state.weights.fetchingOne,
    updating: state.weights.updating,
    updateSuccess: state.weights.updateSuccess,
    errorUpdating: state.weights.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUsers: (options) => dispatch(UserActions.userAllRequest(options)),
    getWeight: (id) => dispatch(WeightActions.weightRequest(id)),
    getAllWeights: (options) => dispatch(WeightActions.weightAllRequest(options)),
    updateWeight: (weight) => dispatch(WeightActions.weightUpdateRequest(weight)),
    reset: () => dispatch(WeightActions.weightReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WeightEditScreen);
