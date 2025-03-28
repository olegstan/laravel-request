declare module 'laravel-request' {
    export interface Builder extends BuilderMethodSignatures {}
    export class Builder {
        static availableMethod: string[];

        query: Array<Record<string, any>>;

        constructor();

        add(method: string, args: any[]): Builder;

        toArray(): Array<Record<string, any>>;
    }
}
