# Chunky
A constructor object for writing reusable, readable, and reliable javascript markup. It's compatible with any javascript library or framework.

## How does it work?
A constructor method called Chunk is the gateway to writing modular and reusable HTML markup. Just write <code> var newChunk = new chunk("chunk name"); </code> to create a new chunk. With <code> newChunk </code> you will write build instructions using the build function, <code> newChunk.build(func) </code>. When ready to ready, use the ready function, <code> newChunk.ready() </code>, to execute the build function. This compiles the code and return the result. 

## How is chunky different?
Chunky handles variables, validation, copies, templates, and documentation for you. This means the code you write is reusable, readable, and reliable.
