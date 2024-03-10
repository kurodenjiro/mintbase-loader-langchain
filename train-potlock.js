import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import {} from 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateAndStoreEmbeddings() {

    // STEP 1: Crawl Data
    const tokens = []
    const vector = []
    const response = await fetch(
        `https://raw.githubusercontent.com/louisdevzz/crawData/main/res/snapshot.json`);
    const data = await response.json();
    for (const token of data) {

       // console.log(token.data.profile.plCategories,token.data.profile.category,token.index);
        let content = "";
        let name = "";
        let description = "";
        let category = "";
        let tagline = "";
        let tags = "";
        if(token.data.profile.plCategories){
           // console.log(JSON.parse(token.data.profile.plCategories).join(","))
            category = JSON.parse(token.data.profile.plCategories).join(",")
        }else{
            if(token.data.profile.category.text){
                category = token.data.profile.category.text
            }else{
                category = token.data.profile.category.replace("-"," ")
            }

        }
        category = `Category:${category}`;
        description = "Description:"  + token.data.profile.description;
        //console.log(category);
        
        if(token.data.profile.tagline){
            tagline ="Tagline:" + token.data.profile.tagline
        }
        
        
        if(token.data.profile.tags){
            tags = "Tags:" + Object.keys(token.data.profile.tags).join(",")
        }
        if(token.data.profile.name){
            name = "Name:" + token.data.profile.name;
        }
        
        content = `${name}
        ${description}
        ${tags}
        ${tagline}`
        console.log(content);
        //console.log(`${token.data.profile.category && typeof token.data.profile.category == 'object' ? token.data.profile.category.text : token.data.profile.category}. ${token.data.profile.description}. ${token.data.profile.tagline && token.data.profile.tagline}`)
        tokens.push(content)
        vector.push({id:token.index,accountId:token.accountId})
    }
    //console.log(tokens)
    const vectorStore = await HNSWLib.fromTexts(
        tokens,
        vector,
        new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
    );
    const resultOne = await vectorStore.similaritySearchWithScore("public good", 5);
    console.log(resultOne);

    
    // STEP 4: Save the vector store
    vectorStore.save("potlock");
}
generateAndStoreEmbeddings();
