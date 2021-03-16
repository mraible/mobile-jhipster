# Mobile Development with Ionic, React Native, and JHipster

This set of apps was developed using [this demo script](https://github.com/mraible/mobile-jhipster/blob/master/demo.adoc). You can follow the steps to create your own versions, or just run the applications here.

See [Mobile Development with Ionic, React Native, and JHipster](https://developer.okta.com/blog/2020/04/27/mobile-development-ionic-react-native-jhipster) to see a demo of these apps being created.

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
npm start
```

To run on emulators, you'll need an [Expo](https://expo.io/) account. Then, add `https://auth.expo.io/@<your-username>/HealthPoints` as a Login redirect URI in Keycloak.

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

> [Okta](https://developer.okta.com/) has Authentication and User Management APIs that reduce development time with instant-on, scalable user infrastructure. Okta's intuitive API and expert support make it easy for developers to authenticate, manage, and secure users and roles in any application.

See the [demo instructions for Okta](demo.adoc#use-okta-for-identity) for how to configure this.

## Links

This example uses the following open source libraries:

* [JHipster](https://www.jhipster.tech)
* [JHipster React Native](https://github.com/ruddell/generator-jhipster-react-native)
* [Ionic for JHipster](https://github.com/oktadeveloper/generator-jhipster-ionic)

## Help

Please post any questions on [Stack Overflow](https://www.stackoverflow.com) with a "jhipster" tag.

## License

Apache 2.0, see [LICENSE](LICENSE).
