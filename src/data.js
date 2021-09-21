import { getCastaways, getTribals, getTeams } from './async.js'

export let tribals = []

getTribals.once('value', snapshot => {
    let filterSnapshot = snapshot
        .val()
        filterSnapshot = filterSnapshot && filterSnapshot.map(s => {
            let value = s.value
            let label = s.label
            return { value, label }
        })
    tribals = filterSnapshot && [{ value: 'reset', label: 'Choose which tribal' }, ...filterSnapshot]
})

export let castawaysMultiSelect = []
export let castawaysDropDown = []
export let castawayArr = []
export let eliminatedCastawayDropDown = [{value: 'clear', label: 'Choose a loser'}]
export let allCastaways = []

getCastaways.once('value', snapshot => {
    let castaways = snapshot.val()
    castaways && castaways.forEach(castaway => {
        if (castaway.eliminated === 'FALSE') {
            castawayArr.push(castaway)
            allCastaways.push(castaway)
        } else {
            allCastaways.push(castaway)
            eliminatedCastawayDropDown.push({value: castaway.value, label: castaway.label})
    }
    })
    castawaysMultiSelect = allCastaways.map(c => {
        let { label, value } = c
        return { label, value }
    })
    castawaysDropDown = [
        { value: 'clear', label: 'Choose a castaway' },
        ...castawaysMultiSelect
    ]
})

export const idolActions = [
    { value: '', label: 'What did they do?' },
    { value: 'voted-out', label: 'Voted out with idol' },
    { value: 'saved-self', label: 'Saved themself!' },
    {value: 'burned', label: 'Burned the idol'}
]

export let teams = []
getTeams.once('value', snapshot => {
    teams = snapshot.val()
})

export const hasIdols = []
