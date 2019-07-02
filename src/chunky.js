"use strict"; //Converts "bad syntax" into real errors.

//====================================================================
// Chunky
//====================================================================

/**
 * Constructor: Chunk
 * 
 * @param name string - A unique name for this chunk describing it's most basic function. (ex. Card, Button, Linger, preview, tile, libraryItem).
 * @param options.type string - default is 'component' (web component). Write to this if needed, to better describe your component (ex. structure, container, global).
 * @param options.prefix string - default is 'chunk'. This is the first class to be added to the class name of this component.
*/
function chunk (name, options) {
	
	// Does options exist. 
	if (!options)
		options = {};

	// Validate and Assign Name for Chunk.
	if (!name || typeof name !== 'string')
		throw Error('A chunk must be given a name.');
	this.name = name;

	// Assign default ClassName prefix if none exists.
	if (!options.prefix)
		this.prefix = 'chunk';
	else
		this.prefix = options.prefix;

	// Validate and Assign Type for Chunk.
	if (!options.type || typeof options.type !== 'string' )
		this.type = 'component'; // Default Value for Chunk.
	else
		this.type = type;
	
	// Create a modification tree.
	this.mods = {};
	
	// Create place holder for build controls.
	this.build = null;
	
	// Compiled data and validation.
	this.isCompiled = false;
	this.dataCompiled = null;
}

//Protect global space and separate privately accessible methods from public access.
(function(){
	
	/**
	 * Key: Parse Path.
	 * Access: Public.
	 * Description: Repository Component Identification: Used for internal reference and validation.
	*/ 
	chunk.prototype.RCID = 'chunky'
		
		
		
		
		
	/**
	 * Method: Nav Path.
	 * Access: Private.
	 * Description: Navigates through an objects properties to a specific location.
	 * 
	 * @param path string - The string path using backslash "/" to the mod property.
	 * @param obj obj - The object to navigate.
	 * @param setPath boolean - Whether or not the path should be set along the way: True or False.
	 * @return value variable - The property value of the object after looping through it.
	 */
	var navPath = function(path, obj, setPath) {
		//Set the base of the obj as parent for initial loop.
		var parent = obj;
		
		// Convert path to an array for loop.
		var pathArray = []
		if (typeof path !== 'array')
			pathArray = parsePath(path);
		else
			pathArray = path;
		
		// Loop through the object based on the path.
		for (var i in obj) {
			
			// If property does not exist return null or create a container placeholder.
			if (!parent.hasOwnProperty(pathArray[i])) {
				if (setPath) {
					parent.pathArray[i] = {};
				}
				else {
					return null	
				}
			}
			
			// Change parent
			parent = parent[pathArray[i]];
		}
		
		// return the foudn obj property value.
		return parent;
	}
	
	/**
	 * Method: Parse Path.
	 * Access: Private.
	 * Description: Search the string for path names separated by a slash (ex. /) and returns and returns an array with the path name in order.
	 * 
	 * @param path string - The string path with names separated with a slash (ex. /).
	 * @return path array[string] - The sequential order of path names as strings.
	 */
	var parsePath = function(path) {
		
		// Ensure path is a string value.
		if (!path || typeof path !== 'string')
			throw Error('A path must be of type String.');
		
		// Parse the Path into an array.
		var array = path.split('/');

		// Return the array in sequential order.
		return array;
	}
	
	/**
	 * Method: Parse HTML Special Characters.
	 * Access Private.
	 * Description: Convert special characters into an HTML Entity.
	 * 
	 * @param string string - The string which to convert.
	 */
	var parseHTMLSpChr = function(string) {
		
		// Check for string.
		if (!string || typeof string !== 'string')
			throw Error('In order to convert, their must be a string parameter of type string.');
		
		// Return with cnoverted special characters.
		return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	
	/**
	 * Method: ValidateJSONname.
	 * Access: Private.
	 * Description: Ensures the JSON property name is an acceptable.
	 * 
	 * @param string string - The string value to check if it's capable of being a JSON key without errors.
	 * @return validation boolean - A true or false value indicating if the string passed. True is valid, false is invalid.
	 */
	var validateJSONkey = function(string) {
		
		// Ensure path is a string value.
		if (!string || typeof string !== 'string')
			throw Error('The parameter must be of type string.');
		
		// Set Invalid Array
		var invalid = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '$', '%', '-', '+', '"', "'", '^', '#']
		
		// If any invalid characters are found, return false, other return true;
		for (var i in invalid) {
			var validate = invalid[i];
			
			if (string.indexOf(validate) >= 0)
				return false;
			else
				return true;
		}
	}

	
	
	
	
	/** 
	 * Method: Compile
	 * Access: Public.
	 * Description: Run the build function and convert the data into the chunk logic properties.
	*/
	chunk.prototype.compile = function(chunk) {
		if (!chunk || !chunk.type)
			chunk = this;
			
		// Check to see if build is set up correctly.
		if (typeof chunk.build !== 'function') {
			throw Error('There are no build instructions for ' + chunk.prefix + ' ' + chunk.name);
			return ''; // Leave the function and don't attempt to build.
		}

		// Return compiled data from build function the data was returned.
		var dataCompiled =  chunk.build(chunk);
		if (!dataCompiled) {
			throw Error ('No data was returned from chunk ' + chunk.name + ' build function. Please add a return statement to return all data to be rendered.');
		}
		else {
			this.dataCompiled = dataCompiled;
			this.isCompiled = true;
			return this.dataCompiled;
		}
			
		
		
	}
	
	/**
	 * Method: Mod
	 * Access: Public.
	 * Description: Modifies or retrieves a mod from the mods object.
	 * 
	 * @param path string - [Required] - The string path using backslash "/" to the mod property.
	 * @param value string - [Optional]- To set the mods value.
	*/
	chunk.prototype.mod = function(path, value) {
		
		// Check to see if path exists.
		if (!path || typeof path !== 'string')
			throw Error('The path to the mod is required as the first parameter.');
		
		// Turn the path into an array and retrieve the mods object as the parent.
		var parent = this.mods;
		
		// Navigate to the mods' container and retrieve the mod value or set it's value.
		if (value) {
			// Convert string path to array.
			var pathArray = parsePath(path);
			
			// navigate to mods parent container.
			var modPath = new Array(pathArray);
			var modParent = navPath(modPath.pop(), parent, true);
			
			// Retrieve mod value from od parent.
			if (modParent.hasOwnProperty(pathArray[pathArray.length - 1])) {
				modParent[pathArray[pathArray.length - 1]] = value;
				return true;
			}
		}
		else
			return navPath(path, parent);
	}

		
	/** 
	 * Method: Print.
	 * Access: Public.
	 * Description: Compile the chunk into legible HTMl text.
	*/
	chunk.prototype.print = function(string) {
		
		// Parse string then print.
		return parseHTMLSpChr(string);
	}
})();