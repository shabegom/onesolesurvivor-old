import React, { useState, useContext } from "react";
import Modal from "react-modal";
import Login from "./Login";
import { FirebaseContext } from "./Firebase";

const LoginModal = () => {
  const [modalIsOpen, setIsOpen] = useState(true);
  const firebase = useContext(FirebaseContext);
  const onAuthStateChangeHandler = (setState, value) => {
    firebase.auth.auth.onAuthStateChanged((user) => {
      if (user) {
        setIsOpen(false);
      }
      setState(value);
    });
  };
  return (
    <Modal isOpen={modalIsOpen}>
      <div className='login-modal'>
        <>
          <h3>Login or Register</h3>
          <p className='login-modal-subhead'>
            Enter an email and password to login, or register an account
          </p>
        </>

        <Login
          onAuthStateChangeHandler={onAuthStateChangeHandler}
          allowRegistration={true}
        />
      </div>
    </Modal>
  );
};

export default LoginModal;
