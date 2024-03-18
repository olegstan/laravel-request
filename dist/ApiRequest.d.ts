/**
 *
 */
export default class ApiRequest {
    /**
     *
     * @type {null}
     */
    static notifyClass: null;
    /**
     *
     * @param target
     * @param focus
     * @param data
     * @param method
     */
    constructor(target: any, focus: any, data?: {}, method?: string);
    /**
     *
     * @type {string}
     */
    url: string;
    domain: string;
    target: any;
    focus: any;
    method: string;
    data: {};
    headers: any[];
    arguments: any[];
    builder: Builder;
    notifyCallback: (status: any) => boolean;
    responseBinding: any[] | Binding;
    responseBindingErrors: Binding;
    callSuccess: () => void;
    callError: () => void;
    /**
     *
     * @return {null}
     */
    getNotifyManager(): null;
    /**
     *
     * @param url
     * @return {ApiRequest}
     */
    setUrl(url: any): ApiRequest;
    /**
     *
     * @param domain
     * @return {ApiRequest}
     */
    setDomain(domain: any): ApiRequest;
    /**
     *
     * @param arg
     * @returns {ApiRequest}
     */
    addArg(arg: any): ApiRequest;
    /**
     *
     * @param successCallback
     * @param errorCallback
     * @returns {*}
     */
    first(successCallback?: (r: any) => void, errorCallback?: () => void): any;
    /**
     *
     * @param successCallback
     * @param errorCallback
     * @returns {*}
     */
    all(successCallback?: (r: any) => void, errorCallback?: () => void): any;
    /**
     *
     * @param page
     * @param perPage
     * @param successCallback
     * @param errorCallback
     * @returns {*}
     */
    paginate(page?: number, perPage?: number, successCallback?: (r: any) => void, errorCallback?: () => void): any;
    /**
     *
     * @param fields
     * @param successCallback
     * @param errorCallback
     * @return {ApiRequest}
     */
    pluck(fields: any, successCallback?: (r: any) => void, errorCallback?: () => void): ApiRequest;
    getUrl(): string;
    /**
     *
     * @param successCallback
     * @param errorCallback
     * @param params
     * @param dataKey
     * @param argumentsKey
     * @param queryKey
     * @param byUrl
     * @return {ApiRequest}
     */
    call(successCallback?: (r: any) => void, errorCallback?: () => void, params?: {}, dataKey?: string, argumentsKey?: string, queryKey?: string, byUrl?: boolean): ApiRequest;
    /**
     *
     * @param notify
     * @param errorCallback
     * @param xhr
     * @param errorText
     */
    handleError(notify: any, errorCallback: any, xhr: any, errorText: any): void;
    /**
     *
     * @param successCallback
     * @param errorCallback
     * @return {ApiRequest}
     */
    callSync(successCallback?: (r: any) => void, errorCallback?: () => void): ApiRequest;
    /**
     *
     * @param successCallback
     * @param errorCallback
     * @param params
     * @param dataKey
     * @param argumentsKey
     * @param queryKey
     * @return {ApiRequest}
     */
    callUrl(successCallback?: (r: any) => void, errorCallback?: () => void, params?: {}, dataKey?: string, argumentsKey?: string, queryKey?: string): ApiRequest;
    /**
     *
     * @param obj
     * @param item
     * @param rerender
     * @param cb
     */
    bind(obj: any, item: any, rerender: boolean, cb: any): this;
    /**
     *
     * @param response
     */
    toBind(response: any): void;
    resetBindErrors(): void;
    toBindErrors(response?: {}): void;
    withValidateForm(obj: any, item?: string, key?: string): this;
    withoutNotify(callback: any): this;
}
import Builder from "./Builder";
import Binding from "./Binding";
//# sourceMappingURL=ApiRequest.d.ts.map