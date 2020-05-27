// Render innerHTML content.
var root_node = document.getElementById('root');

// Build a site header.
var chunk_siteHeader = vars.templates.siteHeader.duplicate('siteHeader');
chunk_siteHeader.data('text', 'Chunky');
root_node.appendChild(chunk_siteHeader.ready());

// Build a site body.
var chunk_siteBody = vars.templates.siteBody.duplicate('siteBody');
chunk_siteBody.data('children', (function() {
	
	// Build children.
	var array_children = [];
	
	// Build Basics H1.
	var basics_h_node = document.createElement('h1');
	basics_h_node.innerHTML = 'Basics';
	array_children.push(basics_h_node);

	// Build Basics Paragraph.
	var basics_p_node = document.createElement('p');
	basics_p_node.innerHTML = 'Chunky is constructor object for writing reusable, readable, and reliable JavaScript markup. The library was built' +
		'to <strong>support all</strong> JS libraries, <strong>all</strong> modern browsers, from IE 11 onward, Chrome, Safari,' +
		'Firefox and Edge. No polyfills required.';
	array_children.push(basics_p_node);
	
	// Build Getting Started H1.
	var getting_started_h_node = document.createElement('h2');
	getting_started_h_node.innerHTML = 'Getting Started';
	array_children.push(getting_started_h_node);
	
	// Build Getting Started Paragraph.
	var basics_p_node = document.createElement('p');
	basics_p_node.innerHTML = 'The easiest way to try out Chunky is to just link to the chunky.js file. The path to it can be found here: "' + vars.js_source + '"';
	array_children.push(basics_p_node);
	
	// Build Hello World H1.
	var hello_world_h_node = document.createElement('h2');
	hello_world_h_node.innerHTML = 'Hello World';
	array_children.push(hello_world_h_node);
	
	// Build Hello World Paragraph 1.
	var hello_world_p_node = document.createElement('p');
	hello_world_p_node.innerHTML = "Let's start as small as we can. Render some text on the screen. Type out the code below, you will learn better.";
	array_children.push(hello_world_p_node);
	
	// Build Hello World Paragraph 2.
	var hello_world_code_node = document.createElement('p');
	hello_world_code_node.innerHTML = 'var demo = new Chunk("demo"); <br/> demo.instruct(function(chunk) {<br/>&emsp;return "Hello World" <br/>})<br/> var root = document.body; <br/> root.innerHTML = demo.ready();';
	array_children.push(hello_world_code_node);
	
	// Build Hello World Paragraph 3.
	var hello_world_p2_node = document.createElement('p');
	hello_world_p2_node.innerHTML = 'As you can see, what was returned inside the instruct method function is what was rendered onto the screen.';
	array_children.push(hello_world_p2_node);
	
	// Line Break.
	array_children.push(document.createElement('hr'));
	
	// Build Core Elements H1.
	var core_elements_h_node = document.createElement('h2');
	core_elements_h_node.innerHTML = 'Core Elements';
	array_children.push(core_elements_h_node);
	
	// Build Hello World Paragraph 3.
	var core_elements_p_node = document.createElement('p');
	core_elements_p_node.innerHTML = 'There are two core methods for a Chunk. The first one is ".ready()" and the other ".instruct(f(...))".' +
	'The ready method executes the instruct method and passes the chunk object through as parameter. The value returned via instruct ' +
	'is retrieved and compiled in the chunk. This compiled object is then return by the ready method.';
	array_children.push(core_elements_p_node);
	
	// Store value in chunk siteBody.
	return array_children;
})());
root_node.appendChild(chunk_siteBody.ready());