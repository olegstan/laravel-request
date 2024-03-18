export default class Api {
    /**
     *
     * @type {ApiRequest}
     */
    static debug: ApiRequest;
    /**
     *
     * @type {ApiRequest}
     */
    static requestClass: ApiRequest;
    /**
     *
     * @return {Promise<string>}
     */
    static tokenResolver: () => Promise<string>;
    /**
     *
     * @param controller
     * @param action
     * @param arg
     * @param data
     * @return {ApiRequest}
     */
    static getArg(controller: any, action: any, arg: any, data?: {}): ApiRequest;
    /**
     *
     * @param controller
     * @param action
     * @param arg
     * @param data
     * @return {ApiRequest}
     */
    static postArg(controller: any, action: any, arg: any, data?: {}): ApiRequest;
    /**
     *
     * @param controller
     * @param action
     * @param arg
     * @param data
     * @return {ApiRequest}
     */
    static putArg(controller: any, action: any, arg: any, data?: {}): ApiRequest;
    /**
     *
     * @param url
     * @param data
     * @return {ApiRequest}
     */
    static getUrl(url: any, data?: {}): ApiRequest;
    /**
     *
     * @param url
     * @param data
     * @return {ApiRequest}
     */
    static postUrl(url: any, data?: {}): ApiRequest;
    /**
     *
     * @param url
     * @param data
     * @return {ApiRequest}
     */
    static putUrl(url: any, data?: {}): ApiRequest;
    /**
     *
     * @param controller
     * @param action
     * @param data
     * @returns {ApiRequest}
     */
    static get(controller: any, action: any, data?: {}): ApiRequest;
    /**
     *
     * @param controller
     * @param action
     * @param data
     * @returns {ApiRequest}
     */
    static post(controller: any, action: any, data?: {}): ApiRequest;
    /**
     *
     * @param controller
     * @param action
     * @param data
     * @returns {ApiRequest}
     */
    static put(controller: any, action: any, data?: {}): ApiRequest;
    /**
     *
     * @param controller
     * @param action
     * @param id
     * @param data
     * @return {ApiRequest}
     */
    static delete(controller: any, action: any, id: any, data?: {}): ApiRequest;
    /**
     *
     * @param params
     * @return {*}
     */
    static encodeQueryString(params: any): any;
    /**
     *
     * @param request
     */
    static logRequest(request: any): void;
    /**
     *
     * @param obj
     * @return {*}
     */
    static makeRequest({ url, method, data, params, headers, success, error }: {
        url: any;
        method: any;
        data?: {};
        params?: {};
        headers?: {};
        success?: () => void;
        error?: () => void;
    }): any;
}
import ApiRequest from "./ApiRequest";
