const axios = require('axios')
require('dotenv').config()

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

const getProgramsInteracted = async (ownerAddress) => {

    let signatures = ["1"];

    const url = `https://api.helius.xyz/v0/addresses/${ownerAddress}/transactions?api-key=${HELIUS_API_KEY}&before=`
    let lastSig = "";

    let programs = {};
    let type = {};
    let length = 0;

    while (signatures.length > 0) {
        const { data } = await axios.get(url + lastSig)
    
        length += data.length;
        
        if (data.length == 0) {
            break;
        }

        for (let i = 0; i < data.length; i++) {
            programs[data[i].source] = 0;
            type[data[i].type] = 0;
        }

        for (let i = 0; i < data.length; i++) {
            programs[data[i].source] += 1;
            type[data[i].type] += 1;
        }

        let lastTx = data[data.length - 1];
        lastSig = lastTx.signature;
    }
    
    return {
        programs,
        type,
        total : length
    }
}


module.exports = getProgramsInteracted;