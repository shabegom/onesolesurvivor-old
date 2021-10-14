const app = require('firebase/app')
require('firebase/auth')
require('firebase/database')

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
  };
  app.initializeApp(config);

  const db = app.database();

export const fbState = db.ref('/state')

const setMerged = mergedValue => {
    if (mergedValue === true) {
        db.ref('/state/').update({ 'merged/': true })
    } else if (mergedValue === false) {
        db.ref('/state/').update({ 'merged/': false })
    }
}

export const getRoot = db.ref('/')
export const getCastaways = db.ref('/castaways')
export const getTribals = db.ref('/tribals')
export const getTeams = db.ref('/teams')
export const getState = db.ref('/state')


export const setTribal = points => {
    db.ref('/tribals').once('value', snapshot => {
        let currentData = snapshot.val()
        currentData.map((tribal, i) => {
            if (points.value === tribal.value) {
                db.ref('/tribals/' + i + '/').update(points)
                setMerged(points.merged)
                return 'success'
            }
            return 'failure'
        })
    })
}

export const setTribes = points => {
    if (points.tribes) {
        db.ref('/castaways').once("value", snap => {
            const castaways = snap.val()
            const updatedCastaways = castaways.map(castaway => {
                points.tribes.forEach(tribe => {
                    if (tribe.castaways.includes(castaway.value)) {
                        castaway.tribe = tribe.tribeName
                    }
                })
                return castaways
            })
            db.ref('/castaways').update(updatedCastaways)
        })
        db.ref('/tribes').update(points.tribes)
    }
}

export const setTeams = points => {
    db.ref('/teams').once('value', snapshot => {
        let currentData = snapshot.val()
        points.teams.map(newTeam => {
            return currentData.map((team, i) => {
                if (newTeam.value === team.value) {

                    db.ref('/teams/' + i + '/').update(newTeam)
                    return 'success'
                }
                return 'failure'
            })
        })
    })
}