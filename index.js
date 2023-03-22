const express = require('express')
const axios = require('axios');
const app = express()
app.use(express.json())
const port = 3000


const playerIdMap = {

    "629da8781be00a0068ac0d84": 6867317,
    "628f1d20f2ee4a0069e08f4b": 6867182,
    "6238138fa95758006958e9d6": 6896395,
    "5f893681acaa7100681fa022": 6896390

};
const scoreMap = {
    "High": 3,
    "Medium": 2,
    "Low": 1
}
app.get('/', (req, res) => {
    console.log("Got hit!!!")
    
  res.send('Hello World123!')
})

app.post('/', async (req, res) => {
    console.log("Got hit from jira!!!")
    if(req.body.changelog.items[0].field != 'Priority') {
        res.send()
        return;
    }
    const oldPriority = scoreMap[req.body.changelog.items[0].fromString] || 0;
    const newPriority = scoreMap[req.body.changelog.items[0].toString];
    const score = newPriority - oldPriority;

    const playerId = playerIdMap[req.body.issue.fields.reporter.accountId];
    await axios.post("https://keepthescore.co/api/uhnckkbyhse/score", {
        "score": score,
        "player_id": playerId
    })
    
    
    res.send()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})