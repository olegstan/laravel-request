// Define an interface for the ApiRequest class
declare class ApiRequest {
    url: string;
    static notifyClass: any | null;
    domain: string;
    target: string;
    focus: string;
    method: string;
    data: any;
    headers: any[];
    arguments: any[];
    builder: Builder;
    notifyCallback: (status: number) => boolean;
    responseBinding: Binding | Binding[] | null;
    responseBindingErrors: Binding | null;
    callSuccess: Function;
    callError: Function;

    constructor(target: string, focus: string, data?: object, method?: string);

    getNotifyManager(): any | null;
    setUrl(url: string): ApiRequest;
    setDomain(domain: string): ApiRequest;
    addArg(arg: any | any[]): ApiRequest;
    first(successCallback?: (r: any) => void, errorCallback?: () => void): any;
    all(successCallback?: (r: any) => void, errorCallback?: () => void): any;
    paginate(
        page?: number,
        perPage?: number,
        successCallback?: (r: any) => void,
        errorCallback?: () => void
    ): any;
    pluck(
        fields: any,
        successCallback?: (r: any) => void,
        errorCallback?: () => void
    ): ApiRequest;
    getUrl(): string;
    call(
        successCallback?: (r: any) => void,
        errorCallback?: () => void,
        params?: object,
        dataKey?: string,
        argumentsKey?: string,
        queryKey?: string,
        byUrl?: boolean
    ): ApiRequest;
    callSync(
        successCallback?: (r: any) => void,
        errorCallback?: () => void
    ): ApiRequest;
    callUrl(
        successCallback?: (r: any) => void,
        errorCallback?: () => void,
        params?: object,
        dataKey?: string,
        argumentsKey?: string,
        queryKey?: string
    ): ApiRequest;
    constructRequestData(
        dataKey: string,
        argumentsKey: string,
        queryKey: string
    ): object;
    getErrorNotification(xhr: XMLHttpRequest, errorText: string): object | null;
    defaultErrorMessage(xhr: XMLHttpRequest, errorText: string): object | null;
    getErrorNotificationFallback(e: Error): object | null;
    executeRequest(
        successCallback: (r: any) => void,
        errorCallback: () => void,
        params?: object,
        dataKey?: string,
        argumentsKey?: string,
        queryKey?: string,
        byUrl?: boolean
    ): ApiRequest;
    handleSuccessNotification(
        response: any,
        status: number
    ): object | null;
    handleError(
        notify: object | null,
        errorCallback: (xhr: XMLHttpRequest) => void,
        xhr: XMLHttpRequest,
        errorText: string
    ): void;
    bind(
        obj: any,
        item: string | [string, string][],
        rerender?: boolean,
        cb?: Function
    ): ApiRequest;
    toBind(response: any): void;
    resetBindErrors(): void;
    toBindErrors(response?: object): void;
    withValidateForm(
        obj: any,
        item?: string,
        key?: string
    ): ApiRequest;
    withoutNotify(callback?: (status: number) => boolean): ApiRequest;
}

// Define the Api class type with all static methods
declare class Api {
    static debug: boolean;
    static requestClass: any;
    static tokenResolver: () => Promise<string | null>;
    static domainResolver: () => string;

    static getArg(controller: string, action: string, arg: string, data?: Record<string, any>): ApiRequest;
    static postArg(controller: string, action: string, arg: string, data?: Record<string, any>): ApiRequest;
    static putArg(controller: string, action: string, arg: string, data?: Record<string, any>): ApiRequest;

    static getUrl(url: string, data?: Record<string, any>): ApiRequest;
    static postUrl(url: string, data?: Record<string, any>): ApiRequest;
    static putUrl(url: string, data?: Record<string, any>): ApiRequest;

    static get(controller: string, action: string, data?: Record<string, any>): ApiRequest;
    static post(controller: string, action: string, data?: Record<string, any>): ApiRequest;
    static put(controller: string, action: string, data?: Record<string, any>): ApiRequest;
    static delete(controller: string, action: string, id: string, data?: Record<string, any>): ApiRequest;

    static encodeQueryString(params: Record<string, any>): string;
    static logRequest(request: {
        url: string;
        method: string;
        data?: Record<string, any>;
        params?: Record<string, any>;
        headers?: Record<string, any>;
    }): void;

    static makeRequest(params: {
        url: string;
        method: string;
        data?: Record<string, any>;
        params?: Record<string, any>;
        headers?: Record<string, any>;
        success?: (response: any, status: number, xhr: any) => void;
        error?: (xhr: any, statusCode: number, statusText: string) => void;
    }): Promise<any>;
}

declare class Builder {
    static availableMethod: string[];

    query: Array<Record<string, any>>;

    constructor();

    add(method: string, args: any[]): Builder;

    toArray(): Array<Record<string, any>>;

    // Define dynamic method signatures for available methods
    select(...args: any[]): Builder;
    where(...args: any[]): Builder;
    orWhere(...args: any[]): Builder;
    whereDate(...args: any[]): Builder;
    orWhereDate(...args: any[]): Builder;
    whereYear(...args: any[]): Builder;
    orWhereYear(...args: any[]): Builder;
    whereMonth(...args: any[]): Builder;
    orWhereMonth(...args: any[]): Builder;
    has(...args: any[]): Builder;
    whereIn(...args: any[]): Builder;
    orWhereIn(...args: any[]): Builder;
    whereNotIn(...args: any[]): Builder;
    orWhereNotIn(...args: any[]): Builder;
    whereHas(...args: any[]): Builder;
    orWhereHas(...args: any[]): Builder;
    whereHasMorph(...args: any[]): Builder;
    orWhereHasMorph(...args: any[]): Builder;
    whereDoesntHave(...args: any[]): Builder;
    orWhereDoesntHave(...args: any[]): Builder;
    whereNull(...args: any[]): Builder;
    orWhereNull(...args: any[]): Builder;
    whereNotNull(...args: any[]): Builder;
    orWhereNotNull(...args: any[]): Builder;
    orderBy(...args: any[]): Builder;
    groupBy(...args: any[]): Builder;
    with(...args: any[]): Builder;
    withCount(...args: any[]): Builder;
    offset(...args: any[]): Builder;
    limit(...args: any[]): Builder;
    distinct(...args: any[]): Builder;
    owner(...args: any[]): Builder;
    whereAbs(...args: any[]): Builder;
}

interface Target {
    state: Record<string, any>;
    setState(callback: (prevState: Record<string, any>) => Record<string, any>, onSuccess?: () => void): void;
}

declare class Binding {
    target: Target;
    pathTarget: string[];
    pathData: string[];
    callback?: () => void;
    rerender: boolean;

    constructor(
        target: Target,
        pathTarget: string,
        pathData: string,
        rerender: boolean,
        onSuccess?: () => void
    );

    fire(data: Record<string, any>): void;

    getData(value: Record<string, any>): any;
}

declare class ApiProxy {

}

interface Query {
    orderBy(field: string, direction: string): Query;
    where(field: string, operator: string, value: any): Query;
    // Define other methods as required
}

interface OptionData {
    value: string;
    method?: (query: Query, value: string) => void;
    field?: string;
    operator?: string;
}

interface Options {
    [key: string]: OptionData;
}

// Declare the UrlBind class
declare class UrlBind {
    static parse: boolean;

    static order(query: Query, options: { value: string }): Query;

    static filter(query: Query, options: Options): Query;

    static getParams(query: Query, options: Options): Query;

    static urlParse(obj: Record<string, OptionData>): void;
}

// If necessary, export the types for external usage
export { ApiRequest, Api, Builder, Binding, ApiProxy, UrlBind, Query, OptionData, Options };