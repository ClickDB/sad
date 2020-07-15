function TreeView(pContainer)
{
	this.container = document.getElementById(pContainer);
	if(this.container == null
		|| this.container.nodeType != 1)
	{
		throw new Error("Invalid container");
	}
	
	// Attributes
	this.name = this.container.id;
	this.top = 0;
	this.left = 0;
	this.height = 100;
	this.width = 100;
	
	this.nodeLeftOffset = 16;
	
	this.rootNode = new TreeNode();
	
	// Used by addElement(int)
	this.lastNode = null;
	
	this.node = null;
	this.rootNode.level = -1;
}

// Methods
TreeView.prototype.getRootNode = function()
{
	return this.rootNode;
}

TreeView.prototype.getElement = function(pIndex)
{
	var wIndex = -1;
	var wTreeView = this;
	
	this.node = null;
	
	function find(pNode)
	{
		for(var wNode = pNode.firstChild; wNode != null; wNode = wNode.nextSibling)
		{
			wIndex++;
			if(wIndex == pIndex)
			{
				wTreeView.node = wNode;
				return;
			}

			if(wNode.firstChild != null)
			{
				find(wNode);
			}
		}
	}
	
	find(this.getRootNode());
	
	return this.node;
}

TreeView.prototype.getElements = function()
{
	this.node = this.rootNode;
}

TreeView.prototype.next = function()
{
	if(this.node == null)
	{
		return false;
	}
	
	if(this.node.firstChild != null)
	{
		this.node = this.node.firstChild;
		return true;
	}
	
	if(this.node.nextSibling != null)
	{
		this.node = this.node.nextSibling;
		return true;
	}
	
	
	for(var wParent = this.node.parentNode; wParent != this.rootNode; wParent = wParent.parentNode)
	{
		if(wParent.nextSibling != null)
		{
			this.node = wParent.nextSibling;
			return true;
		}
	}
	
	return false;
}


TreeView.prototype.addElement = function(pParentNode,
                                         pCaption,
										 pValue,
										 pIcon,
										 pState)
{
	if(pParentNode instanceof TreeNode)
	{
		return this.addElementByNode(pParentNode,
		                      pCaption,
							  pValue,
							  pIcon,
							  pState);
	}
	else if(typeof pParentNode == "number")
	{
		return this.addElementByLevel(pParentNode,
		                       pCaption,
							   pValue,
							   pIcon,
							   pState);
	}
	else
	{
		throw new Error("First parameter must be a number or an instance of TreeNode.");
	}
}

TreeView.prototype.addElementByLevel = function(pLevel,
												pCaption,
												pValue,
												pIcon,
												pState)
{
	pLevel = parseInt(pLevel, 10);
	
	if(isNaN(pLevel)
		|| pLevel < 0)
	{
		throw new Error("Invalid level.\n\nLevel must be a number equals or greater than zero.");
	}

	var wParentNode = null;
	
	if(this.lastNode == null)
	{
		if(pLevel != 0)
		{
			throw new Error("Invalid level. The initial level must be zero.");
		}
		
		wParentNode = this.rootNode;
	}
	else
	{
		if(pLevel == this.lastNode.level)
		{
			wParentNode = this.lastNode.parentNode;
		}
		else if(pLevel > this.lastNode.level)
		{
			wParentNode = this.lastNode;
		}
		else
		{
			var wCurrentLevel = this.lastNode.level;
			
			for(wParentNode = this.lastNode; wCurrentLevel >= pLevel; --wCurrentLevel)
			{
				wParentNode = wParentNode.parentNode;
			}
		}
	}
	
	return this.addElementByNode(wParentNode,
								 pCaption,
								 pValue,
								 pIcon,
								 pState);
}


TreeView.prototype.addElementByNode = function(pParentNode,
                                               pCaption,
										       pValue,
										       pIcon,
										       pState)
{
	if(!(pParentNode instanceof TreeNode))
	{
		throw new Error("Invalid Parent Node.\n\nParent node must be an instance of TreeNode.");
	}
	
	var wNode = new TreeNode();
	
	with(wNode)
	{
		caption = pCaption;
		value = pValue || "";
		icon = pIcon;
		state = pState;
		level = pParentNode.level + 1;
		
		parentNode = pParentNode;
	}
	
	// ** ADD LAST **
	var wLastChild = pParentNode.getLastChild();
	
	if(wLastChild == null)
	{
		pParentNode.firstChild = wNode;
		wNode.nextSibling = null;
	}
	else
	{
		wLastChild.nextSibling = wNode;
		wNode.nextSibling = null;
	}
	
	this.lastNode = wNode;
	
	return wNode;
}

TreeView.expandNode = function(pObject, pNodeId)
{
	var wContainer = document.getElementById(pNodeId + "_c");
	
	if(wContainer != null)
	{
		if(wContainer.style.display != "none")
		{
			wContainer.style.display = "none";
			pObject.src = "../Images/plus.gif";
		}
		else
		{
			wContainer.style.display = "block";
			pObject.src = "../Images/minus.gif";
		}
	}
}

TreeView.onClick = function(pObject)
{
	var wValueObject = document.getElementById(/^(.+)_span$/i.exec(pObject.getAttribute("memberOf"))[1]);
	
	var wSelectedArray = eval(wValueObject.getAttribute("selectedArray"));
	var wLabel;
	
	wValueObject.value = pObject.getAttribute("value");
	
	if(wSelectedArray != null)
	{
		for(var i = 0, wLength = wSelectedArray.length; i < wLength; ++i)
		{
			wLabel = document.getElementById(wSelectedArray[i]).getElementsByTagName("LABEL")[0];
			with(wLabel.style)
			{
				backgroundColor = "#FFFFFF";
			}
		}
	}
	
	var wReplaceQuote = /'/g;
	
	wLabel = pObject.getElementsByTagName("LABEL")[0];
	with(wLabel.style)
	{
		backgroundColor = "#CECECE";
	}

	wValueObject.setAttribute("selectedArray", "(['" + pObject.parentElement.id + "'])");
}

TreeView.prototype.show = function()
{
	var wTreeViewName = this.name;
	var wOutput = "";
	var wLeftOffset = this.nodeLeftOffset + "px";
	var wIndex = -1;
	var wExpanded;
	var wId;
	var wReplaceQuote = /'/g;
	
	function renderNode(pNode)
	{
		var wIcon = "";
		var wExpand = "";
		
		// Begin_Change em 2018/11/20 
		// if (pNode.caption == "") {
		//     return;
		// } 
		// End_Change	
		
		if(pNode.icon != null && pNode.icon != "")
		{
			wIcon = "<img style='height:16px;width:16px;' src='" + pNode.icon + "' />";
		}
		
		if(pNode.firstChild != null)
		{
			if(wExpanded)
			{
				wExpand = "<img style='height:16px;width:16px;' src='../Images/minus.gif' onclick='TreeView.expandNode(this, \"" + wId + "\");' />";
			}
			else
			{
				wExpand = "<img style='height:16px;width:16px;' src='../Images/plus.gif' onclick='TreeView.expandNode(this, \"" + wId + "\");' />";
			}
		}
		else
		{
			wExpand = "<span style='width:16px;height:16px;'>&nbsp;</span>";
		}
	
		// Begin_Change em 2018/11/20 
		// wOutput += "<div id='" + wId + "'>" + wExpand + wIcon + "<label onclick='TreeView.onClick(this)' value='" + ((pNode.value || "").replace(wReplaceQuote, "&#x0027;")) + "' memberOf='" + wTreeViewName + "' style='height:16px;'>" + (pNode.caption || "") + "</label></div>";
		
  	    wOutput += "<div id='" + wId + "'>" + wExpand + "<span onclick='TreeView.onClick(this)' value='" + ((pNode.value || "").replace(wReplaceQuote, "&#x0027;")) + "' memberOf='" + wTreeViewName + "'>" + wIcon + "<label style='height:16px;'>" + (pNode.caption || "") + "</label></span></div>";
  	    
		// End_Change	
	
	}
	
	function render(pNode)
	{
		for(var wNode = pNode.firstChild; wNode != null; wNode = wNode.nextSibling)
		{
			++wIndex;
			wId = wTreeViewName + "_node_" + wIndex;
			wExpanded = wNode.state != null && wNode.state.toLowerCase() == "expanded";
			
			renderNode(wNode);
			
			if(wNode.firstChild != null)
			{
		        // Begin_Change em 2019/03/27 
				// wOutput += "<div style='padding-left:" + wLeftOffset + ";' id='" + wId + "_c' style='display=" + (wExpanded ? "block" : "none") + ";'>";
			    // wOutput += '<div style="padding-left:' + wLeftOffset + ';display:' + (wExpanded ? 'block' : 'none') + ';" id="' + wId + '_c">'; 

				wOutput += "<div style='padding-left:" + wLeftOffset + ";display:" + (wExpanded ? "block" : "none") + ";' id='" + wId + "_c'>"; 

				// End_Change	

				render(wNode);
				wOutput += "</div>";
			}
		}
	}
	
	render(this.rootNode);
	
	this.container.innerHTML = wOutput;
}

TreeView.prototype.selectNodeByValue = function(pValue)
{
	var wTreeView = document.getElementById(/^(.+)_span$/i.exec(this.name)[1]);
	var wSelectedArray = eval(wTreeView.getAttribute("selectedArray"));
	var warr = getElement(this.name).getElementsByTagName("LABEL");
	
	if(wSelectedArray != null)
	{
		for(var i = 0, length = wSelectedArray.length; i < length; ++i)
		{
			getElement(wSelectedArray[i]).getElementsByTagName("LABEL")[0].style.backgroundColor = "#FFFFFF";
		}
		
		wTreeView.setAttribute("selectedArray", "");
	}
	
	for(var i = 0, j = warr.length; i < j; ++i)
	{
		if(warr[i].parentElement.getAttribute("value") == pValue)
		{
			warr[i].style.backgroundColor = "#CECECE";
			
			wTreeView.setAttribute("selectedArray", "(['" + warr[i].parentElement.parentElement.id + "'])");
			wTreeView.value = pValue;
			break;
		}
	}
}

function TreeNode()
{
	// Attributes
	this.level = 0;
	this.caption = null;
	this.value = null;
	this.icon = null;
	this.state = null;
	
	this.firstChild = null;
	this.nextSibling = null;
	this.parentNode = null;
}

// Methods
TreeNode.prototype.getLastChild = function()
{
	var wNode = this.firstChild;
	
	for(; wNode != null;)
	{
		if(wNode.nextSibling == null)
		{
			return wNode;
		}
		
		wNode = wNode.nextSibling;
	}
	
	return null;
}

TreeNode.prototype.toString = function()
{
	return "level=" + this.level
			+ ", caption=" + this.caption
			+ ", value=" + this.value
			+ ", icon=" + this.icon
			+ ", state=" + this.state
			+ ", parent=" + this.parentNode.level;
}
