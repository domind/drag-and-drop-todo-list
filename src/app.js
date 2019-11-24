import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import Board from "./board/board";
import SignIn from "./signIn";
import SignUpForm from "./signUp";
import Landing from "./landing";
import * as firebase from "firebase/app";
import { config } from "./firebase";
import { Button, Navbar, Nav } from "react-bootstrap";

import withFirebaseAuth from "react-with-firebase-auth";

const firebaseApp = firebase.initializeApp(config);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      uder: "",
     // width: window.innerWidth,
      height: window.innerHeight,
      colNumber: 3,
    };

    this.resetPassword = this.resetPassword.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({  height: window.innerHeight });
  }

  resetPassword(email) {
    firebaseAppAuth.sendPasswordResetEmail(email);
    alert("email with link for password reset was sent to your account");
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      if (this.props.user !== null) {
        let user = "";
        if (this.props.user.displayName === null) user = this.props.user.email;
        else user = this.props.user.displayName;
        this.setState({
          uid: this.props.user.uid,
          user: user
        });
      } else this.setState({ uid: null, user: "" });
    }
  }

  render() {
    const firebaseProps = this.props;
    const dimensions = {
      minHeight: this.state.height,
      overflowX: "scroll",
        };
    return (
      <div className="myStyle" style={dimensions}>
        <Router>
          <Navbar bg="dark" variant="dark" >
            <Nav className="mr-auto">
              <Link to={"/"}>
                <Navbar.Brand>Start</Navbar.Brand>
              </Link>
              {this.state.uid !== null ? (
                <Link to={"/home"}>
                  <Navbar.Text>My board</Navbar.Text>
                </Link>
              ) : (
                " "
              )}
            </Nav>
            <Nav>
              {this.state.uid !== null ? (
                <div>
                  {" "}
                  <Navbar.Text>
                    Signed in as: {this.state.user}
                  </Navbar.Text>{" "}
                  <Button onClick={this.props.signOut}>Sign out</Button>
                </div>
              ) : (
                <div>
                  <Link to={"/signup"}>
                    <Button variant="primary">Sign up</Button>{" "}
                  </Link>
                  <Navbar.Text>&nbsp;</Navbar.Text>

                  <Link to={"/signin"}>
                    <Button variant="primary">Sign in</Button>
                  </Link>
                </div>
              )}
            </Nav>
          </Navbar>
          <div>
            <Switch>
              <Route
                path={"/home"}
                render={props =>
                  this.state.user !== "" ? (
                    <Board {...props} uid={this.state.uid} />
                  ) : (
                    <Landing
                      {...props}
                      firebaseProps={firebaseProps}
                      user={this.state.user}
                    />
                  )
                }
              />
              <Route
                path={"/signin"}
                render={props => (
                  <SignIn
                    {...props}
                    firebaseProps={firebaseProps}
                    user={this.state.user}
                    resetPassword={this.resetPassword}
                  />
                )}
              />
              <Route
                path={"/signup"}
                render={props => (
                  <SignUpForm {...props} firebaseProps={firebaseProps} />
                )}
              />
              <Route
                path={"/"}
                render={props => (
                  <Landing
                    {...props}
                    firebaseProps={firebaseProps}
                    user={this.state.user}
                  />
                )}
              />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(App);
