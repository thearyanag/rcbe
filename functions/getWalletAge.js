const { Connection, PublicKey } = require("@solana/web3.js");
require('dotenv').config()


const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

const connection = new Connection(
    `https://rpc.helius.xyz?api-key=${HELIUS_API_KEY}`
);

async function getWalletAge(address, beforeSig) {
    let signatures = ["1"];
    let counter = 0;
    let before = { before: beforeSig };
    let lastSig = { signature: "", slot: 0 };
    let firstSig = { signature: "", slot: 0 };
    while (signatures.length > 0) {
        const sigs = await connection.getSignaturesForAddress(
            new PublicKey(address),
            before
        );
        // console.log(sigs);
        if (sigs.length == 0) {
            break;
        }
        if (counter == 0) {
            firstSig = sigs[0];
        }
        lastSig = sigs[sigs.length - 1];
        before = { before: lastSig.signature };
        counter++;
    }

    if(!firstSig.signature) {
        return {
            firstDate: "0",
            age: "0",
            lastDate: "0",
        }
    }

    const firstTx = await connection.getParsedTransaction(lastSig.signature , { "maxSupportedTransactionVersion": 0});
    const lastTx = await connection.getParsedTransaction(firstSig.signature , { "maxSupportedTransactionVersion": 0});
    
    const firstDate = new Date(firstTx.blockTime * 1000);
    const lastDate = new Date(lastTx.blockTime * 1000);
    let age = Date.now() - firstDate.getTime();
    age = Math.floor(age / (1000 * 60 * 60 * 24 * 30));

    return {
        firstDate: firstDate.toLocaleDateString(),
        age: age,
        lastDate: lastDate.toLocaleDateString(),
    }
}


module.exports = getWalletAge;