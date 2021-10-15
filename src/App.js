import React, { Component } from "react"
import "./global.css"

import { BrowserRouter as Router, Route } from "react-router-dom"

// Dumb Components
import Header from "./Header.js"
import Footer from "./Footer.js"

// Main Page
import Home from "./Home.js"

//Admin Page
import Login from "./Login.js"
import MainForm from "./MainForm.js"

//Helper functions
import { processFormObject } from "./utils.js"

import { withFirebase } from "./Firebase"

const pageStyle = {}

class App extends Component {
  constructor() {
    super()
    this.state = {
      fireRedirect: false,
      root: {
        state: {
          started: "closed"
        }
      }
    }
  }

  componentDidMount() {
    const user = this.props.firebase.auth.auth.currentUser

    if (user) {
      this.props.firebase.auth.auth.reload(user)
    }
    this.props.firebase.db.get.getRoot()
      .on("value"
      , (snap) => {
        const root = snap.val()
        this.setState({ root })
      })
  }

  handleLogin = () => this.setState({ loggedIn: true, showLogin: false })

  onAuthStateChangeHandler = (setState, value) => {
    this.props.firebase.auth.auth.onAuthStateChanged((user) => {
      const adminId = process.env.REACT_APP_ADMIN_UID
      if (user && user.uid === adminId) {
        setState(value)
      }
    })
  }
  render() {
    const processForm = (formData) => {
      const { tribals, castaways, teams } = this.state.root
      const points = processFormObject(formData, castaways, teams)
      const updatedTribals = tribals.map((tribal, i) => {
        if (i === points.num - 1) {
          points["label"] = tribal.label
          tribal = points
        }
        return tribal
      })
      this.props.firebase.db.set.setTribals({ ...updatedTribals })
      points.merged && this.props.firebase.db.set.setMerged(points.merged)

      this.setState({ fireRedirect: true })
    }

    const baseUrl = process.env.PUBLIC_URL

    return (
      <div className='App' style={pageStyle}>
        <Header />
        <Router>
          <div>
            <Route
              exact={true}
              path={baseUrl + "/"}
              render={(props) => <Home root={this.state.root} />}
            />
            <Route
              exact={true}
              path={baseUrl + "/admin"}
              render={(props) => (
                <div style={{ padding: "10px" }}>
                  <Login
                    onAuthStateChangeHandler={this.onAuthStateChangeHandler}
                    allowRegistration={false}
                  />
                  <MainForm
                    processForm={processForm}
                    fireRedirect={this.state.fireRedirect}
                  />
                </div>
              )}
            />
          </div>
        </Router>
        <Footer />
      </div>
    )
  }
}

export default withFirebase(App)
