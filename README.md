# Modern Multi Part

Simple and modern API for multipart requests from the **browser**. Monitor upload progress and cancel on demand.

- [x] No dependencies;
- [x] 100% TypeScript;
- [x] Returns a promise (`async`/`await` friendly);
- [x] Cancel in-progress requests;
- [x] Monitor upoad progress;
- [x] Wraps [native browser API](XMLHttpRequest);
- [x] Sandbox example with [React & react-dropzone](https://codesandbox.io/s/festive-lumiere-uys3jn?file=/src/App.tsx:99-112);
- [x] Framework agnostic.

Checkout the [CodeSandbox Demo](https://codesandbox.io/s/festive-lumiere-uys3jn?file=/src/App.tsx:99-112) (`React` & `react-dropzone`).

## Installation

npm:

```bash
npm install modern-multi-part
```

Browser:

```html
<!-- Creates a global function "ModernMultiPart.sendMultiPart" -->
<script
  type="text/javascript"
  src="https://unpkg.com/modern-multi-part/dist/index.js"
></script>
```

The library is packaged as a [UMD module](https://github.com/umdjs/umd). To build it from code:

```bash
npm run package
```

## Code Example

```typescript
// If you're using npm:
import { sendMultiPart } from "modern-multi-part";
// If you imported via script in HTML
const sendMultiPart = ModernMultiPart.sendMultiPart;

// Sample files - you would usually get that from an input field
const file = new File(["foo"], "foo.txt", { type: "text/plain" });

// Returns a normal promise you can await.
// Monitor progress with the "onprogress" callback
const resultPromise = sendMultiPart(
  "https://httpbin.org/post",
  { file, textField: "sample-text" },
  {
    onprogress: (pe: ProgressEvent) =>
      console.log(Math.floor((pe.loaded / pe.total) * 100, "%"),
  }
);

// The promise has additional "cancel" method
// Typically, this is used from a cancel button onClick callback
resultPromise.cancel() // <-- will cancel operation

resultPromise.then(result => {
  // Prints server response - e.g. 200
  console.log(result.httpStatus);
  // Prints response text (e.g. JSON response)
  console.log(result.responseText);
  // Prints whether the operation was aborted/cancelled using the "cancel" method
  console.log(result.aborted);
})
```

## API

The library introduces a single function `sendMultiPart` with the following params:

- `endpoint` - the URL where the form will be submitted;
- `formPayload` - they payload as an object/record;
- `options` - additional options documented below.

The supported options are:

| Name            | Type                                                                                                                     | Default | Sample Value                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | :-----: | :--------------------------------------------------- |
| `headers`       | object / key value pairs                                                                                                 |  `{}`   | `{Authorization: "Bearer secret-token"}`             |
| `onprogress`    | [ProgressEvent](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) handler                                  | `null`  | `(e) => console.log(pe.loaded / pe.total * 100, "%)` |
| `username`      | string for [server auth](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open)                           | `null`  |
| `password`      | string for [server auth](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open)                           | `null`  |
| `timeoutMillis` | number for [connection timeout](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout) in milliseconds | `null`  | 10000                                                |

Calling the function returns a `CancelablePromise`, which is a normal promise
with an additional method `cancel`. Calling `cancel` will abort
an ongoing request.

If the multi-part request is successfull, the promise resolves with a
result in the format:

```
{
  httpStatus: number;
  responseText: string;
  aborted: boolean;
}
```

<!--
# Git Who Am I:
git config user.name
git config user.email
cat .git/config

# Set Who I am:
git config user.name "geo-systems"
git config user.email "geo.systems.developer@gmail.com"
git remote set-url origin https://geo-systems@github.com/geo-systems/modern-multi-part.git
Github Tokens - https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

# Build
npm install && npm run build:umd
rm -rf dist && npm run build:umd && npm pack

# Deploy
npm login
> geo-systems
npm run package # Test deployment locally
npm run package && npm publish

# Demo:
https://codesandbox.io/s/festive-lumiere-uys3jn?file=/src/App.tsx
 -->
