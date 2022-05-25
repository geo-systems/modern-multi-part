export declare type FormDataFieldValue = string | File | Blob;
export interface IOptions {
    headers?: Record<string, string>;
    onprogress?: (event: ProgressEvent) => any;
    username?: string | null;
    password?: string | null;
    timeoutMillis?: number;
}
declare type CancelablePromise<T> = Promise<T> & {
    cancel: () => any;
};
interface IMultiPartResponse {
    httpStatus: number;
    responseText: string;
    aborted: boolean;
}
export declare function sendMultiPart(endpoint: string, formPayload: Record<string, string | File | Blob>, options?: IOptions): CancelablePromise<IMultiPartResponse>;
export {};
//# sourceMappingURL=index.d.ts.map