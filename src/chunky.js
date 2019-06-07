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
	//Does options exist. 
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
}

//Protect global space and separate privately accessible methods from public access.
(function(){
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
			throw Error('In order to convert, their must be a string parameter.');
		
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
	 * Method: Create Modification.
	 * Access: Public.
	 * Description: Add an attribute to the HTML.
	 * 
	 * @param name string - The object key reference for this modification.
	 * @param value unset - The value of the modification.
	 * @param path string - The location of where to store the mod.
	 */
	chunk.prototype.createMod = function(name, value, path) {

		// Check to see if name exists.
		if (!name || typeof name !== 'string')
			throw Error('A new modification must have a name of type String.');
		
		// Check to see if value exists.
		if (!value)
			throw Error('A value must exist to create a mod');
		
		// Store mod at path location.
		if (path && typeof path === 'string') {
			var pathArray = parsePath(path);
			var parent = this.mods;
			
			// Store mod in that path.
			for (var i in pathArray) {
				
				// Create the child if it doesn't already exist.
				if (!parent.hasOwnProperty(pathArray[i]))
					parent[pathArray[i]] = {};
				
				// Change parent
				parent = parent[pathArray[i]];
			}
			
			// Only create a new mod if the mod doesn't already exist.
			if (parent.hasOwnProperty(name))
				throw Error('A modification with this name already exists.');
			else
				parent[name] = value;
		}
		// Store mod at base if no path.
		else {
			
			// Only create a new mod if the mod doesn't already exist.
			if (this.mods.hasOwnProperty(name))
				throw Error('A modification with this name already exists.');
			else
				this.mods[name] = value;
		}
	}
	
	/**
	 * Method: Get Modification.
	 * Access: Public.
	 * Description: Retrieves a mod value.
	 * 
	 * @param name string - The name of the mod to acquire.
	 * @param path string - The container path to the mod.
	 */
	function getMod(name, path) {
		
		// Check to see if name exists.
		if (!name || typeof name !== 'string')
			throw Error('A new modification must have a name of type String.');
		
		// Check to see if path exists.
		if (!path || typeof path !== 'string')
			throw Error('A new modification must have a name of type String.');
		
		// Store mod at path location.
		if (path && typeof path === 'string') {
			var pathArray = parsePath(path);
			var parent = this.mods;
			
			// get parent container.
			for (var i in pathArray) {
				
				// If parent does not exist return null.
				if (!parent.hasOwnProperty(pathArray[i]))
					return null
				
				// Change parent
				parent = parent[pathArray[i]];
			}
			
			// Return property value if it exists.
			if (parent.hasOwnProperty(name))
				return parent[name]
			else
				return null
		}
	}
	
	/**
	 * Method: Set Modification.
	 * Access: Public.
	 * Description: Retrieves a mod value.
	 * 
	 * @param name string - The name of the mod to acquire.
	 * @param path string - The container path to the mod.
	 */
	function setMod(name, path, value) {
		
		// Check to see if name exists.
		if (!name || typeof name !== 'string')
			throw Error('A new modification must have a name of type String.');
		
		// Check to see if path exists.
		if (!path || typeof path !== 'string')
			throw Error('A new modification must have a name of type String.');
		
		// Store mod at path location.
		if (path && typeof path === 'string') {
			var pathArray = parsePath(path);
			var parent = this.mods;
			
			// get parent container.
			for (var i in pathArray) {
				
				// If parent does not exist return null.
				if (!parent.hasOwnProperty(pathArray[i]))
					return null
				
				// Change parent
				parent = parent[pathArray[i]];
			}
			
			// Return property value if it exists.
			if (parent.hasOwnProperty(name))
				parent[name] = value;
		}
	}

		
	/** 
	 * Method: Print.
	 * Access: Public.
	 * Description: Render legible HTMl text.
	*/
	chunk.prototype.print = function(string) {
		
		// Get a String if it does not exist.
		if (!string)
			string = this.build(this).outerHTML;
		
		return parseHTMLSpChr(string);
	}

	/** 
	 * Method: Render
	 * Access: Public.
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
})();