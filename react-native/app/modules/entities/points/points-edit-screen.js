import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import PointsActions from './points.reducer';
import UserActions from '../../../shared/reducers/user.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './points-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  date: Yup.date().required(),
  notes: Yup.string().max(140),
});

function PointsEditScreen(props) {
  const {
    getPoints,
    updatePoints,
    route,
    points,
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
      getPoints(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getPoints, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(points));
    }
  }, [points, fetching, isNewEntity]);

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
        isNewEntity ? navigation.replace('PointsDetail', { entityId: points?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updatePoints(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const dateRef = createRef();
  const exerciseRef = createRef();
  const mealsRef = createRef();
  const alcoholRef = createRef();
  const notesRef = createRef();
  const userRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="pointsEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="date"
              ref={dateRef}
              label="Date"
              placeholder="Enter Date"
              testID="dateInput"
              inputType="date"
              onSubmitEditing={() => exerciseRef.current?.focus()}
            />
            <FormField
              name="exercise"
              ref={exerciseRef}
              label="Exercise"
              placeholder="Enter Exercise"
              testID="exerciseInput"
              inputType="number"
              onSubmitEditing={() => mealsRef.current?.focus()}
            />
            <FormField
              name="meals"
              ref={mealsRef}
              label="Meals"
              placeholder="Enter Meals"
              testID="mealsInput"
              inputType="number"
              onSubmitEditing={() => alcoholRef.current?.focus()}
            />
            <FormField
              name="alcohol"
              ref={alcoholRef}
              label="Alcohol"
              placeholder="Enter Alcohol"
              testID="alcoholInput"
              inputType="number"
              onSubmitEditing={() => notesRef.current?.focus()}
            />
            <FormField
              name="notes"
              ref={notesRef}
              label="Notes"
              placeholder="Enter Notes"
              testID="notesInput"
              inputType="text"
              autoCapitalize="none"
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
    date: value.date ?? null,
    exercise: value.exercise ?? null,
    meals: value.meals ?? null,
    alcohol: value.alcohol ?? null,
    notes: value.notes ?? null,
    user: value.user && value.user.id ? value.user.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    date: value.date ?? null,
    exercise: value.exercise ?? null,
    meals: value.meals ?? null,
    alcohol: value.alcohol ?? null,
    notes: value.notes ?? null,
  };
  entity.user = value.user ? { id: value.user } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    userList: state.users.userList ?? [],
    points: state.points.points,
    fetching: state.points.fetchingOne,
    updating: state.points.updating,
    updateSuccess: state.points.updateSuccess,
    errorUpdating: state.points.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUsers: (options) => dispatch(UserActions.userAllRequest(options)),
    getPoints: (id) => dispatch(PointsActions.pointsRequest(id)),
    getAllPoints: (options) => dispatch(PointsActions.pointsAllRequest(options)),
    updatePoints: (points) => dispatch(PointsActions.pointsUpdateRequest(points)),
    reset: () => dispatch(PointsActions.pointsReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PointsEditScreen);
