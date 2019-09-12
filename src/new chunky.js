"use strict"; //Converts "bad syntax" into real errors.

//====================================================================
// Chunky
//====================================================================

// Placeholder.
var Chunk = undefined;

//Protect global space and separate privately accessible methods from public access.
(function() {

	/**
	 * Function: Chunk
	 * Access: Public
	 * Type: Constructor
	 * For: This
	 * Description: The main constructor object to create a modulized source of HTML.
	 * 
	 * Param: name : string : required : A unique name for this chunk describing it's most basic function. (ex. Card, Button, Linger, preview, tile, libraryItem).
	 */ 
	Chunk = function(name) {

		// Validate and Assign Name for Chunk.
		if (!name || typeof name !== 'string')
			throw Error('A chunk must be given a name.');
		this.name = name;

		// Container object to hold the blue instructions of the chunk.
		this.blueprints = null;

		// A boolean to indicate whether the latest blueprints code has been executed and placed into the output.
		this.compiled = false;

		// Container tree to hold all data.
		this.dataTree = new Data('d', 'container');

		// The output variable to hold the executed blueprints code.
		this.output = null;
	}

	/**
	 * Function: Compile
	 * Access: Public
	 * Type: Method
	 * For: Chunk
	 * Description: Executes the blueprints function and returns the compiled code into the output storage variable.
	 */
	Chunk.prototype.compile = function() {
		
		// Check to see if blueprints is a function.
		if (typeof this.blueprints !== 'function') {
			throw Error('There are no blueprints for ' + this.name);
		}

		// Return compiled data from blueprints function.
		var output = this.blueprints(output);
		if (!output) {
			throw Error ('No data was returned from chunk ' + this.name + ' blueprints function. Please add a return statement to return all data to be rendered.');
		}
		else {
			this.output = output;
			this.compiled = true;
			return this.output;
		}
	}

	/**
	 * Function: Data
	 * Access: Public
	 * Type: Method
	 * For: Chunk
	 * Description: Retrieve the data object.
	 */
	Chunk.prototype.data = function(path, create) {
		
		// If path doesn't exist, error.
		if (!path)
			throw Error('A path must exist.');

		// If Path is not of type string, error.
		else if (typeof path === 'string')
			throw Error('A path must be a string.')

		// If create is anthing but true, set to false.
		if (!create)
			create = false;

		// Convert path into a path array.
		var pathArray = pathToArray(path);
		
		// Loop through path array to find or create data objects.
		var data = this.dataTree;
		for (var idx = 0; idx < pathArray.length; idx++) {
			var name = pathArray[idx];
		}
	}

	/**
	 * Function: Instruct
	 * Access: Public
	 * Type: Method
	 * For: Chunk
	 * Description: Enables the user to add build instructions, known as blueprints, to the chunk object for compilation.
	 */
	Chunk.prototype.instruct = function(blueprints) {

		// Push blueprints into the chunk.
		this.blueprints = blueprints;
	}

	/**
	 * Function: Path To Array.
	 * Access: Private
	 * Type: Method
	 * For: Chunk
	 * Description: Converts a string path into an array by seperating each data point with a '/'. Ex: fee/foo/fum
	 */
	var pathToArray = function(path) {
		
		// Ensure path is a string value.
		if (!path || typeof path !== 'string')
			throw Error('A path must be of type String.');
		
		// Parse the Path into an array.
		var array = path.split('/');

		// Return the array in sequential order.
		return array;
	}

	/**
	 * Function: Ready
	 * Access: Public
	 * Type: Method
	 * For: Chunk
	 * Description: Ensures the output is up to date before returning it.
	 */
	Chunk.prototype.ready = function() {
		
		// Compile chunk.
		if (!this.compiled)
			return this.compile();
		else
			return this.output;
	}

	/**
	 * Function: Data
	 * Access: Public
	 * Type: Constructor
	 * For: This
	 * Description: A chunks variable object for parameter control.
	 */
	var Data = function(name, type) {
		
		// House the mod name for reference.
		this.name = name;

		// Data type.
		this.type = type;

		// Logic for mod location inside of the mod tree.
		this.path = '';

		// The mod value for this function.
		this.value = '';
	}

	/**
	 * Function: Doc
	 * Access: Public
	 * Type: Constructor
	 * For: This
	 * Description: ...
	 */
	var Doc = function() {
		
		// A general description or purpose of the object.
		this.info = '';

		// A container to hold reference to the object which it describes.
		this.for = '';
	}

}())