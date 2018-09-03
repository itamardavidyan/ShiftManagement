import ShiftManagement from './components/shiftManagement.js';
import Login from './components/login.js';

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const sm = new ShiftManagement();
        sm.init(document.querySelector('.container'));
    } else {
        const login = new Login();
        login.init(document.querySelector('.container'));
    }
});