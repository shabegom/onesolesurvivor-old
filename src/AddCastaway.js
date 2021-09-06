import React, { useContext, useState } from "react";
import { Form, Input } from "formsy-react-components";
import { FirebaseContext } from "./Firebase";

const AddCastaway = () => {
  const [name, setName] = useState("");
  const [tribe, setTribe] = useState("");
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
      setName("");
      setTribe("");
    });
    firebase.db.get.getTribes().once("value", (snap) => {
      const tribes = snap.val() || []
      const tribeNames = tribes.reduce((acc, tribe) => {
        acc.push(tribe.tribeName);
        return acc;
      }, []);
      if (!tribeNames.includes(data.tribe)) {
        tribes.push({
          tribeName: data.tribe,
          castaways: [castawayObject.value]
        });
      }
      tribes.forEach((tribe) => {
          if (data.tribe === tribe.tribeName && !tribe.castaways.includes(castawayObject.value)) {
          tribe.castaways.push(castawayObject.value);
        }
      });
        firebase.db.set.setTribes(tribes)
    });
  }
  return (
    <Form className="form" onSubmit={handleCastawaySubmit}>
      <Input
        name='castaway'
        label='Name'
        value={name}
        onChange={(e) => setName(e.value)}
      />
      <Input
        name='tribe'
        label='Tribe'
        value={tribe}
        onChange={(e) => setTribe(e.value)}
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
