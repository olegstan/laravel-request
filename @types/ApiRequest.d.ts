
declare module 'laravel-request' {
    // @ts-ignore
    import * as axios from "axios/index";

    export class ApiRequest extends BuilderMethodSignatures{
        url: string;
        source: any;
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

        first(
            successCallback?: (response: { data: any; result: string; meta?: any }) => void,
            errorCallback?: (xhr: XMLHttpRequest, responseData: any) => void,
            finalCallback?: () => void
        ): any;

        all(
            successCallback?: (response: { data: any; result: string; meta?: any }) => void,
            errorCallback?: (xhr: XMLHttpRequest, responseData: any) => void,
            finalCallback?: () => void
        ): any;

        paginate(
            page?: number,
            perPage?: number,
            successCallback?: (response: { data: any; result: string; meta?: any }) => void,
            errorCallback?: (xhr: XMLHttpRequest, responseData: any) => void,
            finalCallback?: () => void
        ): any;

        pluck(
            fields: any,
            successCallback?: (response: { data: any; result: string; meta?: any }) => void,
            errorCallback?: (xhr: XMLHttpRequest, responseData: any) => void,
            finalCallback?: () => void
        ): ApiRequest;

        getUrl(): string;

        getSource(): axios.CancelTokenSource | null;

        call(
            successCallback?: (response: { data: any; result: string; meta?: any }) => void,
            errorCallback?: (xhr: XMLHttpRequest, responseData: any) => void,
            finalCallback?: () => void,
            params?: object,
            dataKey?: string,
            argumentsKey?: string,
            queryKey?: string,
            byUrl?: boolean
        ): ApiRequest;

        callSync(
            successCallback?: (response: { data: any; result: string; meta?: any }) => void,
            errorCallback?: (xhr: XMLHttpRequest, responseData: any) => void,
            finalCallback?: () => void
        ): ApiRequest;

        callUrl(
            successCallback?: (response: { response: { data: any; result: string; meta?: any } }) => void,
            errorCallback?: (xhr: XMLHttpRequest, responseData: any) => void,
            finalCallback?: () => void,
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

        getErrorNotification(
            xhr: XMLHttpRequest,
            errorText: string
        ): object | null;

        defaultErrorMessage(
            xhr: XMLHttpRequest,
            errorText: string
        ): object | null;

        getErrorNotificationFallback(e: Error): object | null;

        executeRequest(
            successCallback: (response: { data: any; result: string; meta?: any }) => void,
            errorCallback: (xhr: XMLHttpRequest, responseData: any) => void,
            finalCallback?: () => void,
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
            errorCallback: (xhr: XMLHttpRequest, responseData: any) => void,
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
}
