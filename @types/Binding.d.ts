declare module 'laravel-request' {
    interface Target {
        state: Record<string, any>;

        setState(
            callback: (prevState: Record<string, any>) => Record<string, any>,
            onSuccess?: () => void
        ): void;
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
}
