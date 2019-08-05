# Chunky ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)


## What is Chunky?
A constructor object for writing reusable, readable, and reliable javascript markup. It's compatible with any javascript library or framework. 

Chunky was built to support all modern browsers, from IE 11 onward, Chrome, Safari, Firefox and Edge. No polyfills required. fire 


## How does it work?
A constructor object called Chunk is the gateway to writing modular and reusable HTML markup. Just write <code> var newChunk = new chunk("chunk name"); </code> to create a new chunk. With <code> newChunk </code> you will write build instructions using the build function, <code> newChunk.build(func) </code>. When ready to render, use the ready function, <code> newChunk.ready() </code>, to retrieve compiled code. 


## How is chunky different?
Chunky handles variables, validation, copies, templates, and documentation for you. This means the code you write is reusable, readable, an
d reliable.

## Installation
The easiest and quickest way to install Chunky is to download the project and link to the source files. Their are two source files, JavaScript and CSS.

<pre>
&lt;link rel="stylesheet" type="text/css" href="src/chunky.css"&gt;
&lt;script src="src/chunky.js"&gt;&lt;/script&gt;
</pre>


## Documentation
The only documentation available for Chunky is the inline comments served inside the javascript file. Every line and function is well documented for crisp and clear instructions. If you need more assistance, the demo.html provides a better understanding of the use case for each function.

At some point, this information will be available in the repository's wiki. Just not at this time.


## Getting Help
If you have any issue using Chunky, or would like to provide feedback, post an issue on github.


## Versioning
Chunky will be maintained under these versioning guidelines as much as possible. Releases will be numbered with the following format:

`<major>.<minor>.<path>`

And constructed with the following guidelines:
+ Breaking backwards compatibility bumps the major (and resets the minor and patch).
+ New additions to functionality without breaking backward compatibility bumps the minor (and resets the patch).
+ Bug fixes and misc changes bumps the patch.
