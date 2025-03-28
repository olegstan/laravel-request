declare module 'laravel-request' {
    export class Builder extends BuilderMethodSignatures{
        static availableMethod: string[];

        query: Array<Record<string, any>>;

        constructor();

        add(method: string, args: any[]): Builder;

        toArray(): Array<Record<string, any>>;
    }
}
