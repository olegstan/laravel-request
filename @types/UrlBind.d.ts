declare module 'laravel-request' {
    interface Query {
        orderBy(field: string, direction: string): Query;
        where(field: string, operator: string, value: any): Query;
        // Добавляйте остальные методы по необходимости
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

    export class UrlBind {
        static parse: boolean;

        static order(query: Query, options: { value: string }): Query;

        static filter(query: Query, options: Options): Query;

        static getParams(query: Query, options: Options): Query;

        static urlParse(obj: Record<string, OptionData>): void;
    }
}
