const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')

// Set the configuration for your app
// TODO: Replace with your project's config object
const config = {
    databaseURL: process.env.REACT_APP_DATABASE_URL
}

const legacy = firebase.initializeApp(config, 'legacy')

const db = legacy.database()

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
                db.ref('/tribals/' + i + '/').set(points)
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