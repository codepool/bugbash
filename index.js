const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    console.log("Got hit!!!")
    
  res.send('Hello World123!')
})

app.post('/', async (req, res) => {
    console.log("Got hit from jira!!!")
    await axios.post("https://keepthescore.co/api/uhnckkbyhse/score", {
        "score": 3,
        "player_id": 6896395
    }) 
    res.send()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})