import { getCastaways, getTribals, getTeams } from './async.js'

export let tribals = []

getTribals.once('value', snapshot => {
    let filterSnapshot = snapshot
        .val()
        .filter(s => {
            if (s.complete === true) {
                return false
            } else {
                return true
            }
        })
        .map(s => {
            let value = s.value
            let label = s.label
            return { value, label }
        })
    tribals = [{ value: '', label: 'Choose which tribal' }, ...filterSnapshot]
})

export let castawaysMultiSelect = []
export let castawaysDropDown = []
export let castawayArr = []
export let eliminatedCastawayDropDown = [{value: '', label: 'Choose a loser'}]

getCastaways.once('value', snapshot => {
    let castaways = snapshot.val()
    castaways.forEach(castaway => {
        if (castaway.eliminated === 'FALSE') {
            castawayArr.push(castaway)
        } else {
            eliminatedCastawayDropDown.push({value: castaway.value, label: castaway.label})
    
    }
    })
    castawaysMultiSelect = castawayArr.map(c => {
        let { label, value } = c
        return { label, value }
    })
    castawaysDropDown = [
        { value: '', label: 'Choose a castaway' },
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
