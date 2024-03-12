
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
    const filterData = [];
    const retriever = await vectorStore.similaritySearchWithScore("NFT",40);
  //  console.log(retriever);
    for (const data of retriever) {
        console.log(data[1])
        if(data[1] < 0.23){
        filterData.push(data[0])
        }
    }
    console.log(filterData,filterData.length)
 

}
searchProject()
