
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import {} from 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function searchProject() {

    // STEP 1: Load the vector store
    const vectorStore = await HNSWLib.load(
        "potlock",
        new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
    );

    const retriever = await vectorStore.similaritySearchWithScore("public good", 5);
    console.log(retriever);
 

}
searchProject()
