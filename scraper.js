const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

axios.get('https://www.cbs.com/shows/survivor/cast/').then(res => {

const $ = cheerio.load(res.data)
let names = Array.from($('.title'))

let text = names.map(name => $(name).text())

let dashedNames = text.map(t => {
    return t.replace(/\s+/g,'-').toLowerCase()
})

let finalArr = text.map((item, i, arr) => {
    return item + ',' + dashedNames[i]
})

fs.writeFile('island-of-idols.csv', finalArr.join('\n'), () => {console.log('written')})



})

