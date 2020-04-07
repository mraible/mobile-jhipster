# Mobile Development with Ionic, React Native, and JHipster

This set of apps was developed using [this demo script](https://github.com/mraible/mobile-jhipster/blob/master/demo.adoc). You can follow the steps to create your own versions, or just run the applications here.

A presentation describing mobile development with JHipster is available [on Speaker Deck](https://speakerdeck.com/mraible/mobile-development-with-ionic-react-native-and-jhipster-acgnj-java-users-group-2019).

**Prerequisites:** [Java 8+](http://adoptopenjdk.com) and [Node.js](https://maven.apache.org). For React Native, you'll also need to install [CocoaPods](https://cocoapods.org/).

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

Clone this application to your local hard drive using Git.

```
git clone https://github.com/mraible/mobile-jhipster.git
```

To run the JHipster app, start Keycloak, then use Gradle to start it.

```
cd mobile-jhipster/backend
docker-compose -f src/main/docker/keycloak.yml up -d
./gradlew
```

### React Native

To run the React Native app, install its dependencies:

```
cd react-native
npm i
```

You can run it on iOS using `npm run ios` or on Android with `npm run android`.

You will need to run the following commands so your Android Virtual Device can talk to JHipster and Keycloak.

```
adb reverse tcp:8080 tcp:8080
adb reverse tcp:9080 tcp:9080
```

### Ionic

To run the Ionic app, install its dependencies:

```
cd ionic
npm i
```

You can run it as a web app using `ionic serve`. To run it on iOS:

```
ionic cordova prepare ios
open platforms/ios/MyApp.xcworkspace
```

To run it on Android:

```
ionic cordova prepare android
studio platforms/android
```

### Use Okta for Identity

> [Okta](https://developer.okta.com/) has Authentication and User Management APIs that reduce development time with instant-on, scalable user infrastructure. Okta's intuitive API and expert support make it easy for developers to authenticate, manage, and secure users and roles in any application.

You will need to create an OIDC Application in Okta to get your settings to log in. 

1. Log in to your developer account on [developer.okta.com](https://developer.okta.com) or create a new one.
2. Navigate to **Applications** and click on **Add Application**.
3. Select **Web** and click **Next**. 
4. Give the application a name (e.g., `JHipster is Awesome`) and add `http://localhost:8080/login/oauth2/code/okta` as a Login redirect URIs.
5. Click **Done**, then edit the project, add `http://localhost:8080` as a logout redirect URI, and click **Save**.

JHipster is configured by default to work with two types of users: administrators and users. Keycloak is configured with users and groups automatically, but you need to do some one-time configuration for your Okta organization.

Create a `ROLE_ADMIN` and `ROLE_USER` group (**Users** > **Groups** > **Add Group**) and add users to them. You can use the account you signed up with, or create a new user (**Users** > **Add Person**). Navigate to **API** > **Authorization Servers**, and click on the the `default` server. Click the **Claims** tab and **Add Claim**. Name it `groups`, and include it in the ID Token. Set the value type to `Groups` and set the filter to be a Regex of `.*`. Click **Create**.

Create `~/.okta.env` and specify the settings for your app; run `source ~/.okta.env` restart your app.

```
export SPRING_SECURITY_OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER_URI=https://{yourOktaDomain}/oauth2/default
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_ID=$clientId
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_SECRET=$clientSecret
```

For the React Native and Ionic apps with Okta, you'll need to create a Native app with PKCE, add the following URLs as login redirect URIs:

* `healthpoints://authorize`
* `http://localhost:8100/implicit/callback`
* `dev.localhost.ionic:/callback`

Add logout URIs too:

* `http://localhost:8100/implicit/logout`
* `dev.localhost.ionic:/logout`

Add `groups`, `given_name`, and `family_name` as claims to the **access token**.

* For `given_name`, use expression `user.firstName`
* For `family_name`, use expression `user.lastName`

Modify `mobile-react-native/app/modules/login/login.sagas.js` to use the generated client ID. 

```js
const config = {
  issuer,
  clientId: `{yourClientId}'
  scopes: ['openid', 'profile', 'email', 'address', 'phone', 'offline_access'],
  redirectUrl: `${AppConfig.appUrlScheme}://authorize`
}
```

For Ionic, update `mobile-ionic/src/app/auth/auth.service.ts`.

```ts
this.authConfig = {
  identity_client: `{yourClientId}`,
  identity_server: data.issuer,
  redirect_url: redirectUri,
  end_session_redirect_url: logoutRedirectUri,
  scopes,
  usePkce: true
};
```

Restart your mobile apps and log in with Okta!

## Links

This example uses the following open source libraries:

* [JHipster](https://www.jhipster.tech)
* [Ignite JHipster](https://github.com/ruddell/ignite-jhipster)
* [Ionic for JHipster](https://github.com/oktadeveloper/generator-jhipster-ionic)

## Help

Please post any questions on [Stack Overflow](https://www.stackoverflow.com) with a "jhipster" tag.

## License

Apache 2.0, see [LICENSE](LICENSE).
