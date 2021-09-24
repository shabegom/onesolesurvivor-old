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
        }
        else {
          setFailed(true);
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
          value="Login"
        />
        {allowRegistration &&
          <>
          <br />
        <input
          className="btn btn-primary"
          formNoValidate={true}
        type="submit"
          value="Register"
        />
        </>
        }
      </Form>
    </div>
  ) : (
    ""
  );
}

export default Login;

