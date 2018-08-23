const firebase = require('firebase')
require('firebase/firestore')
require('firebase/database')
require('firebase/auth')

firebase.initializeApp({
  apiKey: 'AIzaSyCnnM_9_W86ZKde0TKVszMPAKEcPWf1FnM',
  authDomain: 'scrooble-testing.firebaseapp.com',
  databaseURL: 'https://scrooble-testing.firebaseio.com',
  projectId: 'scrooble-testing',
  storageBucket: 'scrooble-testing.appspot.com',
  messagingSenderId: '767788557887'
})
const db = firebase.firestore()
const settings = {timestampsInSnapshots: true}
db.settings(settings)

export const fdb = firebase.database()

export default db

// USE THIS AS ORIGINAL
// firebase.initializeApp({
//   apiKey: 'AIzaSyAf2IueyuvP6v-LL9y_PsKC1kgZX9SYOi8',
//   authDomain: 'scrooble-710c9.firebaseapp.com',
//   databaseURL: 'https://scrooble-710c9.firebaseio.com',
//   projectId: 'scrooble-710c9',
//   storageBucket: 'scrooble-710c9.appspot.com',
//   messagingSenderId: '314296370194'
// })
// const db = firebase.firestore()
// const settings = {timestampsInSnapshots: true}
// db.settings(settings)

// export const fdb = firebase.database()

// export default db
