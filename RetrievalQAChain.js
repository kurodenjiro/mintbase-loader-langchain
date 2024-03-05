import { OpenAI } from "langchain/llms/openai" ;
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib" ;
import { RetrievalQAChain, loadQARefineChain } from "langchain/chains";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 });

async function getAnswer(question) {

  // STEP 1: Load the vector store
  const vectorStore = await HNSWLib.load(
    "hnswlib",
    new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
  );

  // STEP 2: Create the chain
  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQARefineChain(model),
    retriever: vectorStore.asRetriever(),
  });

  // STEP 3: Get the answer
  const result = await chain.call({
    query: question,
  });
  console.log(result.output_text)
  return result.output_text;
}
getAnswer("mint.yearofchef.near")
