//====================================================================
// METHODS FOR CHUNK
//====================================================================

/* 
 * Object to remember all methods for Chunky. 
 * Wrapped function around methods to protect global space.
*/
var chunky = {};
(function() {

	/*
	 * The Chunk Web Component Prototype Constructor.
	*/
	chunky.constructor = function (name, type, prefix) {
		
		/* Validate and Assign Name for Chunk. */
		if (!name || typeof name !== 'string')
			throw Error('A chunk must be given a name.');
		this.name = name;

		/* Validate and Assign Type for Chunk. */
		if (!type || typeof type !== 'string' )
			this.type = 'component'; // Default Value for Chunk.
		else
			this.type = type;
		
		/* Assign default prefix is none exists. */
		if (!prefix)
			this.prefix = 'chunk';
		else
			this.prefix = prefix;
		
		/* Create a container to hold attributes. */
		this.attr = {};	
		
		/* Enable Build Controls */
		this.build = null;
	}
	
	/* Enable Rendering */
	chunky.constructor.prototype.render = function() {
		
		/* Check to see if build is set up correctly. */
		if (typeof this.build !== 'function') {
			throw Error('There are no build instructions for chunk');
		}
		
		/* Return build. */
		return this.build();
	}
})