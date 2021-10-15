import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};
app.initializeApp(config);
const auth = app.auth();
const db = app.database();

function Firebase(auth, db) {
  /* [> Sign In to Admin <] */

  const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);
  const doSignOut = () => auth.signOut();

  /* [> Database Getters <] */

  const getRoot = () => db.ref("/");
  const getCastaways = () => db.ref("/castaways");
  const getCastaway = num => db.ref(`/castaways/${num}`);
  const getTribals = () => db.ref("/tribals");
  const getTribal = tribal => db.ref(`/tribals/${tribal}`);
  const getTeams = () => db.ref("/teams");
  const getTeam = team => db.ref(`/teams/${team}`);
  const getTribes = () => db.ref("/tribes");
  const getState = () => db.ref("/state");
  

  // [> Database  setters  <]

  const setCastaways = updatedCastaways =>
    getCastaways().update(updatedCastaways);
  const setTribal = points => getTribal(points.num - 1).set(points);
  const setTribals = updatedTribals => getTribals().set(updatedTribals)
  const setMerged = isMerged => getState().update({ "/merged/": isMerged });
  const setIdols = updatedIdols =>
    getState().update({ "/hasIdol/": updatedIdols });
  const setTeams = teams => getTeams().update(teams);
  const setTribes = tribes => getTribes().update(tribes);
  return {
    auth: { doSignInWithEmailAndPassword, doSignOut, auth },
    db: {
      get: {
        getRoot,
        getCastaways,
        getCastaway,
        getTribals,
        getTribal,
        getTeams,
        getTeam,
        getTribes,
        getState,
      },
      set: {
        setCastaways,
        setTribal,
        setTribals,
        setMerged,
        setIdols,
        setTeams,
        setTribes
      }
    }
  };
}

export default Firebase(auth, db);
