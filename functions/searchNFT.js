const axios = require('axios')
require('dotenv').config()


const searchNFT = async (ownerAddress) => {

    const token = process.env.UNDERDOG_PROTOCOL_API_KEY;

    let searchConfig = {
        method: 'get',
        url: `https://api.underdogprotocol.com/v2/projects/c/4/nfts/search?search=${ownerAddress}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    let { data } = await axios(searchConfig);
    console.log(data)
    data = data["results"][0]

    console.log(data)

    if (data) {
        return data.mintAddress;
    } else {
        return false;
    }
};

module.exports = searchNFT;