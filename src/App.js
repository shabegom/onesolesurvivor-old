import React, { Component } from 'react'
import './global.css'

import { BrowserRouter as Router, Route } from 'react-router-dom'

// Dumb Components
import Header from './Header.js'
import Footer from './Footer.js'

// Main Page
import Home from './Home.js'

//Admin Page
import Admin from './Admin.js'
import Login from './Login.js'
import MainForm from './MainForm.js'

//Helper functions
import { processFormObject } from './utils.js'
import {
    // getState,
    // handleIdolFound,
    // setMerged,
    setTribal,
    setTeams,
    setTribes,
    getRoot
} from './async.js'

const pageStyle = {
    background:
        'linear-gradient(RGBA(126,134,193,1.00), RGBA(43,93,167,1.00), RGBA(40,30,50,1.00)',
    color: 'RGBA(233,227,201,1.00)',
    textShadow: '1px 1px 2px RGBA(73,53,66,1.00)'
}

class App extends Component {
    constructor() {
        super()
        this.state = {
            showLogin: true,
            loggedIn: false,
            failed: false,
            merged: false,
            buffs: false,
            hasIdol: [],
            numTribes: 2,
            fireRedirect: false,
            tableData: [],
            leader: '',
            tribes: [],
            castaways: '',
            summary: {}
        }

        getRoot.once('value', snapshot => {
            let root = snapshot.val()
            let { castaways, state, teams, tribals, tribes } = root
            let { hasIdol, merged, numTribes } = state
            let leader
            let finalArr = []
            let summaries = tribals
                .filter(tribal => tribal.summary)
                .map(tribal => tribal.summary)

            let totalPoints = teams.map(team => {
                return team.totalPoints
            })
            let highscore = totalPoints.reduce((prev, current) => {
                return current > prev ? current : prev
            })

            //get tribal data into the table array
            let possibleLeaders = []
            teams.forEach(team => {
                if (team.totalPoints === highscore && team.totalPoints !== 0) {
                    possibleLeaders.push(team.name)
                }
                let pickNames = []
                let teamObj = {}
                tribes.forEach(tribe => {
                    let isEliminated = []
                    let castawayNames = []
                    castaways.forEach(castaway => {
                        tribe.castaways.forEach(value => {
                            if (castaway.value === value) {
                                isEliminated.push(castaway.eliminated)
                                castawayNames.push(castaway.label)
                            }
                        })
                    })
                    tribe['eliminated'] = isEliminated
                    tribe['names'] = castawayNames
                })

                castaways.forEach(castaway => {
                    team.picks.forEach(pick => {
                        if (pick === castaway.value) {
                            if (castaway.eliminated === 'TRUE') {
                                pickNames.push(
                                    <span
                                        style={{
                                            color: 'RGBA(145,147,134,.30)',
                                            filter: 'none'
                                        }}
                                    >
                                        {castaway.label.split(' ')[0]}
                                    </span>,
                                    ' '
                                )
                            } else {
                                pickNames.push(
                                    castaway.label.split(' ')[0],
                                    ' '
                                )
                            }
                        }
                    })
                })
                teamObj['name'] = team.name
                teamObj['totalPoints'] = team.totalPoints
                teamObj['picks'] = pickNames
                tribals.forEach(tribal => {
                    if (tribal.teams) {
                        tribal.teams.forEach(tribalTeam => {
                            if (team.value === tribalTeam.value) {
                                teamObj[tribal.value] = tribalTeam.points
                            }
                        })
                    }
                })
                finalArr.push(teamObj)
            })
            if (possibleLeaders.length === 1) {
                leader = possibleLeaders[0]
            }

            this.setState({
                hasIdol,
                merged,
                numTribes,
                leader,
                tableData: finalArr,
                castaways,
                tribes,
                tribals,
                summary: summaries
            })
        })
    }


    render() {
        const checkSecret = secret => {
            if (secret === 'worthplayingfor') {
                this.setState({
                    loggedIn: true,
                    showLogin: false,
                    failed: false
                })
            } else {
                this.setState({
                    failed: true
                })
            }
        }

        const processForm = formData => {
            const points = processFormObject(formData)
            if (points) {
                setTribal(points)
                setTeams(points)
                setTribes(points)
                this.setState({ fireRedirect: true })
            }
        }

        const baseUrl = process.env.PUBLIC_URL

        return (
            <div className="App" style={pageStyle}>
                <Header />
                <Router>
                    <div>
                        <Route
                            exact={true}
                            path={baseUrl + '/'}
                            render={props => (
                                <Home
                                    summary={this.state.summary}
                                    tribes={this.state.tribes}
                                    leader={this.state.leader}
                                    tableData={this.state.tableData}
                                    tribals={this.state.tribals}
                                    castaways={this.state.castaways}
                                />
                            )}
                        />
                        <Route
                            exact={true}
                            path={baseUrl + '/admin'}
                            render={props => (
                                <Admin>
                                    <Login
                                        showLogin={this.state.showLogin}
                                        checkSecret={checkSecret}
                                        failed={this.state.failed}
                                    />
                                    <MainForm
                                        processForm={processForm}
                                        fireRedirect={this.state.fireRedirect}
                                        loggedIn={this.state.loggedIn}
                                        merged={this.state.merged}
                                        hasIdol={this.state.hasIdol}
                                        />

                                </Admin>
                            )}
                        />
                    </div>
                </Router>
                <Footer />
            </div>
        )
    }
}

export default App
