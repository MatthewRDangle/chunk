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
		var output = this.blueprints(this);
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
	Chunk.prototype.data = function(path, value) {
		
		// If path doesn't exist, error.
		if (!path)
			throw Error('A path must exist.');

		// If Path is not of type string, error.
		else if (typeof path !== 'string')
			throw Error('A path must be a string.');

		// Convert path into a path array.
		var pathArray = pathToArray(path);

		// Loop through path array to find or create data objects.
		var data = this.dataTree;
		for (var idx = 0; idx < pathArray.length; idx++) {

			// Get path directory.
			var directory = pathArray[idx];

			// Get value from path.
			if (value === undefined) {
				data = data.getValue(directory);

				// Return null if not found.
				if (data == null)
					return data;
				else if (pathArray.length - 1 == idx)
					return data.getValue();
			}
			
			// Set the value. If directory doesn't exist, create it.
			else {
				if (data.hasValue(directory)) {
					data = data.getValue(directory);
					if (pathArray.length - 1 == idx)
						data.setValue(value);
				}
				else {
					if (pathArray.length - 1 != idx)
						data = data.addChild(directory, 'container');
					else {
						var child = data.addChild(directory, 'variable');
						child.setValue(value);
					}
				}
			}
		}

		if (value === undefined)
			return data;
	}

	Chunk.prototype.duplicate = function(name) {

		//Create a New Chunk
		var duplicate_chunk = new Chunk(name, {
			type: this.type,
			prefix: this.prefix
		})

		// Modify duplicates properties to match the original.
		duplicate_chunk.dataTree = clone(this.dataTree);
		duplicate_chunk.blueprints = this.blueprints;
		if (this.compiled)
			duplicate_chunk.compile();

		// Return duplicate
		return duplicate_chunk;
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
	 * Method: Clone Object.
	 * Access: Private.
	 * Description: Copy all object properties and values without reference.
	 * 
	 * @param original anything - [Required] - The thing which to copy.
	 */
	var clone = function(original) {

		// If the clone is an object, clone this way...
		if (typeof original === 'object') {
			
			// Set base clone object.
			var clone_obj = {};

			// Loop through object and clone all object properties.
			for (var i in original) {
				
				// Retrieve property and value.
				var property = i;
				var value = original[i];
				
				// Ensure property is unique to original.
				if (original.hasOwnProperty(property))
					clone_obj[property] = clone(original[property]);
			}

			// Copy prototype function
			clone_obj.__proto__ = original.__proto__;

			// Returned cloned object.
			return clone_obj;
		}
		
		// If the clone is an array, clone this way...
		else if (typeof original === '[object Array]') {
			
			// Set base clone object.
			var clone_array = {};
			
			// Loop through object and clone all array properties.
			for (var i = 0; i < original.length; i++) {
				clone_obj[i] = clone(original[i]);
			}
			
			// Returned cloned array.
			return clone_array;
		}
		
		// Anything else, return the original.
		else
			return original;
	}

	/**
	 * Function: Data
	 * Access: Public
	 * Type: Constructor
	 * For: This
	 * Description: ...
	 */
	var Data = function(name, type) {
		
		// House the mod name for reference.
		if (typeof name !== 'string')
			throw Error ('The typeof name is required to be a string value.');
		else	
			this.name = name;

		// House the type of object for reference.
		if (typeof type !== 'string')
			throw Error ('The typeof type is required to be a string value.');
		else if (type === 'variable' || type === 'container')
			this.type = type;
		else
			throw Error ('The type must either be variable or container.');

		// Logic for mod location inside of the mod tree.
		this.path = undefined;

		// The mod value for this function.
		if (type === 'container')
			this.value = {};
		else
			this.value = undefined;
	}

	Data.prototype.addChild = function(name, type) {
		if (this.type !== 'container')
			this.convertToContainer();

		if(this.value.hasOwnProperty(name))
			return null;
		else if (type === 'variable' || type === 'container')
			this.value[name] = new Data(name, type);
		else
			this.value[name] = new Data(name, 'variable');

		return this.value[name];
	}

	Data.prototype.convertToContainer = function() {
		this.type = 'container';
		this.value = {};
	}

	Data.prototype.convertToVariable = function() {
		this.type = 'variable';
		this.value = undefined;
	}

	Data.prototype.getValue = function(subValue) {
		if (typeof subValue === 'string') {
			if (this.value.hasOwnProperty(subValue))
				return this.value[subValue];
			else
				return null;
		}	
		else
			return this.value;
	}
	
	Data.prototype.hasValue = function(value) {
		if (!value)
			return null;

		else if (this.type === 'container')
			return this.value.hasOwnProperty(value);

		else {
			if (this.value === value)
				return true;
			else
				return false;
		}
	}

	Data.prototype.setValue = function(value) {
		if (!value)
			throw Error ('A value must be passed through to set it to data object ' + this.path);

		else if (this.type === 'variable')
			this.value = value;
		
		else
			throw Error ("Can't set the value of a container data object for " + this.path);
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

	/**
	 * Function: Path To Array.
	 * Access: Private
	 * Type: Method
	 * For: None
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

}())