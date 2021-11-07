# Mobile Development with Ionic, React Native, and JHipster

This set of apps was developed using [this demo script](demo.adoc). You can follow the steps to create your own versions, or just run the applications here.

See [Mobile Development with Ionic, React Native, and JHipster](https://developer.okta.com/blog/2020/04/27/mobile-development-ionic-react-native-jhipster) to see a video of these apps being created in 2020.

**Prerequisites:** [Java 11+](http://adoptopenjdk.com) and [Node.js](https://nodejs.org). 

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
./mvnw
```

### React Native

To run the React Native app, install its dependencies:

```
cd react-native
npm i
npm start
```

To run on emulators, you'll need an [Expo](https://expo.io/) account. Then, add `https://auth.expo.io/@<your-username>/Flickr2` as a Login redirect URI in Keycloak.

To run on Android, you'll need to run some commands so your device (or emulator) can communicate with your API and Keycloak.

```shell
adb reverse tcp:8080 tcp:8080
adb reverse tcp:9080 tcp:9080
```

### Ionic

To run the Ionic app, install its dependencies:

```
cd ionic
npm i
```

You can run it as a web app using `ionic serve`. 

To run on iOS:

```
ionic build
ionic capacitor add ios
```

Add your custom scheme to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.getcapacitor.capacitor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>capacitor</string>
      <string>dev.localhost.ionic</string>
    </array>
  </dict>
</array>
```

Open your project in Xcode and configure code signing.

```shell
npx cap open ios
```

Then, run your app from Xcode.

For Android:

```shell
ionic build
ionic capacitor add android
```

Change the custom scheme in `android/app/src/main/res/values/strings.xml` to use `dev.localhost.ionic`:

```xml
<string name="custom_url_scheme">dev.localhost.ionic</string>
```

The [SafariViewController Cordova Plugin](https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller) is installed as part of this project. Capacitor uses AndroidX dependencies, but the SafariViewController plugin uses an older non-AndroidX dependency. Use [jetifier](https://developer.android.com/studio/command-line/jetifier) to [patch usages of old support libraries](https://capacitorjs.com/docs/android/troubleshooting#error-package-android-support-does-not-exist) with the following commands:

```
npm install jetifier
npx jetify
npx cap sync android
```   

Then, open your project in Android Studio and run your app.

```
npx cap open android
```

You'll need to run a couple commands to allow the emulator to communicate with your API and Keycloak.

```
adb reverse tcp:8080 tcp:8080
adb reverse tcp:9080 tcp:9080
```

If you see `java.io.IOException: Cleartext HTTP traffic to localhost not permitted` in your Android Studio console, enable clear text traffic in `android/app/src/main/AndroidManifest.xml`:

```xml
<application
    ...
    android:usesCleartextTraffic="true">
```

See [this Stack Overflow Q&A](https://stackoverflow.com/questions/45940861/android-8-cleartext-http-traffic-not-permitted) for more information.

If that doesn't work, just use Okta (and its HTTPS-by-default feature 😉).

### Use Okta for Identity

Install the [Okta CLI](https://cli.okta.com) and run the following commands:

```shell
cd backend
okta apps register jhipster
# source .okta.env && ./mvnw to start

cd ../react-native
okta apps create
```

Select **Native**, then use the following for Redirect URIs:

```
http://localhost:19006/,https://auth.expo.io/@<your-username>/Flickr2
```

Copy the client ID to `react-native/app/config/app-config.js`.

Create another **Native** app for Ionic with the following redirect URIs:

* login: `http://localhost:8100/callback,dev.localhost.ionic:/callback`
* logout: `http://localhost:8100/logout,dev.localhost.ionic:/logout`

Update `ionic/src/app/auth/auth-config.service.ts` to use the generated client ID.

Restart your mobile apps and sign in with Okta!

## Links

This example uses the following open source libraries:

* [JHipster](https://www.jhipster.tech)
* [JHipster React Native](https://github.com/ruddell/generator-jhipster-react-native)
* [Ionic for JHipster](https://github.com/jhipster/generator-jhipster-ionic)

## Help

Please post any questions on [Stack Overflow](https://www.stackoverflow.com) with a "jhipster" tag.

## License

Apache 2.0, see [LICENSE](LICENSE).
