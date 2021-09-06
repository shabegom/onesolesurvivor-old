import React, { useEffect, useState, useContext } from "react";
import { Input, Form } from "formsy-react-components";
import { FirebaseContext } from "./Firebase";

function Login({onAuthStateChangeHandler, allowRegistration}) {
  const [failed, setFailed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    onAuthStateChangeHandler(setLoggedIn, true)
  });

  const onSubmit = event => {
    const { email, password } = event;
    return firebase.auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => console.log("success"))
      .catch(function(error) {
      
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/user-not-found" && allowRegistration) {
          firebase.auth.auth.createUserWithEmailAndPassword(email, password)
        }
        else if (errorCode === "auth/wrong-password") {
          setFailed(true);
          alert("Wrong password.");
        } else {
          setFailed(true);
          alert(errorMessage);
        }
        console.log(error);
      });
  };

  return !loggedIn ? (
    <div >
      {failed ? "Login Failed!" : ""}
      <Form className="login-form" onSubmit={data => onSubmit(data)}>
        <Input name="email" type="text" placeholder="Email Address" />
        <Input
          name="password"
          placeholder="Password"
          type="password"
        />
        <input
          className="btn btn-primary"
          formNoValidate={true}
          type="submit"
          defaultValue="Login"
        />
      </Form>
    </div>
  ) : (
    ""
  );
}

export default Login;

// class Login extends Component {
// constructor(props) {
// super(props);
// this.state = { failed: false };
// }
//
// onSubmit = event => {
// const { email, password } = event;
// this.props.firebase
// .doSignInWithEmailAndPassword(email, password)
// .then(() => {
// this.props.handleLogin();
// })
// .catch(() => {
// this.setState({ failed: true });
// });
// };
//
// render() {
// const displayLogin = showLogin => {
// if (showLogin) {
// return (
// <div>
// <Form onSubmit={data => this.onSubmit(data)}>
// <Input name="email" type="text" placeholder="Email Address" />
// <Input
// name="password"
// placeholder="enter the secret code"
// type="password"
// />
// <input
// style={{ textAlign: "center" }}
// className="btn btn-primary"
// formNoValidate={true}
// type="submit"
// defaultValue="Login"
// />
// </Form>
// </div>
// );
// }
// };
//
// return (
// <div>
// {displayLogin(this.props.showLogin)}
// {this.state.failed ? "login failed!" : ""}
// </div>
// );
// }
// }
//
// export default withFirebase(Login);
