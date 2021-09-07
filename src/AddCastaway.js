import React, { useContext } from "react";
import { Form, Input } from "formsy-react-components";
import { FirebaseContext } from "./Firebase";


let myform = null
  const refCallback = (form) => {
    myform = form;
  };

    const resetForm = () => {
      console.log("Reset called"); // eslint-disable-line no-console
      const { formsyForm } = myform;
      formsyForm.reset();
    };

const AddCastaway = () => {
  const firebase = useContext(FirebaseContext);
  function handleCastawaySubmit(data) {
    const castawayObject = {
      label: data.castaway,
      tribe: data.tribe,
      value: data.castaway.split(" ").join("-").toLowerCase()
    };
    firebase.db.get.getCastaways().once("value", (snap) => {
      const castaways = snap.val() || []
      castaways.push(castawayObject);
      firebase.db.set.setCastaways(castaways);
      resetForm()
    });

    
  }
  return (
    <Form className="form" onSubmit={handleCastawaySubmit} ref={refCallback}>
      <Input
        name='castaway'
        label='Name'
      />
      <Input
        name='tribe'
        label='Tribe'
      />
      <input
        name='submit'
        type='submit'
        className='btn btn-primary'
        value='Add Castaway'
      />
    </Form>
  );
};

export default AddCastaway;
