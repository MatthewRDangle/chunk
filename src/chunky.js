"use strict"; //Changes accepted "bad syntax" into real errors.

//====================================================================
// METHODS FOR CHUNK
//====================================================================

/* 
 * Object to remember all methods for Chunky. 
 * Wrapped function around methods to protect global space.
*/
var chunk = {};
(function() {

	/*
	 * Constructor.
	 * The Chunk Web Component Prototype Constructor.
	 * 
	 * @param name string - A unique name for this chunk describing it's most basic function. (ex. Card, Button, Linger, preview, tile, libraryItem).
	 * @param prefix - default is 'chunk'. This is the first class to be added to the class name of this component.
	 * @param type string - default is 'component' (web component). Write to this if needed, to better describe your component (ex. structure, container, global).
	*/
	chunk.constructor = function (name, prefix, type) {

		/* Validate and Assign Name for Chunk. */
		if (!name || typeof name !== 'string')
			throw Error('A chunk must be given a name.');
		this.name = name;

		/* Assign default prefix is none exists. */
		if (!prefix)
			this.prefix = 'chunk';
		else
			this.prefix = prefix;
		
		/* Validate and Assign Type for Chunk. */
		if (!type || typeof type !== 'string' )
			this.type = 'component'; // Default Value for Chunk.
		else
			this.type = type;
		
		/* Create a container to hold attributes. */
		this.attr = {};	
		
		/* Create a modification tree. */
		this.mods = {
			variables: [],
			locals: [],
			globals: []
		};
		
		/* Enable Build Controls. */
		this.instruction = function(tag, attr, children) {
			
			/* Construct Parent */
			var container = document.createElement('div');
			main.appendChild(text);
		}
		this.build = null;
	}
	
	/* 
	 * Enable Rendering 
	*/
	chunk.constructor.prototype.render = function() {
		
		/* Check to see if build is set up correctly. */
		if (typeof this.build !== 'function') {
			throw Error('There are no build instructions for ' + this.prefix + ' ' + this.name);
			return; /* Leave the function and don't attempt to build. */
		}

		/* Return build. */
		return this.build();
	}
}())