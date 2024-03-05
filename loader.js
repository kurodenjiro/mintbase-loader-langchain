import { MintBaseLoader } from './blockchain/mbapi.js'

const blockchainType = {
    NEAR_MAINNET: "mainnet",
    NEAR_TESTNET: "testnet",
};
export const run = async () => {
    const loader = new MintBaseLoader("mint.yearofchef.near", "omni-site", blockchainType.NEAR_MAINNET);
    const docs = await loader.load();
    console.log(docs);
};

run();
