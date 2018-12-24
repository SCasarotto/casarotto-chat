# Casarotto Chat

Accessibility focused chat app for my sister.

## Background

The goal of this project was to make a chat app for my sister who lives with disabilities. Over the last year she has started to love having Siri dictate emails to me. While this is great, there is also the chance that she sends emails to other random people. I don't know if she knows how to send these emails to my other siblings (5 siblings... big family). So my goal was to create a simple chat app for my family (only), with accessibility in mind. So here was my criteria for my Christmas gift to my sister.

## Requirements

1. Realtime Chat App
2. Dictation
3. Text to speech (she has a hard time reading)
4. Take/Upload and send photos (she loves taking pictures of our family cat)
5. Record/Playback and send audio (This might become the most efficient way for her in the future.)
6. Push Notification (So my family members don't forget to reply)
7. Cross Platform (Dad has an Android 🙄)

## Resources Used

-   Realtime Database, File Storage, Auth - [Firebase](https://firebase.google.com/)
-   Chat UI - [React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)
-   Dictation - ✅ Provided by Siri in the native iOS keyboard
-   Text to speech - [Expo](https://docs.expo.io/versions/latest/sdk/speech)
-   Take/Upload and send photos - [Expo](https://docs.expo.io/versions/latest/sdk/imagepicker)
-   Record/Playback and send audio [Expo](https://docs.expo.io/versions/latest/sdk/audio)
-   Push Notification [Expo](https://docs.expo.io/versions/latest/guides/push-notifications)
-   Cross Platform - ✅ React Native / Expo

## Installation

1. `git clone`
2. `yarn install` (or `npm install` if you are one of those... 😉)
3. Setup `src/config/settings.js` file by adding in firebase configs. See `src/config/settingsExample.js`
4. Have [expo-cli](https://docs.expo.io/versions/latest/) installed and `yarn start` or `expo start`

## License

[MIT](https://choosealicense.com/licenses/mit/)
