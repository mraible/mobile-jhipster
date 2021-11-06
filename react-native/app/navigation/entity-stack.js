import * as React from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { DrawerButton } from './drawer/drawer-button';
import { navigate, goBackOrIfParamsOrDefault } from './nav-ref';

// import screens
import EntitiesScreen from '../modules/entities/entities-screen';
import AlbumScreen from '../modules/entities/album/album-screen';
import AlbumDetailScreen from '../modules/entities/album/album-detail-screen';
import AlbumEditScreen from '../modules/entities/album/album-edit-screen';
import PhotoScreen from '../modules/entities/photo/photo-screen';
import PhotoDetailScreen from '../modules/entities/photo/photo-detail-screen';
import PhotoEditScreen from '../modules/entities/photo/photo-edit-screen';
import TagScreen from '../modules/entities/tag/tag-screen';
import TagDetailScreen from '../modules/entities/tag/tag-detail-screen';
import TagEditScreen from '../modules/entities/tag/tag-edit-screen';
// jhipster-react-native-navigation-import-needle

export const entityScreens = [
  {
    name: 'Entities',
    route: '',
    component: EntitiesScreen,
    options: {
      headerLeft: DrawerButton,
    },
  },
  {
    name: 'Album',
    route: 'album',
    component: AlbumScreen,
    options: {
      title: 'Albums',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('AlbumEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'AlbumDetail',
    route: 'album/detail',
    component: AlbumDetailScreen,
    options: { title: 'View Album', headerLeft: () => <HeaderBackButton onPress={() => navigate('Album')} /> },
  },
  {
    name: 'AlbumEdit',
    route: 'album/edit',
    component: AlbumEditScreen,
    options: {
      title: 'Edit Album',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('AlbumDetail', 'Album')} />,
    },
  },
  {
    name: 'Photo',
    route: 'photo',
    component: PhotoScreen,
    options: {
      title: 'Photos',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('PhotoEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'PhotoDetail',
    route: 'photo/detail',
    component: PhotoDetailScreen,
    options: { title: 'View Photo', headerLeft: () => <HeaderBackButton onPress={() => navigate('Photo')} /> },
  },
  {
    name: 'PhotoEdit',
    route: 'photo/edit',
    component: PhotoEditScreen,
    options: {
      title: 'Edit Photo',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('PhotoDetail', 'Photo')} />,
    },
  },
  {
    name: 'Tag',
    route: 'tag',
    component: TagScreen,
    options: {
      title: 'Tags',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('TagEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'TagDetail',
    route: 'tag/detail',
    component: TagDetailScreen,
    options: { title: 'View Tag', headerLeft: () => <HeaderBackButton onPress={() => navigate('Tag')} /> },
  },
  {
    name: 'TagEdit',
    route: 'tag/edit',
    component: TagEditScreen,
    options: { title: 'Edit Tag', headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('TagDetail', 'Tag')} /> },
  },
  // jhipster-react-native-navigation-declaration-needle
];

export const getEntityRoutes = () => {
  const routes = {};
  entityScreens.forEach((screen) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const EntityStack = createStackNavigator();

export default function EntityStackScreen() {
  return (
    <EntityStack.Navigator>
      {entityScreens.map((screen, index) => {
        return <EntityStack.Screen name={screen.name} component={screen.component} key={index} options={screen.options} />;
      })}
    </EntityStack.Navigator>
  );
}
