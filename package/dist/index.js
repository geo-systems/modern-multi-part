(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ModernMultiPart = {}));
})(this, (function (exports) { 'use strict';

    function sendMultiPart(endpoint, formPayload, options = {}) {
        const formData = new FormData();
        // Attach all files and field values
        for (const field in formPayload) {
            formData.append(field, formPayload[field]);
        }
        // Create & start async POST request
        const xhr = new XMLHttpRequest();
        // Docs - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
        xhr.open("POST", endpoint, true /* <- makes it async*/, options.username, options.password);
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
        const responsePromise = new Promise((resolve, reject) => {
            xhr.onreadystatechange = (_e) => {
                var _a;
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
                        resolve({
                            httpStatus: xhr.status,
                            responseText: (_a = xhr.responseText) !== null && _a !== void 0 ? _a : "",
                            aborted: xhr.status === 0,
                        });
                    }
                    else {
                        reject(xhr.statusText);
                    }
                }
            };
        });
        responsePromise.cancel = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE &&
                xhr.readyState !== XMLHttpRequest.UNSENT) {
                xhr.abort();
            }
        };
        // Kick off the actual form submission
        xhr.send(formData);
        // Return the promise so the caller can await
        return responsePromise;
    }

    exports.sendMultiPart = sendMultiPart;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
