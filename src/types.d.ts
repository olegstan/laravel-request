// Define an interface for the ApiRequest class

declare module 'laravel-request' {
    export class ApiRequest {
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
    export class Api {
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

        static get(controller: string, action: string, data?: Record<string, any>): ApiRequest|Builder;

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

    export class Builder {
        static availableMethod: string[];

        query: Array<Record<string, any>>;

        constructor();

        add(method: string, args: any[]): Builder;

        toArray(): Array<Record<string, any>>;

        // Define dynamic method signatures for available methods
        select(...args: any): Builder|ApiRequest;

        where(...args: any): Builder|ApiRequest;

        orWhere(...args: any): Builder|ApiRequest;

        whereDate(...args: any): Builder|ApiRequest;

        orWhereDate(...args: any): Builder|ApiRequest;

        whereYear(...args: any): Builder|ApiRequest;

        orWhereYear(...args: any): Builder|ApiRequest;

        whereMonth(...args: any): Builder|ApiRequest;

        orWhereMonth(...args: any): Builder|ApiRequest;

        has(...args: any): Builder|ApiRequest;

        whereIn(...args: any): Builder|ApiRequest;

        orWhereIn(...args: any): Builder|ApiRequest;

        whereNotIn(...args: any): Builder|ApiRequest;

        orWhereNotIn(...args: any): Builder|ApiRequest;

        whereHas(...args: any): Builder|ApiRequest;

        orWhereHas(...args: any): Builder|ApiRequest;

        whereHasMorph(...args: any): Builder|ApiRequest;

        orWhereHasMorph(...args: any): Builder|ApiRequest;

        whereDoesntHave(...args: any): Builder|ApiRequest;

        orWhereDoesntHave(...args: any): Builder|ApiRequest;

        whereNull(...args: any): Builder|ApiRequest;

        orWhereNull(...args: any): Builder|ApiRequest;

        whereNotNull(...args: any): Builder|ApiRequest;

        orWhereNotNull(...args: any): Builder|ApiRequest;

        orderBy(...args: any): Builder|ApiRequest;

        groupBy(...args: any): Builder|ApiRequest;

        with(...args: any): Builder|ApiRequest;

        withCount(...args: any): Builder|ApiRequest;

        offset(...args: any): Builder|ApiRequest;

        limit(...args: any): Builder|ApiRequest;

        distinct(...args: any): Builder|ApiRequest;

        owner(...args: any): Builder|ApiRequest;

        whereAbs(...args: any): Builder|ApiRequest;
    }

    interface Target {
        state: Record<string, any>;

        setState(callback: (prevState: Record<string, any>) => Record<string, any>, onSuccess?: () => void): void;
    }

    export class Binding {
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

    export class ApiProxy {

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
    export class UrlBind {
        static parse: boolean;

        static order(query: Query, options: { value: string }): Query;

        static filter(query: Query, options: Options): Query;

        static getParams(query: Query, options: Options): Query;

        static urlParse(obj: Record<string, OptionData>): void;
    }
}