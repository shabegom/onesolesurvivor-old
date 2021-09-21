import React, {useContext, useState, useEffect} from "react";
import {FirebaseContext} from './Firebase'

const Tribes = () => {
  const firebase = useContext(FirebaseContext)
  const [tribes, setTribes] = useState([])
  useEffect(() => {
    firebase.db.get.getRoot().once("value", snap => {
      let { castaways=[], tribals=[] } = snap.val()
      castaways = castaways.filter(castaway => {
        let include = true
        tribals.forEach(tribal => {
          if (tribal.eliminated && tribal.eliminated.includes(castaway.value)) {
            include = false
          }
        })
        return include
      })
      const tribes = castaways.reduce((acc, castaway) => {
        if (acc.length === 0) {
          acc.push(castaway.tribe)
        }
        if (!acc.includes(castaway.tribe)) {
          acc.push(castaway.tribe)
        }
        return acc
      }, [])
      const tribesObject = tribes.map(tribe => {
        const obj = {
          tribeName: tribe,
          castaways: []
        }
        castaways.forEach(castaway => {
          if (castaway.tribe === tribe) {
            obj.castaways.push({ value: castaway.value, name: castaway.label })
            }
        })
        return obj
      })
      setTribes(tribesObject)
    })
  }, [])
  return (
    <div id='tribes' className='tribes'>
      {makeTribes(tribes)}
    </div>
  );
};

const makeTribeNames = (tribe) => {
  return tribe.castaways.map((castaway) => {
    // let imageName = name.toLowerCase().replace(/ /g, '-')
    let imagePath;
    try {
imagePath = require(`./images/${castaway.value}.jpg`);
    }
    catch (err) {
      imagePath= require('./images/placeholder.PNG')
    }
    
      return (
        <div key={castaway.value} className='castaway'>
          <img
            alt={castaway.value}
            src={imagePath}
            style={{
              width: "75px",
              filter: "drop-shadow(1px 0px 4px RGBA(76,60,75,1.00))"
            }}
          />{" "}
          <br />
          <div
            style={{
              fontFamily: "arial",
              textAlign: "center",
              fontSize: "12px",
              marginTop: "-20px"
            }}
          >
            {castaway.name}
          </div>
        </div>
      );

  });
};
const makeTribes = (tribes) => {
  let finalTribeArray = [];
  tribes.forEach((tribe) => {
    let tribeArray = [];
    tribeArray.push(
      <div key={tribe.tribeName}>
        <h3>{tribe.tribeName}</h3>
        <hr />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          {makeTribeNames(tribe)}
        </div>
      </div>
    );
    finalTribeArray.push(tribeArray);
  });
  return <div>{finalTribeArray}</div>;
};

export default Tribes;
