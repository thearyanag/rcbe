const axios = require('axios')
require('dotenv').config()


const HELIUS_API_KEY = process.env.HELIUS_API_KEY

const url = `https://api.helius.xyz/v1/nft-events?api-key=${HELIUS_API_KEY}`

const getNFTStats = async (ownerAddress) => {
    const { data } = await axios.post(url, {
        query: {
            accounts: [ownerAddress],
        },
        options: {
            limit: 1000,
        },
    });

    let nfts = data.result;

    let nftSold = {
        total: 0,
        volume: 0,
    };
    let nftBought = {
        total: 0,
        volume: 0,
    };

    for (let i = 0; i < nfts.length; i++) {

        if (nfts[i].description.includes(`${ownerAddress} sold`)) {
            nftSold.total += 1;
            nftSold.volume += nfts[i].amount;
        } else if (nfts[i].description.includes(`to ${ownerAddress}`)) {
            nftBought.total += 1;
            nftBought.volume += nfts[i].amount;
        }

    }

    nftSold.volume = nftSold.volume / 1000000000;
    nftBought.volume = nftBought.volume / 1000000000;

    return {
        nftSold,
        nftBought,
    };

};

module.exports = getNFTStats;