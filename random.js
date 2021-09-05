const castaways = "./winners-at-war.csv";
const csv = require("csvtojson");

csv()
  .fromFile(castaways)
  .then(obj => {
    let arr = obj.map(o => o.value);
    const getInt = () => {
      let min = 0;
      let max = arr.length + 1;
      let rand = Math.floor(Math.random() * (max - min)) + min;
      return rand;
    };
    let i = 0;
    while (i < 15) {
      console.log(arr[getInt()]);
      i++;
    }
  });
