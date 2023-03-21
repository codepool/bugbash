const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    console.log("Got hit!!!")
  res.send('Hello World123!')
})

app.post('/', (req, res) => {
    console.log("Got hit from jira!!!")
    res.send()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})