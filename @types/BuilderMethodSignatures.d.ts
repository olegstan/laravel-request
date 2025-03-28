// BuilderMethodSignatures.d.ts

declare module 'laravel-request' {
    /**
     * Общий набор "флюентных" методов,
     * которые динамически навешиваются и на Builder, и на ApiRequest.
     *
     * Все они возвращают `this`, чтобы цепочки методов (fluent API) типизировались правильно:
     * - в Builder методы будут возвращать Builder,
     * - в ApiRequest – ApiRequest.
     */
    export interface BuilderMethodSignatures {
        select(...args: any[]): this;
        where(...args: any[]): this;
        orWhere(...args: any[]): this;
        whereDate(...args: any[]): this;
        orWhereDate(...args: any[]): this;
        whereYear(...args: any[]): this;
        orWhereYear(...args: any[]): this;
        whereMonth(...args: any[]): this;
        orWhereMonth(...args: any[]): this;
        has(...args: any[]): this;
        whereIn(...args: any[]): this;
        orWhereIn(...args: any[]): this;
        whereNotIn(...args: any[]): this;
        orWhereNotIn(...args: any[]): this;
        whereHas(...args: any[]): this;
        orWhereHas(...args: any[]): this;
        whereHasMorph(...args: any[]): this;
        orWhereHasMorph(...args: any[]): this;
        whereDoesntHave(...args: any[]): this;
        orWhereDoesntHave(...args: any[]): this;
        whereNull(...args: any[]): this;
        orWhereNull(...args: any[]): this;
        whereNotNull(...args: any[]): this;
        orWhereNotNull(...args: any[]): this;
        orderBy(...args: any[]): this;
        groupBy(...args: any[]): this;
        with(...args: any[]): this;
        withCount(...args: any[]): this;
        offset(...args: any[]): this;
        limit(...args: any[]): this;
        distinct(...args: any[]): this;
        owner(...args: any[]): this;
        whereAbs(...args: any[]): this;
    }
}
