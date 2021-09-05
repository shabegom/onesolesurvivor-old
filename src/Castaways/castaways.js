import Firebase from "../Firebase";
 

const getFirebaseData = () =>
  Firebase.db.get
    .getCastaways()
    .once("value", snapshot =>
      snapshot.val().map(snap => {})
    );

const castaways = getFirebaseData();

export default castaways;
