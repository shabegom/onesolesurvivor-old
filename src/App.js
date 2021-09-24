import React, { Component } from "react";
import "./global.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

import castaways, { CastawaysContext } from "./Castaways";

// Dumb Components
import Header from "./Header.js";
import Footer from "./Footer.js";

// Main Page
import Home from "./Home.js";

//Admin Page
import Login from "./Login.js";
import MainForm from "./MainForm.js";

//Helper functions
import { processFormObject } from "./utils.js";
import { setTribal } from "./async.js";

import { withFirebase } from "./Firebase";

const pageStyle = {};

class App extends Component {
  constructor() {
    super();
    this.state = {

      fireRedirect: false,

    };
  }

  componentDidMount() {
    const user = this.props.firebase.auth.auth.currentUser;

    if (user) {
      this.props.firebase.auth.auth.reload(user)
    }
  }

  handleLogin = () => this.setState({ loggedIn: true, showLogin: false });

  onAuthStateChangeHandler = (setState, value) => {
    this.props.firebase.auth.auth.onAuthStateChanged((user) => {
      const adminId = process.env.REACT_APP_ADMIN_UID;
      if (user && user.uid === adminId) {
        setState(value);
      }
    });
  };
  render() {
    const processForm = (formData) => {
      const points = processFormObject(formData);
      if (points) {
        setTribal(points);
        this.setState({ fireRedirect: true });
      }
    };

    const baseUrl = process.env.PUBLIC_URL;

    return (
      <div className='App' style={pageStyle}>
        <Header />
        <CastawaysContext.Provider value={castaways}>
          <Router>
            <div>
              <Route
                exact={true}
                path={baseUrl + "/"}
                render={(props) => <Home />}
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
        </CastawaysContext.Provider>
        <Footer />
      </div>
    );
  }
}

export default withFirebase(App);
