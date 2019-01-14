//DOM patches
Node.prototype.getAttributeNames = Node.prototype.getAttributeNames || function() {
	var y = this;
	return Object.keys(y.attributes).map(function(x) {
		return y.attributes[x].name
	})
}

// DOM Addons
// index is optional, if < 0 then returns the full array, otherwise, the
// position in the provided index
Node.prototype.childrenByTag = function(tag, index) {
	if (typeof index == 'undefined')
		index = -1
	var self = this
	if (self.tagMap) {
		if (index <= -1)
			return self.tagMap[tag]
		if (self.tagMap[tag])
			return self.tagMap[tag][index]

		return null;
	}

	// if here, then initiate the map
	self.tagMap = {}
	var children = $(self).children();
	children.each(function(c) {
		self.tagMap[children[c].tagName] = self.tagMap[children[c].tagName] || []
		self.tagMap[children[c].tagName].push(children[c])
	})

	// now we're sure the map has been initiated
	return self.childrenByTag(tag, index)
}

Node.prototype.isTag = function(tag) {
	var self = this
	return (self.tagName == tag)
}

Node.prototype.eachTag = function(tag, func) {
	var self = this
	if (self.childrenByTag(tag)) {
		self.childrenByTag(tag).map(function(n) {
			func(n)
		})
	}
}

// ------------------ Table helpers ----------------------

function td_with_element(elem) {
	var cell = document.createElement("td");
	cell.appendChild(elem)
	return cell
}

function td_with_text(text, span) {
	span = span || 1
	var cell = document.createElement("td");
	cell.innerHTML = text.replace(/\n/g, "\n<br/>")
	if (span > 1)
		cell.setAttribute("colspan", span)
	return cell
}

function blue_td_with_text(text, span) {
	span = span || 1
	var cell = td_with_text(text, span)
	cell.setAttribute("class", "blue_bg");
	return cell
}

function gray_td_with_text(text, span) {
	span = span || 1
	var cell = td_with_text(text, span)
	cell.setAttribute("class", "gray_bg");
	return cell
}

function tableRow(headers) {
	var row = document.createElement("tr");

	// header row
	for (str_cnt in headers) {
		var cell = document.createElement("td");
		cell.innerHTML = headers[str_cnt];
		row.appendChild(cell)
	}
	return row
}


function gen_suffix() {
	return (new Date() * Math.ceil((Math.random() * 1000000)))
}

/**
	This function is used instead of URLSearchParams.get() for IE compatibility.
*/
function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
// --------------------- AimaraJS extentions ------------------------

function onNodeSelect(tree_node) {
	var obj = tree_node.obj
	div_main.innerHTML = ""

	console.info(tree_node.type)
	console.info(drawers)
	// this variable will contain a list of function to be executed after the
	// drawer_func has been called
	post_draw = []

	var drawer_func = drawers[tree_node.type]
	if (typeof drawer_func == 'undefined')
		drawer_func = drawers["default"]


		var nodePath = getUrlParameter("u");
		if (typeof nodePath !== "undefined" && nodePath !== tree_node.path) {
			var stateObj = {};
			history.pushState(stateObj, tree_node.path, "?u=" + tree_node.path+"&cit="+curr_image_type);
		}

	drawer_func(tree_node)


	for (p in post_draw) {
		post_draw[p]()
	}
}
