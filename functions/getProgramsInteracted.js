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
    let noOfPrograms = 0;

    sig:
    while (signatures.length > 0) {
        const { data } = await axios.get(url + lastSig)

        length += data.length;

        if (data.length == 0) {
            break;
        }


        for (let i = 0; i < data.length; i++) {
            programs[data[i].source] = 0;
            type[data[i].type] = 0;

            
            let dateOfTx = new Date(data[0].timestamp * 1000);
            let dateNow = new Date().getTime();

            // break;
            if (dateNow - dateOfTx.getTime() > 1000 * 60 * 60 * 24 * 90) {
                break sig
            }
        }

        for (let i = 0; i < data.length; i++) {
            noOfPrograms += 1;
            programs[data[i].source] += 1;
            type[data[i].type] += 1;


            let dateOfTx = new Date(data[0].timestamp * 1000);
            let dateNow = new Date().getTime();

            if (dateNow - dateOfTx.getTime() > 1000 * 60 * 60 * 24 * 90) {
                break sig
            }

            if(noOfPrograms > 1000) {
                break sig
            }
        }

        let lastTx = data[data.length - 1];
        lastSig = lastTx.signature;
    }

    return {
        programs,
        type,
        total: length
    }
}


module.exports = getProgramsInteracted;

// sKWANKcXWytfFPWkzufyRQE3jpY9LkPReonhpTZtRjn
// xKWANGxA9Wwzf1ic2Ur864QFuqmDdGyExzusoLVEgsh
// DuSG1aooEgyCB1yDbLKFKdexeQYHPgfExmBQFD7bx8JL
// 3PKhzE9wuEkGPHHu2sNCvG86xNtDJduAcyBPXpE6cSNt