import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import TagActions from './tag.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './tag-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2),
});

function TagEditScreen(props) {
  const { getTag, updateTag, route, tag, fetching, updating, errorUpdating, updateSuccess, navigation, reset } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getTag(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getTag, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(tag));
    }
  }, [tag, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {}, []);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('TagDetail', { entityId: tag?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateTag(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const nameRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="tagEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="name"
              ref={nameRef}
              label="Name"
              placeholder="Enter Name"
              testID="nameInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => formRef.current?.submitForm()}
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
    name: value.name ?? null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    name: value.name ?? null,
  };
  return entity;
};

const mapStateToProps = (state) => {
  return {
    tag: state.tags.tag,
    fetching: state.tags.fetchingOne,
    updating: state.tags.updating,
    updateSuccess: state.tags.updateSuccess,
    errorUpdating: state.tags.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTag: (id) => dispatch(TagActions.tagRequest(id)),
    getAllTags: (options) => dispatch(TagActions.tagAllRequest(options)),
    updateTag: (tag) => dispatch(TagActions.tagUpdateRequest(tag)),
    reset: () => dispatch(TagActions.tagReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TagEditScreen);
