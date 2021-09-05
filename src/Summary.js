import React, { Component } from 'react'

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

export default class Summary extends Component {
    render() {
        const buildSummary = summary => {
            let finalArr = []
            let lastElement = summary[summary.length - 1]
            if (lastElement) {
                let eliminated = lastElement.eliminated
                finalArr.push(
                    <p>
                        {toTitleCase(eliminated.join('-').split('-').join(' '))} was
                        eliminated
                    </p>
                )
                if (lastElement.idolFound) {
                    lastElement.idolFound.forEach(idol => {
                        finalArr.push(
                            <p>
                                {toTitleCase(idol.split('-').join(' '))} found
                                an Idol: +5 points
                            </p>
                        )
                    })
                }
                if (lastElement.idolWon) {
                    lastElement.idolWon.forEach(idol => {
                        finalArr.push(
                            <p>
                                {toTitleCase(idol.split('-').join(' '))} Won
                                an Idol: +1 point
                            </p>
                        )
                    })
                }
                if (lastElement.immunity) {
                    let immunityWinner = lastElement.immunity.join('-')
                    finalArr.push(
                        <p>
                            {toTitleCase(immunityWinner.split('-').join(' '))}{' '}
                            won Immunity: +5 points
                        </p>
                    )
                }
                if (lastElement.reward) {
                    finalArr.push(<p>Reward Winners (+5 points):</p>)
                    finalArr.push(
                        lastElement.reward.map(r => {
                            return (
                                <li style={{ marginLeft: '30px' }}>
                                    {toTitleCase(r.split('-').join(' '))}
                                </li>
                            )
                        })
                    )
                }
                if (lastElement.idolActions) {
                    finalArr.push(<p>Idols:</p>)
                    finalArr.push(
                        lastElement.idolActions.map(object => {
                            return (
                                <li style={{ marginLeft: '30px' }}>{object.value.split('-').join(' ')}: {object.action}</li>
                            )
                        })
                    )
                }
            }
            return finalArr
        }
        return (
            <div>
                <div
                    style={{
                        background: 'RGBA(248,247,217,0.01)',
                        padding: '10px',
                        fontFamily: 'Arial, sans-serif'
                    }}
                >

				<h3 style={{ textAlign: 'center' }}>Last Episode</h3>
                    {this.props.summary[0]
                        ? buildSummary(this.props.summary)
                        : "A summary of the last tribal will be posted here once we've started."}
                </div>
            </div>
        )
    }
}
