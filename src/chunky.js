//====================================================================
// METHODS FOR CHUNK
//====================================================================

/*
 * The Chunk Web Component Prototype Object.
*/
function Chunk(name, type) {
	
	/* Initialize Base Attributes */
	if (!name || typeof name !== 'string')
		throw Error('A chunk must be given a name.');
	this.name = name;

	if (!type || typeof type !== 'string' )
		this.type = 'component';
	else
		this.type = type;
	
	/* Enable Rendering */
	this.render = function() {
		var chunk = document.createElement("div");
		chunk.className = this.name;
		return chunk;
	}
}