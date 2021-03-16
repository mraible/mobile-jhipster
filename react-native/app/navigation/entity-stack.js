import * as React from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { DrawerButton } from './drawer/drawer-button';
import { navigate, goBackOrIfParamsOrDefault } from './nav-ref';

// import screens
import EntitiesScreen from '../modules/entities/entities-screen';
import PointsScreen from '../modules/entities/points/points-screen';
import PointsDetailScreen from '../modules/entities/points/points-detail-screen';
import PointsEditScreen from '../modules/entities/points/points-edit-screen';
import BloodPressureScreen from '../modules/entities/blood-pressure/blood-pressure-screen';
import BloodPressureDetailScreen from '../modules/entities/blood-pressure/blood-pressure-detail-screen';
import BloodPressureEditScreen from '../modules/entities/blood-pressure/blood-pressure-edit-screen';
import WeightScreen from '../modules/entities/weight/weight-screen';
import WeightDetailScreen from '../modules/entities/weight/weight-detail-screen';
import WeightEditScreen from '../modules/entities/weight/weight-edit-screen';
import PreferencesScreen from '../modules/entities/preferences/preferences-screen';
import PreferencesDetailScreen from '../modules/entities/preferences/preferences-detail-screen';
import PreferencesEditScreen from '../modules/entities/preferences/preferences-edit-screen';
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
    name: 'Points',
    route: 'points',
    component: PointsScreen,
    options: {
      title: 'Points',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('PointsEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'PointsDetail',
    route: 'points/detail',
    component: PointsDetailScreen,
    options: { title: 'View Points', headerLeft: () => <HeaderBackButton onPress={() => navigate('Points')} /> },
  },
  {
    name: 'PointsEdit',
    route: 'points/edit',
    component: PointsEditScreen,
    options: {
      title: 'Edit Points',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('PointsDetail', 'Points')} />,
    },
  },
  {
    name: 'BloodPressure',
    route: 'blood-pressure',
    component: BloodPressureScreen,
    options: {
      title: 'BloodPressures',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('BloodPressureEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'BloodPressureDetail',
    route: 'blood-pressure/detail',
    component: BloodPressureDetailScreen,
    options: { title: 'View BloodPressure', headerLeft: () => <HeaderBackButton onPress={() => navigate('BloodPressure')} /> },
  },
  {
    name: 'BloodPressureEdit',
    route: 'blood-pressure/edit',
    component: BloodPressureEditScreen,
    options: {
      title: 'Edit BloodPressure',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('BloodPressureDetail', 'BloodPressure')} />,
    },
  },
  {
    name: 'Weight',
    route: 'weight',
    component: WeightScreen,
    options: {
      title: 'Weights',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('WeightEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'WeightDetail',
    route: 'weight/detail',
    component: WeightDetailScreen,
    options: { title: 'View Weight', headerLeft: () => <HeaderBackButton onPress={() => navigate('Weight')} /> },
  },
  {
    name: 'WeightEdit',
    route: 'weight/edit',
    component: WeightEditScreen,
    options: {
      title: 'Edit Weight',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('WeightDetail', 'Weight')} />,
    },
  },
  {
    name: 'Preferences',
    route: 'preferences',
    component: PreferencesScreen,
    options: {
      title: 'Preferences',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('PreferencesEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'PreferencesDetail',
    route: 'preferences/detail',
    component: PreferencesDetailScreen,
    options: { title: 'View Preferences', headerLeft: () => <HeaderBackButton onPress={() => navigate('Preferences')} /> },
  },
  {
    name: 'PreferencesEdit',
    route: 'preferences/edit',
    component: PreferencesEditScreen,
    options: {
      title: 'Edit Preferences',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('PreferencesDetail', 'Preferences')} />,
    },
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
