import { Document } from "@langchain/core/documents";
import { BaseDocumentLoader } from "langchain/document_loaders/base.js";
import { SearchApiLoader } from "langchain/document_loaders/web/searchapi";
type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;
interface JSONObject {
    [key: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {
}
/**
 * SearchApiParameters Type Definition.
 *
 * For more parameters and supported search engines, refer specific engine documentation:
 * Google - https://www.searchapi.io/docs/google
 * Google News - https://www.searchapi.io/docs/google-news
 * Google Scholar - https://www.searchapi.io/docs/google-scholar
 * YouTube Transcripts - https://www.searchapi.io/docs/youtube-transcripts
 * and others.
 *
 */
type contractAddress = string;
type apiKey = string;
type blockchainType = string;
/**
 * Class representing a document loader for loading search results from
 * the SearchApi. It extends the BaseDocumentLoader class.
 * @example
 * ```typescript
 * const loader = new MintBaseLoader({
 *   q: "{query}",
 *   apiKey: "{apiKey}",
 *   engine: "google",
 * });
 * const docs = await loader.load();
 * ```
 */
export declare class MintBaseLoader extends BaseDocumentLoader {
    private apiKey;
    private contractAddress;
    constructor(contractAddress: contractAddress,apiKey:apiKey,blockchainType:blockchainType);
    /**
     * Builds the URL for the SearchApi search request.
     * @returns The URL for the search request.
     */
    buildUrl(): string;
    /**
     * Extracts documents from the provided output.
     * @param output - The output to extract documents from.
     * @param responseType - The type of the response to extract documents from.
     * @returns An array of Documents.
     */
    private extractDocuments;
    /**
     * Processes the response data from the SearchApi search request and converts it into an array of Documents.
     * @param data - The response data from the SearchApi search request.
     * @returns An array of Documents.
     */
    processResponseData(data: Record<string, unknown>): Document[];
    /**
     * Fetches the data from the provided URL and returns it as a JSON object.
     * If an error occurs during the fetch operation, an exception is thrown with the error message.
     * @param url - The URL to fetch data from.
     * @returns A promise that resolves to the fetched data as a JSON object.
     * @throws An error if the fetch operation fails.
     */
    private fetchData;
    /**
     * Loads the search results from the SearchApi.
     * @returns An array of Documents representing the search results.
     * @throws An error if the search results could not be loaded.
     */
    load(): Promise<Document[]>;
}
export {};
