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
function chunk (name, options) {

	// Validate and Assign Name for Chunk.
	if (!name || typeof name !== 'string')
		throw Error('A chunk must be given a name.');
	this.name = name;

	// Assign default ClassName prefix if none exists.
	if (!options)
		this.prefix = 'chunk';
	else
		this.prefix = prefix;
	
	// Validate and Assign Type for Chunk.
	if (!options.type || typeof options.type !== 'string' )
		this.type = 'component'; // Default Value for Chunk.
	else
		this.type = type;
	
	// Create a modification tree.
	this.mods = {};
	
	// Create a substitution tree.
	this.subs = {};
	
	// Create place holder for build controls.
	this.build = null;
}

/*
 * Method: Add Modification.
 * Description: Add an attribute to the HTML.
 * 
 * @param name string - The object key reference for this modification.
 * @param value unset - The value of the modification.
 * @param container string - Sub object tree for organized storage.
 */
chunk.prototype.createMod = function(name, value, container) {

	// Check to see if modification
	if (!name || typeof name !== 'string')
		throw Error('A new modification must have a name of type String.');
	
	// Check to see if name will be placed inside container.
	if (container && typeof container === "string") {
		
		// Create the container is the container does not already exist.
		if (!this.mods[container])
			this.mods[container] = {};
		
		// Check to see if container is not an existing mod.
		if (typeof this.mods[container] !== 'object') {
			throw Error('A mod storage container can not have the same name as a mod.');
		}
		else {
			
			// Add mod to container.
			var container = this.mods[container];
			container[name] = value;	
		}
	}

	// Add mod to the base if it does not exist.
	this.mods[name] = value;
}

	
/* 
 * Method: Print.
 * Description: Render legible HTMl text.
*/
chunk.prototype.print = function(string) {
	
	// Get a String if it does not exist.
	if (!string)
		string = this.build(this).outerHTML;
	
	// Return legible HTML.
	return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* 
 * Method: Render
 * Description: Send the chunk to the browser for rendering.
*/
chunk.prototype.render = function(chunk) {
	if (!chunk || !chunk.type)
		chunk = this;
		
	// Check to see if build is set up correctly.
	if (typeof chunk.build !== 'function') {
		throw Error('There are no build instructions for ' + chunk.prefix + ' ' + chunk.name);
		return ''; // Leave the function and don't attempt to build.
	}

	// Return build.
	return chunk.build(chunk);
}

/*
 * Method: Sub
 * Description: Creates a variable inside the build function.
 */
chunk.prototype.sub = function(name) {

	//Check if name exists.
	if (!name && typeof name !== 'string') { throw Error('To create a sub, the sub must have a name of type string.'); }
	else {
		//Add name to subs tree if it doesn't already exist.
		if (this.subs.hasOwnProperty(name)) {
			this.sub[name] = undefined;
		}
	}
}