function default_drawer(node, target_div) {
	target_div = target_div || div_main
	//console.info(node)
}

function capture_drawer(node, target_div) {
	target_div = target_div || div_main
	var data = node.data
	var tbl = document.createElement("table");
	var tblBody = document.createElement("tbody");

	var img = document.createElement("img");
	
	img.src = data["filepath"][curr_image_type]//.replace('\.','./processed')


	var imageTypes = data["filepath"];

	for(var itype in imageTypes){
		var button = document. createElement("button");
		button.innerHTML = itype;
		

		funcSetType = function(typeToSet){
			return function() {
				curr_image_type = typeToSet
				var stateObj = {};
				history.pushState(stateObj, node.path, "?u=" + node.path+"&cit="+curr_image_type);
				img.src = data["filepath"][curr_image_type]
			}
		}
 	
		button.addEventListener ("click", funcSetType(itype));

		target_div.appendChild(button);
	}
	target_div.appendChild(document.createElement("br"));


	for(var v in data){
		var row = document.createElement("tr");
		row.appendChild(blue_td_with_text(v))
		row.appendChild(td_with_text(node.data[v] + ""))
		tbl.appendChild(row)
	}

	//target_div.innerHTML = JSON.stringify(node.data)
	tbl.appendChild(tblBody)
	target_div.appendChild(img)
	target_div.appendChild(tbl)
}



drawers = {}
drawers["default"] = default_drawer
drawers["capture"] = capture_drawer

curr_image_type = curr_image_type || "PNG"
