const express = require('express')
const onchainData = require('./functions/getOnchainData')
const searchNFT = require('./functions/searchNFT');
const axios = require('axios')

const app = express()
require('dotenv').config()
app.use(express.json({limit: '2mb', extended: true}));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/getData', async (req, res) => {
    const { wallet } = req.query

    const data = await onchainData(wallet)

    res.send(data)

});

app.post('/mint', async (req, res) => {
    const degenData = req.body
    const { wallet } = req.query

    const walletdata = await searchNFT(wallet)

    if (walletdata) {
        res.send(walletdata)
        return
    }

    let receiverAddress = wallet;

    let imageId = degenData.status;

    const token = process.env.UNDERDOG_PROTOCOL_API_KEY;

    let url = "";
    if (imageId == 3) {
        url = "https://i.imgur.com/oWx6DKY.png"
    } else if (imageId == 2) {
        url = "https://i.imgur.com/s2qKwWx.png"
    } else {
        url = "https://i.imgur.com/bmFcMj1.png"
    }

    let metadata = JSON.stringify({
        "name": `My Report Card`,
        "image": url,
        "receiverAddress": receiverAddress,
        "attributes": degenData,
    });

    let config = {
        method: 'post',
        url: 'https://api.underdogprotocol.com/v2/projects/c/4/nfts',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: metadata
    };

    const { data } = await axios(config)

    res.status(200)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
)
