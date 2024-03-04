import { MintBaseLoader } from './blockchain/mbapi.js'

const blockchainType = {
    NEAR_MAINNET: "near-mainnet",
    NEAR_TESTNET: "near-testnet",
};
export const run = async () => {
    const loader = new MintBaseLoader("mint.yearofchef.near", "", blockchainType.NEAR_MAINNET);
    const docs = await loader.load();
    console.log(docs);
};

run();


