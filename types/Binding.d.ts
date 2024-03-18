export default class Binding {
    constructor(target: any, pathTarget: any, pathData: any, rerender: any, onSuccess: any);
    target: any;
    pathTarget: any;
    pathData: any;
    callback: any;
    rerender: any;
    fire(data: any): void;
    getData(value: any): any;
}
