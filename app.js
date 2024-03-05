
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { createRetrieverTool } from "langchain/tools/retriever";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import {} from 'dotenv/config'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0 });
async function getAnswer(question) {

    // STEP 1: Load the vector store
    const vectorStore = await HNSWLib.load(
        "hnswlib",
        new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
    );

    const retriever = vectorStore.asRetriever();
    const tool = await createRetrieverTool(retriever, {
        name: "near_nft_mainnet",
        description: "Searches contract address and returns NFT general information.",
    });

    const tools = [tool];
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are very powerful assistant, but don't know current events"],
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const agent = await createOpenAIToolsAgent({
        llm,
        tools,
        prompt,
    });
    const agentExecutor = new AgentExecutor({
        agent,
        tools
    });
    const result = await agentExecutor.invoke({
        input: question
    });
    console.log(result)
}
getAnswer("mint.yearofchef.near")
