import { Document } from "@langchain/core/documents";
import { BaseDocumentLoader } from "langchain/document_loaders/base";
/**
 * Class representing a document loader for loading search results from
 * the MintBase. It extends the BaseDocumentLoader class.
 * @example
 * ```typescript
 * const BlockchainType = {
 *  NEAR_MAINNET: "near-mainnet",
 *  NEAR_TESTNET: "near-testnet",
 *};
 * const loader = new MintBaseLoader({
 *   contractAddress: "{contractAddress}",
 *   apiKey: "{apiKey}",
 *   blockchainType: "{blockchainType.NEAR_MAINNET}",
 * });
 * const docs = await loader.load();
 * ```
 */


export class MintBaseLoader extends BaseDocumentLoader {
    constructor(contractAddress, apiKey, blockchainType) {
        super();
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contractAddress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "blockchainType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });

        if (typeof apiKey !== "string") {
            throw new Error("Invalid type for apiKey. Expected string.");
        }
        const regex = /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/g;
        if (!regex.test(contractAddress)) {
            throw new Error(`Invalid contract address ${contractAddress}`);
        }
        this.apiKey = apiKey;
        this.contractAddress = contractAddress;
        this.blockchainType = blockchainType;
    }
    /**
     * Extracts documents from the provided output.
     * @param output - The output to extract documents from.
     * @param responseType - The type of the response to extract documents from.
     * @returns An array of Documents.
     */
    extractDocuments(output, responseType) {
        const documents = [];
        const results = Array.isArray(output) ? output : [output];
        if (responseType === "transcripts") {
            const pageContent = results.map((result) => result.text).join("\n");
            const metadata = {
                source: "MintBase",
                responseType,
            };
            documents.push(new Document({ pageContent, metadata }));
        }
        else {
            for (const result of results) {
                const pageContent = JSON.stringify(result);
                const metadata = {
                    source: "MintBase",
                    responseType,
                };
                documents.push(new Document({ pageContent, metadata }));
            }
        }
        return documents;
    }
    /**
     * Processes the response data from the MintBase search request and converts it into an array of Documents.
     * @param data - The response data from the MintBase search request.
     * @returns An array of Documents.
     */
    processResponseData(data) {
        const documents = [];
        const responseTypes = [
            "answer_box",
            "shopping_results",
            "knowledge_graph",
            "organic_results",
            "transcripts",
        ];
        for (const responseType of responseTypes) {
            if (responseType in data) {
                documents.push(...this.extractDocuments(data[responseType], responseType));
            }
        }
        return documents;
    }
    /**
     * Fetches the data from the provided URL and returns it as a JSON object.
     * If an error occurs during the fetch operation, an exception is thrown with the error message.
     * @param url - The URL to fetch data from.
     * @returns A promise that resolves to the fetched data as a JSON object.
     * @throws An error if the fetch operation fails.
     */
    async fetchData(blockchainType, contractAddress) {

        const operationsDoc = `
            query MyQuery {
              mb_views_nft_tokens(where: {nft_contract_id: {_eq: "${contractAddress}"}}) {
                base_uri
                burned_receipt_id
                burned_timestamp
                copies
                description
                expires_at
                extra
                issued_at
                last_transfer_receipt_id
                last_transfer_timestamp
                media
                media_hash
                metadata_content_flag
                metadata_id
                mint_memo
                minted_receipt_id
                minted_timestamp
                minter
                nft_contract_content_flag
                nft_contract_created_at
                nft_contract_icon
                nft_contract_id
                nft_contract_is_mintbase
                nft_contract_name
                nft_contract_owner_id
                nft_contract_reference
                nft_contract_spec
                nft_contract_symbol
                owner
                reference
                reference_blob
                reference_hash
                royalties
                royalties_percent
                splits
                starts_at
                title
                token_id
                updated_at
              }
            }
          `;
        const response = await fetch(
            "https://graph.mintbase.xyz/mainnet",
            {
                headers: {
                    "mb-api-key": "omni-site",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    query: operationsDoc,
                    variables: {},
                    operationName: "MyQuery"
                })
            }
        );
        const data = await response.json();
        console.log(data)

        // do something great with this precious data

        if (data.errors) {
            throw new Error(`Failed to load search results from MintBase due to: ${data.errors[0]}`);
        }
        return data;
    }
    /**
     * Loads the search results from the MintBase.
     * @returns An array of Documents representing the search results.
     * @throws An error if the search results could not be loaded.
     */
    async load() {
        const apiKey = this.apiKey;
        const contractAddress = this.contractAddress;
        const blockchainType = this.NEAR_MAINNET ? "MAINNET" : "TESTNET";
        try {
            const data = await this.fetchData(blockchainType, contractAddress);
            return this.processResponseData(data);
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to process search results from MintBase: ${error}`);
        }
    }
}
