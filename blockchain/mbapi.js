import { Document } from "@langchain/core/documents";
import { BaseDocumentLoader } from "langchain/document_loaders/base";
/**
 * Class representing a document loader for loading search results from
 * the MintBase. It extends the BaseDocumentLoader class.
 * @example
 * ```typescript
 * const BlockchainType = {
 *  NEAR_MAINNET: "mainnet",
 *  NEAR_TESTNET: "testnet",
 *};
 * const loader = new MintBaseLoader({
 *   contractAddressList: ["{contractAddress}"],
 *   apiKey: "{apiKey}",
 *   blockchainType: "{blockchainType.NEAR_MAINNET}",
 * });
 * const docs = await loader.load();
 * ```
 */


export class MintBaseLoader extends BaseDocumentLoader {
    constructor(contractAddressList, apiKey, blockchainType) {
        super();
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contractAddressList", {
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
        if(!Array.isArray(contractAddressList)){
            throw new Error(`Invalid data type`);
        }

        this.apiKey = apiKey;
        this.contractAddressList = contractAddressList;
        this.blockchainType = blockchainType;
    }
    /**
     * Extracts documents from the provided output.
     * @param output - The output to extract documents from.
     * @returns An array of Documents.
     */
    extractDocuments(output) {
        const documents = [];
        const pageContent = JSON.stringify(output);
        const metadata = {
            source: output.nft_contract_id,
            blockchain: this.blockchainType,
            tokenId: output.token_id,
        };
        documents.push(new Document({ pageContent, metadata }));
        return documents;
    }
    /**
     * Processes the response data from the MintBase search request and converts it into an array of Documents.
     * @param data - The response data from the MintBase search request.
     * @returns An array of Documents.
     */
    processResponseData(data) {
        const documents = [];
        for (const nft_token of data) {
            documents.push(...this.extractDocuments(nft_token));
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
    async fetchData(contractAddress) {
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
            `https://graph.mintbase.xyz/${this.blockchainType}`,
            {
                headers: {
                    "mb-api-key": this.apiKey,
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

        // do something great with this precious data
        if (data.errors) {
            throw new Error(`Failed to load search results from MintBase due to: ${data.errors[0]}`);
        }
        return data.data.mb_views_nft_tokens;
    }
    /**
     * Loads the search results from the MintBase.
     * @returns An array of Documents representing the search results.
     * @throws An error if the search results could not be loaded.
     */
    async load() {
        const contractAddressList = this.contractAddressList;
        try {
            const data = [];
            for (const contractAddress of contractAddressList) {
                const regex = /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/g;
                if (regex.test(contractAddress)) {
                    const dataNft = await this.fetchData(contractAddress);
                    data.push(dataNft)
                }
            }
            return this.processResponseData(data);
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to process search results from MintBase: ${error}`);
        }
    }
}
