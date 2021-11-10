import * as React from 'react';
import { AppState, Text, useWindowDimensions, View } from 'react-native';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { connect } from 'react-redux';

// import screens
import HomeScreen from '../modules/home/home-screen';
import LoginScreen from '../modules/login/login-screen';
import AccountActions from '../shared/reducers/account.reducer';
import EntityStackScreen, { getEntityRoutes } from './entity-stack';
import StorybookScreen from '../../storybook';
import DrawerContent from './drawer/drawer-content';
import { isReadyRef, navigationRef } from './nav-ref';
import NotFound from './not-found-screen';
import OAuthRedirectScreen from './oauth-redirect-screen';
import { ModalScreen } from './modal-screen';
import { DrawerButton } from './drawer/drawer-button';

export const drawerScreens = [
  {
    name: 'Home',
    component: HomeScreen,
    auth: null,
  },
  {
    name: 'Login',
    route: 'login',
    component: LoginScreen,
    auth: false,
  },
  {
    name: 'EntityStack',
    isStack: true,
    component: EntityStackScreen,
    options: {
      title: 'Entities',
      headerShown: false,
    },
    auth: true,
  },
];
if (__DEV__) {
  drawerScreens.push({
    name: 'Storybook',
    route: 'storybook',
    component: StorybookScreen,
    auth: false,
  });
}
export const getDrawerRoutes = () => {
  const routes = {};
  drawerScreens.forEach((screen) => {
    if (screen.route) {
      routes[screen.name] = screen.route;
    }
  });
  return routes;
};

const linking = {
  prefixes: ['rnapp://', Linking.makeUrl('/')],
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: {
        screens: {
          ...getDrawerRoutes(),
          EntityStack: {
            path: 'entities',
            screens: {
              ...getEntityRoutes(),
            },
          },
        },
      },
      ModalScreen: 'alert',
      OAuthRedirect: 'start',
      NotFound: '*',
    },
  },
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const getScreens = (props) => {
  const isAuthed = props.account !== null;
  return drawerScreens.map((screen, index) => {
    if (screen.auth === null || screen.auth === undefined) {
      return <Drawer.Screen name={screen.name} component={screen.component} options={screen.options} key={index} />;
    } else if (screen.auth === isAuthed) {
      return <Drawer.Screen name={screen.name} component={screen.component} options={screen.options} key={index} />;
    }
    return null;
  });
};

function NavContainer(props) {
  const { loaded, getAccount } = props;
  const lastAppState = 'active';

  React.useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  React.useEffect(() => {
    const handleChange = (nextAppState) => {
      if (lastAppState.match(/inactive|background/) && nextAppState === 'active') {
        getAccount();
      }
    };
    AppState.addEventListener('change', handleChange);
    return () => AppState.removeEventListener('change', handleChange);
  }, [getAccount]);

  useReduxDevToolsExtension(navigationRef);

  const dimensions = useWindowDimensions();
  return !loaded ? (
    <View>
      <Text>Loading...</Text>
    </View>
  ) : (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {() => (
            <Drawer.Navigator
              drawerContent={(p) => <DrawerContent {...p} />}
              initialRouteName={drawerScreens[0].name}
              drawerType={dimensions.width >= 768 ? 'permanent' : 'front'}
              screenOptions={{ headerShown: true, headerLeft: DrawerButton }}>
              {getScreens(props)}
            </Drawer.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="ModalScreen"
          component={ModalScreen}
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 0.5, 0.9, 1],
                  outputRange: [0, 0.25, 0.7, 1],
                }),
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: 'clamp',
                }),
              },
            }),
          }}
        />
        <Stack.Screen name="OAuthRedirect" component={OAuthRedirectScreen} options={{ title: 'Redirecting...' }} />
        <Stack.Screen name="NotFound" component={NotFound} options={{ title: 'Oops!' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    loaded: state.appState.rehydrationComplete,
    account: state.account.account,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAccount: () => dispatch(AccountActions.accountRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavContainer);
