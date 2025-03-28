declare module 'laravel-request' {
    export class Api {
        static debug: boolean;
        static requestClass: any;
        static tokenResolver: () => Promise<string | null>;
        static domainResolver: () => string;

        static getArg(controller: string, action: string, arg: string|number, data?: Record<string, any>): ApiRequest;

        static postArg(controller: string, action: string, arg: string|number, data?: Record<string, any>): ApiRequest;

        static putArg(controller: string, action: string, arg: string|number, data?: Record<string, any>): ApiRequest;

        static getUrl(url: string, data?: Record<string, any>): ApiRequest;

        static postUrl(url: string, data?: Record<string, any>): ApiRequest;

        static putUrl(url: string, data?: Record<string, any>): ApiRequest;

        static get(controller: string, action: string, data?: Record<string, any>): ApiRequest;

        static post(controller: string, action: string, data?: Record<string, any>): ApiRequest;

        static put(controller: string, action: string, data?: Record<string, any>): ApiRequest;

        static delete(controller: string, action: string, id: string|number, data?: Record<string, any>): ApiRequest;

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
}
