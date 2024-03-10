import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { MintBaseLoader } from './blockchain/mbapi.js'
import { existsSync } from 'node:fs';
import { } from 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const blockchainType = {
  NEAR_MAINNET: "mainnet",
  NEAR_TESTNET: "testnet",
};

async function generateAndStoreEmbeddings() {

  // STEP 1: Load Docs
  // SETP 2: add docs
  
    const vectorStore = await HNSWLib.load(
      "hnswlib",
      new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
    );

    for (let i = 1; i < 39; i++) {
      const response = await fetch(
        `https://api2.nearblocks.io/v1/nfts?&order=desc&sort=txns_day&page=${i.toString()}&per_page=50`);
      const data = await response.json();

      for (const token of data.tokens) {

        //if (!existsSync(`mintbase/${token.contract}`)){
        // STEP 2: Create documents
        const blacklist = [];
        if(!blacklist.includes(token.contract)) {
          const loader = new MintBaseLoader(token.contract, "anon", blockchainType.NEAR_MAINNET);
          
          const docs = await loader.load();
          if(docs){
            console.log(token.contract,"done");
            vectorStore.addDocuments(docs);
          }else{
            console.log(token.contract,"failed");
          }
        }
      

      }
      vectorStore.save(`mintbase`);
    }

  

}
generateAndStoreEmbeddings();
