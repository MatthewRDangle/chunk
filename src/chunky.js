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
	 * @param: name : string : required : A unique name for this chunk describing it's most basic function. (ex. Card, Button, Linger, preview, tile, libraryItem).
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

		// Documentation container.
		this.doc = new Doc('this');
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
	 * 
	 * @param: path : string : required : The path to the data object found in the chunk. Use "/" to path to the data variable. 
	 * @param: value : string : optional : Associate a value with the data variable.
	 * 
	 * @return: data : object : always : The data variable.
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

			// Get data object from path.
			if (value === undefined) {
				data = data.getValue(directory);
				if (pathArray.length - 1 == idx)
					return data;
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

	/**
	 * Function: Data
	 * Access: Public
	 * Type: Method
	 * For: Chunk
	 * Description: Retrieve the data object.
	 * 
	 * @param: name : string : required : A name for this chunk.
	 * 
	 * @return: chunk : object : always : A duplicate chunk object, unique without reference.
	 */
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
	 * 
	 * @param: blueprints : function : required : A function containing build instructions for rendering.
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
	 * 
	 * @return: Output : n/a : always : Returns whatever is returned by blueprint function. This is stored in output.
	 */
	Chunk.prototype.ready = function() {
		
		// Compile chunk.
		if (!this.compiled)
			return this.compile();
		else
			return this.output;
	}

				
	/**
	 * Function: Clone.
	 * Access: Private.
	 * Type: Function
	 * For: Clone.
	 * Description: Copy all object properties and values without reference.
	 * 
	 * @param original anything - [Required] - The thing which to copy.
	 * 
	 * @return: clone : n/a : always : Returns a deep copy of whatever is passed through. Unique, no references.
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
	 * For: Data
	 * Description: A container to house internal chunk variables.
	 * 
	 * @param: path : string : required : The location the object is stored inside the data tree.
	 * @param: type : string : required : The type of data object. Can be either "container" or "variable".
	 * 
	 * @return: Data : object : always : The data variable object.
	 */
	var Data = function(path, type) {

		// Data reference information.
		if (typeof path !== 'string')
			throw Error ('The typeof name is required to be a string value.');
		else {
			
			// Set the name.
			var pathArray = pathToArray(path);
			this.name = pathArray[pathArray.length - 1];

			// Set the path.
			this.path = path;
		}

		// House the type of object for reference.
		if (typeof type !== 'string')
			throw Error ('The typeof type is required to be a string value.');
		else if (type === 'variable' || type === 'container')
			this.type = type;
		else
			throw Error ('The type must either be variable or container.');

		// The mod value for this function.
		if (type === 'container')
			this.value = {};
		else
			this.value = undefined;
		
		// Documentation Container.
		this.doc = new Doc(path);
	}

	/**
	 * Function: Add Child
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Appends a data variable as a child. Converts this data variable to a container if not already.
	 * 
	 * @param: name : string : required : The name of the child data variable.
	 * @param: type : string : required : The type of data object. Can be either "container" or "variable".
	 * 
	 * @return: Data : object : always : The data variable object.
	 */
	Data.prototype.addChild = function(name, type) {
		if (this.type !== 'container')
			this.convertToContainer();

		if(this.value.hasOwnProperty(name))
			return null;
		else if (type === 'variable' || type === 'container')
			this.value[name] = new Data(this.path + '/' + name, type);
		else
			this.value[name] = new Data(this.path + '/' + name, 'variable');

		return this.value[name];
	}

	/**
	 * Function: Convert to Container
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Converts the data variable to a container type. Will erase the data associated with variable type.
	 */
	Data.prototype.convertToContainer = function() {
		this.type = 'container';
		this.value = {};
	}

	/**
	 * Function: Convert to Variable
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Converts the data variable to a variable type. Will erase the data associated with container type.
	 */
	Data.prototype.convertToVariable = function() {
		this.type = 'variable';
		this.value = undefined;
	}

	/**
	 * Function: Get Value
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Retrieves the value of the Data variable.
	 * 
	 * @param: subValue : string : optional : If the data variable is a "container", use this to retrieve a child.
	 * 
	 * @return: n/a : n/a : always : What ever is stored as the "value" of this data variable.
	 */
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
	
	/**
	 * Function: Has Value
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Retrieves the value of the Data variable.
	 * 
	 * @param hasValue : n/a : required : Checks if this "hasValue" is === to data value. This is type strict.
	 * 
	 * @reutrn hasValue : boolean : always : True of false if the value is their.
	 */
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

	/**
	 * Function: Set Value
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Sets the value of the data variable.
	 * 
	 * @param value : n/a : required : The value to store in this data variable.
	 */
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
	 * For: Doc
	 * Description: The documentation constructor to house all information elements.
	 * 
	 * @path path : string : required : The path reference to it's parent.
	 * 
	 * @return Doc : object : always : The documentation object.
	 */
	var Doc = function(path) {

		// A container to hold reference to the object which it describes.
		if (path && typeof path === 'string')
			this.for = path;
		else
			throw Error('The path to the parent is required');
	}

	/**
	 * Function: Info
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Adds information to the documentation object.
	 * 
	 * @param name : string : required : The name of the information to set or retrieve.
	 * @param stringValue : string : optional : The optional value of the information.
	 * 
	 * @return info : string : sometimes : returns if the value is present.
	 * @return null : null : sometimes : returns if the value is unable to be found.
	 */
	Doc.prototype.info = function(name, stringValue) {
		
		// Throw Errors for invalid use.
		if (!name)
			throw Error('A name and a string value are required.');

		else if (name === 'string')
			throw Error ('A name must be of type string.');
			
		else if (name === 'info' || name === 'for')
			throw Error('The name parameter can not be "info" or "for".');

		//If stringValue exists, set the value for the doc. Otherwise return the value with the same name.
		if (typeof stringValue === 'string') {
			this[name] = stringValue;
		}	
		else if (this.hasOwnProperty(name)) {
			return this[name];
		}
		else
			return null;
	}

	/**
	 * Function: Path To Array.
	 * Access: Private
	 * Type: Method
	 * For: None
	 * Description: Converts a string path into an array by seperating each data point with a '/'. Ex: fee/foo/fum
	 * 
	 * @param path : string : required : The string path; follows the data tree pathing with "/" seperating each data variable.
	 *
	 * @return path : array : always : Converts the string path to an array path so it may be looped through.
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