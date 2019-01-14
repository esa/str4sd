
function processYear(parent_node,year,data){
	var new_node = parent_node.createChildNode(year, false, "res/icons/fff/calendar.png",null,null);
	new_node.type = "year"

	for(var d in data){
		processMonth(new_node,d,data[d])
	}

}

function processMonth(parent_node,month,data){
	var new_node = parent_node.createChildNode(month, false, "res/icons/fff/calendar_view_day.png",null,null);
	new_node.type = "month"
	for(var i = 0; i < data.length; i++){
		processCapture(new_node,data[i])
	}
}

function processCapture(parent_node,data){
	var node_name = data["1st PUS packet timestamp"]
	var new_node = parent_node.createChildNode(node_name, false, "res/icons/fff/camera.png",null,null);
	new_node.type = "capture"
	new_node.data = data
}

function processJSONFile(filepath,node_name) {
	tree.nameMap = tree.nameMap || {};

 	console.info("loading " + filepath);
	jQuery.ajaxSetup({async:false});

	var new_node =  tree.getNodeFromPath(node_name);

	if(new_node == null){
	  new_node = tree.createNode(node_name, false, "res/icons/fff/transmit_blue.png" ,	null, null, null);
	  new_node.type = "satellite";
	}

	$.getJSON(filepath, function(json) {
			for (var k in json){
				processYear(new_node,k,json[k]);
			}

	})//.fail(function(err){console.error(err)});

}

function selectNodeFromURL() {

	curr_image_type = getUrlParameter("cit") || "DIFF_PNG";
	var nodePath = getUrlParameter("u");
	console.info("selectNodeFromURL: " +nodePath)
	if (typeof nodePath !== "undefined") {
		tree.selectNodeFromPath(nodePath);
	}
}

window.onload = function() {
	tree = createTree('div_tree', 'white', null);
	div_tree = document.getElementById('div_tree');
	div_main = document.getElementById('div_main');

	tree.nodeSelectedEvent = onNodeSelect

//		tree.mouseOverNodeEvent 	= function (node, span) {hoverInToMiniview(node.xml_node,span) }
//		tree.mouseLeavesNodeEvent	= function (node, span) {hoverOutOfMiniview(node.xml_node,span) }

	processJSONFile("processed/SWA_processed_images_metadata.json","Swarm-A");
	processJSONFile("processed/SWB_processed_images_metadata.json","Swarm-B");
	processJSONFile("processed/SWC_processed_images_metadata.json","Swarm-C");

	processJSONFile("processed/SWA2018_processed_images_metadata.json","Swarm-A");
	processJSONFile("processed/SWB2018_processed_images_metadata.json","Swarm-B");
	processJSONFile("processed/SWC2018_processed_images_metadata.json","Swarm-C");

	tree.drawTree();
	div_tree.appendChild(tree_fragment)
	selectNodeFromURL();	
}


$(window).on("popstate", function(e) {
	selectNodeFromURL();
})
