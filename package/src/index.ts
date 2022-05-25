export type FormDataFieldValue = string | File | Blob;

export interface IOptions {
  headers?: Record<string, string>;
  onprogress?: (event: ProgressEvent) => any;
  username?: string | null;
  password?: string | null;
  timeoutMillis?: number;
}

// Based on https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type CancelablePromise<T> = Promise<T> & { cancel: () => any };

interface IMultiPartResponse {
  httpStatus: number;
  responseText: string;
  aborted: boolean;
}

export function sendMultiPart(
  endpoint: string,
  formPayload: Record<string, string | File | Blob>,
  options: IOptions = {}
) {
  const formData = new FormData();

  // Attach all files and field values
  for (const field in formPayload) {
    formData.append(field, formPayload[field]);
  }

  // Create & start async POST request
  const xhr = new XMLHttpRequest();

  // Docs - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
  xhr.open(
    "POST",
    endpoint,
    true /* <- makes it async*/,
    options.username,
    options.password
  );

  //In Internet Explorer, the timeout property may be set only after calling the open() method and before calling the send() method.
  if (options.timeoutMillis && options.timeoutMillis > 0) {
    xhr.timeout = options.timeoutMillis;
  }

  if (options.headers) {
    for (const header in options.headers) {
      // "content-type" doesn't work well with xhr - http://www.olioapps.com/blog/formdata-fetch-gotchas/
      if ("content-type" !== header.toLowerCase()) {
        xhr.setRequestHeader(header, options.headers[header]);
      }
    }
  }
  if (options.onprogress) {
    xhr.upload.onprogress = options.onprogress;
  }

  const responsePromise: PartialBy<
    CancelablePromise<IMultiPartResponse>,
    "cancel"
  > = new Promise((resolve, reject) => {
    xhr.onreadystatechange = (_e) => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
          resolve({
            httpStatus: xhr.status,
            responseText: xhr.responseText ?? "",
            aborted: xhr.status === 0,
          });
        } else {
          reject(xhr.statusText);
        }
      }
    };
  });

  responsePromise.cancel = () => {
    if (
      xhr.readyState !== XMLHttpRequest.DONE &&
      xhr.readyState !== XMLHttpRequest.UNSENT
    ) {
      xhr.abort();
    }
  };

  // Kick off the actual form submission
  xhr.send(formData);

  // Return the promise so the caller can await
  return responsePromise as CancelablePromise<IMultiPartResponse>;
}
