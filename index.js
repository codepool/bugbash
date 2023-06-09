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
app.get('/', async (req, res) => {
    console.log("Server is up and running")
    const resp = await axios.get("https://keepthescore.co/api/ddnzsxiuczr/board");
    players = resp.data.players;
    res.send()
})

app.post('/', async (req, res) => {
    console.log("Got callback from jira!!!")
    if(!players) {
        const resp = await axios.get("https://keepthescore.co/api/ddnzsxiuczr/board");
        players = resp.data.players;
    }
    
    const reporter = req.body.issue.fields.reporter;
    if(req.body.changelog.items[0].field ==  "Bug Approval Status") {
        if(req.body.changelog.items[0].toString == 'Rejected') {
            let pr = scoreMap[req.body.issue.fields.customfield_10074.value] || 0
            if(pr != 0) {
                await axios.post("https://keepthescore.co/api/uhnckkbyhse/score", {
                    "score": -1 * pr,
                    "player_id": getPlayerId(reporter.displayName)
                })
            }
            
        } else if(req.body.changelog.items[0].toString == 'Accepted' && req.body.changelog.items[0].fromString == 'Rejected') {
            let pr = scoreMap[req.body.issue.fields.customfield_10074.value] || 0
            if(pr != 0) {
                await axios.post("https://keepthescore.co/api/uhnckkbyhse/score", {
                    "score": pr,
                    "player_id": getPlayerId(reporter.displayName)
                })
            }

        }
        res.send()
        return;
    }
    if(req.body.changelog.items[0].field != 'Priority' || (req.body.issue.fields.customfield_10071 && req.body.issue.fields.customfield_10071.value == 'Rejected')) {
        res.send()
        return;
    }

    

    const oldPriority = scoreMap[req.body.changelog.items[0].fromString] || 0;
    const newPriority = scoreMap[req.body.changelog.items[0].toString];
    const score = newPriority - oldPriority;

    
    const playerId = getPlayerId(reporter.displayName);
    console.log("JIRA Display name = " +  reporter.displayName + " found player id = " + playerId)
    await axios.post("https://keepthescore.co/api/uhnckkbyhse/score", {
        "score": score,
        "player_id": playerId
    })
    res.send()
    
})

app.listen(port, async () => {
  console.log(`App listening on port ${port}`)
  //get all player list;
  

})


function getPlayerId(name) {
    const player = players.filter(p => {
        return p.name.toLowerCase() == name.toLowerCase()
    })
    return player[0].id
}