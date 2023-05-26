const axios = require('axios')
require('dotenv').config()


const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const getBalances = async (ownerAddress) => {
    const uRl = `https://api.helius.xyz/v0/addresses/${ownerAddress}/balances?api-key=${HELIUS_API_KEY}`
    const { data } = await axios.get(uRl)
    const tokens = data.tokens

    let tokenData = []
    let tokenMintAddress = []

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].amount > 100) {
            tokenData.push({
                "mint": tokens[i].mint,
                "amount": tokens[i].amount / 1000000000,
            });
            tokenMintAddress.push(tokens[i].mint);
        }
    }

    return {
        tokens: tokenData,
        tokenMint: tokenMintAddress,
    }
}

const getStakedAccounts = async (ownerAddress) => {
    const { tokens, tokenMint } = await getBalances(ownerAddress);

    let stakedAccounts = [];
    let stakedSol = 0;

    let tokenName =  await getTokenMetadata(tokenMint);

    for (let i = 0; i < tokenName.length; i++) {
        if(tokenName[i].includes("Staked")) {
            stakedAccounts.push({
                "mint": tokenMint[i],
                "name": tokenName[i],
                "amount": tokens[i].amount,
            });
            stakedSol += tokens[i].amount;
        }
    }


    return {
        stakedAccounts,
        stakedSol,
    }
}

const getTokenMetadata = async (mintAddress) => {
    const url = "https://api.helius.xyz/v0/token-metadata?api-key=7af4bda5-23e2-4d78-a78f-49e79cf354ed";

    const { data } = await axios.post(url, {
        mintAccounts: mintAddress,
        includeOffChain: true,
        disableCache: false,
    });

    let mintName = [];

    for (let i = 0; i < data.length; i++) {

        if(data[i].onChainMetadata.metadata != null) {
            mintName.push(data[i].onChainMetadata.metadata.data.name);
        } else if(data[i].offChainMetadata.metadata != null) {
            mintName.push(data[i].offChainMetadata.metadata.name);
        } else {
            mintName.push(data[i].legacyMetadata.name);
        }
    }

    return mintName;
}

module.exports = getStakedAccounts;