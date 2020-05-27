var vars = {
	js_source: '/src/chunky.js',
	templates: {
		
		siteHeader: (function() {
			
			// Create A Template Chunk.
			var template = new Chunk('Site Header');
			template.doc.info('desc', 'A section header to clearly communicate the following information intended purpose.');
			template.instruct(function(chunk) {
				
				// Create an element to contain everything for the build.
				var element = document.createElement('div');
				element.classList.add('siteHeader');
				
				// Attach a span tag inside the site header.
				var span = document.createElement('span');
				var text = document.createTextNode(chunk.data('text').getValueIUR(''));
				chunk.data('text').doc.info('desc', 'Text to be inserted into the header.');
				span.appendChild(text);
				element.appendChild(span);

				// Return build.
				return element;
			})
			return template;
			
		})(),
		
		siteBody: (function() {
			
			// Create A Template Chunk.
			var template = new Chunk('Site Body');
			template.doc.info('desc', 'A section header to clearly communicate the following information intended purpose.');
			template.instruct(function(chunk) {
				
				// Create an element to contain everything for the build.
				var element = document.createElement('div');
				element.classList.add('siteBody');
				
				// Retrieve all children & write documentation.
				chunk.data('children').doc.info('desc', 'Children JavaScript node objects stored in an Array.');
				chunk.data('children').doc.info('typeof', 'object');
				chunk.data('children').doc.info('varient', 'array');
				var data_children = chunk.data('children'); // Retrieve the children data object.
				var array_children = data_children.getValueIUR([]); // If no children are found, return an empty array object.

				// Make sure the object is an array before proceeding.
				if (typeof array_children == 'object' && array_children.length && array_children.length > 0) {
					
					// Loop through array of children and attach them in order to the DOM.
					for (var idx = 0; idx < array_children.length; idx++) {
						
						// Retrieve the js_node, validate it, and attach it to the DOM.
						var js_node = array_children[idx];
						if (typeof js_node == 'object' && js_node.tagName) {
							element.appendChild(js_node);
						}
					}
				}

				// Return build.
				return element;
			})
			return template;
			
		})()
	}
};