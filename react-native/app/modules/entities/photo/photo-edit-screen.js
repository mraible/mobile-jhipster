import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import PhotoActions from './photo.reducer';
import AlbumActions from '../album/album.reducer';
import TagActions from '../tag/tag.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './photo-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  image: Yup.string().required(),
});

function PhotoEditScreen(props) {
  const {
    getPhoto,
    updatePhoto,
    route,
    photo,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllAlbums,
    albumList,
    getAllTags,
    tagList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getPhoto(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getPhoto, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(photo));
    }
  }, [photo, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllAlbums();
    getAllTags();
  }, [getAllAlbums, getAllTags]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('PhotoDetail', { entityId: photo?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updatePhoto(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const titleRef = createRef();
  const descriptionRef = createRef();
  const imageRef = createRef();
  const imageContentTypeRef = createRef();
  const heightRef = createRef();
  const widthRef = createRef();
  const takenRef = createRef();
  const uploadedRef = createRef();
  const albumRef = createRef();
  const tagsRef = createRef();

  const metadata = (
    <div>
      <FormField
        name="height"
        ref={heightRef}
        label="Height"
        placeholder="Enter Height"
        testID="heightInput"
        inputType="number"
        onSubmitEditing={() => widthRef.current?.focus()}
      />
      <FormField
        name="width"
        ref={widthRef}
        label="Width"
        placeholder="Enter Width"
        testID="widthInput"
        inputType="number"
        onSubmitEditing={() => takenRef.current?.focus()}
      />
      <FormField
        name="taken"
        ref={takenRef}
        label="Taken"
        placeholder="Enter Taken"
        testID="takenInput"
        inputType="datetime"
        onSubmitEditing={() => uploadedRef.current?.focus()}
      />
      <FormField
        name="uploaded"
        ref={uploadedRef}
        label="Uploaded"
        placeholder="Enter Uploaded"
        testID="uploadedInput"
        inputType="datetime"
      />
    </div>
  )
  const metadataRows = isNewEntity ? '' : metadata;

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="photoEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="title"
              ref={titleRef}
              label="Title"
              placeholder="Enter Title"
              testID="titleInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => descriptionRef.current?.focus()}
            />
            <FormField
              name="description"
              ref={descriptionRef}
              label="Description"
              placeholder="Enter Description"
              testID="descriptionInput"
              onSubmitEditing={() => imageRef.current?.focus()}
            />
            <FormField
              name="image"
              ref={imageRef}
              label="Image"
              placeholder="Enter Image"
              testID="imageInput"
              onSubmitEditing={() => imageContentTypeRef.current?.focus()}
            />
            <FormField
              name="imageContentType"
              ref={imageContentTypeRef}
              label="Image Content Type"
              placeholder="Enter Image Content Type"
              testID="imageContentTypeInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => heightRef.current?.focus()}
            />
            {metadataRows}
            <FormField
              name="album"
              inputType="select-one"
              ref={albumRef}
              listItems={albumList}
              listItemLabelField="title"
              label="Album"
              placeholder="Select Album"
              testID="albumSelectInput"
            />
            <FormField
              name="tags"
              inputType="select-multiple"
              ref={tagsRef}
              listItems={tagList}
              listItemLabelField="name"
              label="Tag"
              placeholder="Select Tag"
              testID="tagSelectInput"
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
    title: value.title ?? null,
    description: value.description ?? null,
    image: value.image ?? null,
    imageContentType: value.imageContentType ?? null,
    height: value.height ?? null,
    width: value.width ?? null,
    taken: value.taken ?? null,
    uploaded: value.uploaded ?? null,
    album: value.album && value.album.id ? value.album.id : null,
    tags: value.tags?.map((i) => i.id),
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    title: value.title ?? null,
    description: value.description ?? null,
    image: value.image ?? null,
    imageContentType: value.imageContentType ?? null,
    height: value.height ?? null,
    width: value.width ?? null,
    taken: value.taken ?? null,
    uploaded: value.uploaded ?? null,
  };
  entity.album = value.album ? { id: value.album } : null;
  entity.tags = value.tags.map((id) => ({ id }));
  return entity;
};

const mapStateToProps = (state) => {
  return {
    albumList: state.albums.albumList ?? [],
    tagList: state.tags.tagList ?? [],
    photo: state.photos.photo,
    fetching: state.photos.fetchingOne,
    updating: state.photos.updating,
    updateSuccess: state.photos.updateSuccess,
    errorUpdating: state.photos.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllAlbums: (options) => dispatch(AlbumActions.albumAllRequest(options)),
    getAllTags: (options) => dispatch(TagActions.tagAllRequest(options)),
    getPhoto: (id) => dispatch(PhotoActions.photoRequest(id)),
    getAllPhotos: (options) => dispatch(PhotoActions.photoAllRequest(options)),
    updatePhoto: (photo) => dispatch(PhotoActions.photoUpdateRequest(photo)),
    reset: () => dispatch(PhotoActions.photoReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoEditScreen);
