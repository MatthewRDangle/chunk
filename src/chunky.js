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
		var output = undefined;
		
		// Attempt to compile.
		try { output = this.blueprints(this); }
		catch (error) { throw Error(error); }
		
		// If the output was returned, store it under output.
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
	 * Function: Detect Data
	 * Access: Public.
	 * Type; Method
	 * For: Chunk
	 * Description: Retrieve all applicable data objects.
	 * 
	 * @param: returnType : string : optional : Can be "variable" or "container". This will return the correct type of data. Leave absent to return everything.
	 * 
	 * @return: data : array : always : A list of all data found within the system.
	 */
	Chunk.prototype.detectData = function(returnType) {
		
		// Retrieve all top level data.
		var detectedData = [];
		var d = this.dataTree;
		loopData(d); // Start loop at top level 'd' data.
		return detectedData;
		
		/*
		 * Title: Loop Data
		 * Description: Retrieve all applicable data objects and store in "detectedData" array.
		 */
		function loopData(data) {
			if (returnType === data.type || !returnType)
				detectedData.push(data);
			
			// If the data is a container, retrieve the values inside the array, then loop again for each data.
			if (data.type === 'container') {
				// Retrieve all children Data.
				for (var key in data.getValue()) {
					
					// Retrieve a child data & pass into loopData function.
					var childData = data.getValue(key);
					loopData(childData);
				}
			}
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
		
		// If "d" is the first path, remove it. This is because d is the start of the data tree.
		if (pathArray[0] == 'd') {
			pathArray.splice(0, 1);
		}

		// Loop through path array to find or create data objects.
		var data = this.dataTree;
		for (var idx = 0; idx < pathArray.length; idx++) {

			// Get path directory.
			var directory = pathArray[idx];
			
			// If directory does exist, retrieve it.
			if (data.hasValue(directory)) {
				data = data.getValue(directory);
				
				// Check if this is the latest data in the path.
				if (pathArray.length - 1 == idx) {
					
					// If their is a value passed through. Attached the value to the data.
					if (value) {
						data.setValue(value);
						
						this.compiled = false; // Reset Compiled Flag.
					}
				}
			}
			
			// If the directory does not exist, create it, and retrieve it.
			else {
				
				// Check if this is the last directory in the path. If not, create a data container.
				if (pathArray.length - 1 != idx)
					data = data.addChild(directory, 'container');
				
				// If the latest directory in the path, insert a value for it.
				else {
					var data = data.addChild(directory, 'variable');
			
					// If no value is passed through. Insert value, 'undefined'.
					if (value === undefined) {
						data.setValue(undefined);
					}

					// If their is a value passed through. Attached the value to the data.
					else {
						data.setValue(value);
						
						this.compiled = false; // Reset Compiled Flag.
					}
				}
			}
		}

		return data;
	}

	/**
	 * Function: Data
	 * Access: Public
	 * Type: Method
	 * For: Chunk
	 * Description: Retrieve the data object.
	 * 
	 * @param: name : string : optional : A name for this chunk.
	 * 
	 * @return: chunk : object : always : A duplicate chunk object, unique without reference.
	 */
	Chunk.prototype.duplicate = function(name) {
		
		// If name doesn't exist, use existing.
		if (!name)
			name = this.name;
		
		// Create a New Chunk
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
		
		// Reset Compiled Flag.
		this.compiled = false;
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
		
		// Flags object.
		this.flags = {
			required: false, // Makes a value required before compiling.
			typeLock: false // Forces the value type to match.
		}
		
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
	 * Function: Get Value If Undefined Return
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Retrieves the value of the Data variable. If the value is undefined, return the value inside the parameter.
	 *
	 * @param iur_value : n/a : optional : The value to return if the data value is "undefined".
	 * 
	 * @return value : n/a : sometimes : The value retrieve via getValue, if getValue is undefined, returns the iur_value.
	 * @return iur_value : n/a : sometimes : If getValue is undefined, returns the iur_value.
	 */
	Data.prototype.getValueIUR = function(iur_value) {
		
		// Get a value from this data element.
		var value = this.getValue();
		
		// Check if it's undefined or null. If it is, return the iur_value. If not, return the data value.
		if (value == undefined) {
			return iur_value;
		}
		else
			return value;
	}
	
	/**
	 * Function: Has Value
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Checks if the value is associated with this Data object.
	 * 
	 * @param value : n/a : required : Checks if this "value" is === to the data value. This is type strict.
	 * 
	 * @return hasValue : boolean : always : True or false if the value is there.
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
	 * Function: Required
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Sets this data as required. The compiler will not finish compiling.
	 *
	 * [Prototype] 
	 */
	Data.prototype.required = function() {
		this.flags.required = true; // Set the required flag to true.
		
		// Enforce by throwing error if value is not found.
		if (typeof this.value === 'undefined' || this.value === null)
			throw Error (this.name + ' data ' + this.type + ' must have a value. Path = ' + this.path);
		
		return this; // Return the Chunk so the user may chain flags.
	}

	/**
	 * Function: Set Value
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Sets the value of the data variable.
	 *
	 * @param value : n/a : required : The value to apply to this data object.
	 */
	Data.prototype.setValue = function(value) {

		if (value === null && typeof value !== 'undefined')
			throw Error ('A value must be passed through to set it to data object ' + this.path);

		else if (this.type === 'variable')
			this.value = value;
		
		else
			throw Error ("Can't set the value of a container data object for " + this.path);
	}
	
	/**
	 * Function: Type Lock
	 * Access: Public
	 * Type: Method
	 * For: Data
	 * Description: Restricts the value to be a particular type. (IE typeof).
	 * 
	 * @param type_of : string : required : The typeof value to check.
	 * 
	 * [Prototype]
	 */
	Data.prototype.typeLock = function(type_of) {
		
		// If type_of exists, lock it.
		if (type_of && typeof type_of === 'string')
			this.flags.typeLock = type_of;
		
		// Compare and error if it doesn't work.
		if (typeof this.value !== type_of)
			throw Error ('The value of data ' + this.type + ' ' + this.name + ' does not match the typeLock value ' + this.flags.typeLock + '. Path = ' + this.path)
	
		return this; // Return the Chunk so the user may chain flags.
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
