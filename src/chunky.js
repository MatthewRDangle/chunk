"use strict"; //Changes accepted "bad syntax" into real errors.

//====================================================================
// Chunky
//====================================================================

/*
 * Constructor: Chunk
 * 
 * @param name string - A unique name for this chunk describing it's most basic function. (ex. Card, Button, Linger, preview, tile, libraryItem).
 * @param type string - default is 'component' (web component). Write to this if needed, to better describe your component (ex. structure, container, global).
 * @param prefix string - default is 'chunk'. This is the first class to be added to the class name of this component.
*/
function chunk (name, type, prefix) {

	/* Validate and Assign Name for Chunk. */
	if (!name || typeof name !== 'string')
		throw Error('A chunk must be given a name.');
	this.name = name;

	/* Assign default ClassName prefix if none exists. */
	if (!prefix)
		this.prefix = 'chunk';
	else
		this.prefix = prefix;
	
	/* Validate and Assign Type for Chunk. */
	if (!type || typeof type !== 'string' )
		this.type = 'component'; // Default Value for Chunk.
	else
		this.type = type;
	
	/* Create a modification tree. */
	this.mods = {};
	
	/* Create place holder for build controls. */
	this.build = null;
}

/*
 * Method: Add Modification.
 * Description: Add an attribute to the HTML.
 */
chunk.prototype.createMod = function(name, value, container) {
	
	/* Check to see if name will be placed inside container. */
	if (container && typeof container === "string") {
		
		/* Create the container is the container does not already exist. */
		if (!this.mods[container])
			this.mods[container] = {};
		
		/* Add mod to container. */
		var container = this.mods[container];
		container[name] = value;
	}

	/* Add mod to the base if it does not exist. */
	this.mods[name] = value;
}
	
/* 
 * Method: Print.
 * Description: Render legible HTMl text.
*/
chunk.prototype.print = function(string) {
	
	/* Get a String if it does not exist. */
	if (!string)
		string = this.build(this).outerHTML;
	
	/* Return legible HTML. */
	return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* 
 * Method: Render
 * Description: Send the chunk to the browser for rendering.
*/
chunk.prototype.render = function(chunk) {
	if (!chunk || !chunk.type)
		chunk = this;
		
	/* Check to see if build is set up correctly. */
	if (typeof chunk.build !== 'function') {
		throw Error('There are no build instructions for ' + chunk.prefix + ' ' + chunk.name);
		return ''; /* Leave the function and don't attempt to build. */
	}

	/* Return build. */
	return chunk.build(chunk);
}