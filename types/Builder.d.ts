export default class Builder {
    static availableMethod: string[];
    query: any[];
    add(method: any, args: any): this;
    toArray(): any[];
}
