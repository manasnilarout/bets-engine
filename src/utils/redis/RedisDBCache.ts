export interface ICache {
    get: (key: string | string[]) => Promise<string | { key: string, value: string }[] | void>;
    set: (key: string, value: any) => Promise<void>;
}
