# Chunky ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
* [What is Chunky?](#what-is-chunky)
* [How does it work?](#how-does-it-work)
* [How is Chunky different?](#how-is-chunky-different)
* [Installation](#installation)
* [Documentation](#documentation)
* [Getting Help](#getting-help)
* [Versioning](#versioning)

## What is Chunky?
A constructor object for writing reusable, readable, and reliable JavaScript markup. It's compatible with any javascript library or framework. 

Chunky was built to support all modern browsers, from IE 11 onward, Chrome, Safari, Firefox and Edge. No polyfills required. fire 


## How does it work?
A constructor object called Chunk is the gateway to writing modular and reusable JavaScript markup. Just write <code>var newChunk = new chunk("chunk name");</code> to create a new chunk. With <code> newChunk </code> you will write build instructions using the <code>instruct</code> function, <code>newChunk.instruct(func)</code>. When ready to render, use the ready function, <code>newChunk.ready()</code>, to retrieve compiled code. 


## How is chunky different?
Chunky handles the storage of variables, documentation and instructions for rendering for you. This means the code you write is reusable, readable, and reliable.

## Installation
The easiest and quickest way to install Chunky is to download the project and link to the source file.

<pre>
&lt;link rel="stylesheet" type="text/css" href="src/chunky.css"&gt;
</pre>


## Documentation
The only documentation available for Chunky is the inline comments served inside the JavaScript file. Every line and function is well documented for crisp and clear instructions. If you need more assistance, the demo directory provides multiple demos for a better use case for each function.

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
