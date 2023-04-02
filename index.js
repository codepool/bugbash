const express = require('express')
const axios = require('axios');
const app = express()
app.use(express.json())
const port = 3000


const scoreMap = {
    "High": 3,
    "Medium": 2,
    "Low": 1
}
let players;
app.get('/', (req, res) => {
    console.log("Server is up and running")
})

app.post('/', async (req, res) => {
    console.log("Got callback from jira!!!")
    console.log(players)
    if(req.body.changelog.items[0].field != 'Priority') {
        res.send()
        return;
    }
    const oldPriority = scoreMap[req.body.changelog.items[0].fromString] || 0;
    const newPriority = scoreMap[req.body.changelog.items[0].toString];
    const score = newPriority - oldPriority;

    const reporter = req.body.issue.fields.reporter;
    const playerId = getPlayerId(reporter.displayName);
    await axios.post("https://keepthescore.co/api/uhnckkbyhse/score", {
        "score": score,
        "player_id": playerId
    })
    
    res.send()
})

app.listen(port, async () => {
  console.log(`App listening on port ${port}`)
  //get all player list;
  const resp = await axios.get("https://keepthescore.co/api/ddnzsxiuczr/board");
  players = resp.data.players;
  console.log(players)

})


function getPlayerId(name) {
    const player = players.filter(p => {
        return p.name.toLowerCase() == name.toLowerCase()
    })
    return player[0].id
}