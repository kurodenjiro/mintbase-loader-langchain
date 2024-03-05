import { OpenAIEmbeddings } from 'langchain/embeddings/openai' 
import { HNSWLib }  from 'langchain/vectorstores/hnswlib'
import { MintBaseLoader } from './blockchain/mbapi.js'

const OPENAI_API_KEY = "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";

const blockchainType = {
    NEAR_MAINNET: "mainnet",
    NEAR_TESTNET: "testnet",
};

async function generateAndStoreEmbeddings() {

  // STEP 1: Create documents
  const loader = new MintBaseLoader("mint.yearofchef.near", "omni-site", blockchainType.NEAR_MAINNET);
  const docs = await loader.load();

  // STEP 2: Generate embeddings from documents
  const vectorStore = await HNSWLib.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
  );

  // STEP 3: Save the vector store
  vectorStore.save("hnswlib");
}
generateAndStoreEmbeddings();
