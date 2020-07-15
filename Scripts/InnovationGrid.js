// Popup Methods _________________________________________________
 
function Grid () 
{
    this.activeGrid = null;
    this.headerHeight = 0;

    this.activeRowBackgroundColor = null;
    this.originalBackgroundColor = null;

    this.activeRowColor = null;
    this.originalColor = null;

    this.activeRowTextDecoration = null;
    this.originalTextDecoration = null;

    this.autoSubmit = true;

}

Grid.prototype.initialSettings = function (pGrid)
{
    this.activeGrid = pGrid;
    this.activeRowBackgroundColor = pGrid.getAttribute("activeRowBackgroundColor") || "000080";
    this.originalBackgroundColor = pGrid.getAttribute("originalBackgroundColor") || "FFFFFF";

    this.activeRowColor = pGrid.getAttribute("activeRowColor") || "FFFFFF";
    this.originalColor = pGrid.getAttribute("originalColor") || "000000";

    this.activeRowTextDecoration = pGrid.getAttribute("activeRowTextDecoration");
    this.originalTextDecoration = pGrid.getAttribute("originalTextDecoration");

    this.headerHeight = pGrid.rows[0].offsetHeight;
}

Grid.prototype.onKeyUp = function (pEvent)
{
    var kc = pEvent.which || pEvent.keyCode;
    
    if(kc == 38)  // Arrow Up
    {
       pEvent.cancelBubble = true;
       pEvent.returnValue = false;
    }
    else if(kc == 40) // Arrow Down
    {
       pEvent.cancelBubble = true;
       pEvent.returnValue = false;
    }
    else if(kc == 13) // Enter
    {
       pEvent.cancelBubble = true;
       pEvent.returnValue = false;
    }
}

Grid.prototype.onKeyDown = function (pGrid, pEvent)
{
    this.initialSettings(pGrid);

    var kc = pEvent.which || pEvent.keyCode;
    
    if(kc == 38)  // Arrow Up
    {
       this.onArrowUp();
       
       pEvent.cancelBubble = true;
       pEvent.returnValue = false;
    }
    else if(kc == 40) // Arrow Down
    {
       this.onArrowDown();
       
       pEvent.cancelBubble = true;
       pEvent.returnValue = false;
    }
    else if(kc == 13) // Enter
    {
       this.onEnter();

		if ( pEvent.preventDefault )
		{
			pEvent.preventDefault();
		}
		else
		{
			pEvent.returnValue = false;
		}
		
		if ( pEvent.stopPropagation )
		{
			pEvent.stopPropagation();
		}
		else
		{
			pEvent.cancelBubble = true;
		}
    }

}

Grid.prototype.onArrowDown = function (pGrid)
{
   if (pGrid != null && pGrid != undefined)
   {
      this.initialSettings(pGrid);
   }

   var wGrid  = this.activeGrid;
   var wIndex = parseInt(wGrid.getAttribute("activeRow"), 10);
   
   if(wIndex < wGrid.rows.length - 1)
    {
       this.unselectLine();
       wIndex++;

       wGrid.rows[wIndex].style.backgroundColor = this.activeRowBackgroundColor;
       wGrid.rows[wIndex].style.color = this.activeRowColor;
       wGrid.setAttribute("activeRow", wIndex);
    }
    
    this.scrollIntoView(wGrid.rows[wIndex], wGrid.offsetParent);
}

Grid.prototype.onArrowUp = function (pGrid)
{
   if (pGrid != null && pGrid != undefined)
   {
      this.initialSettings(pGrid);
   }

   var wGrid  = this.activeGrid;
   var wIndex = parseInt(wGrid.getAttribute("activeRow"), 10);

   if(wIndex > 1)
    {
       this.unselectLine();
       wIndex--;
       wGrid.rows[wIndex].style.backgroundColor = this.activeRowBackgroundColor;
       wGrid.rows[wIndex].style.color = this.activeRowColor;
       wGrid.setAttribute("activeRow", wIndex);
    }
    
    this.scrollIntoView(wGrid.rows[wIndex], wGrid.offsetParent);
}

Grid.prototype.onEnter = function (pGrid)
{
   if (pGrid != null && pGrid != undefined)
   {
      this.initialSettings(pGrid);
   }

   var wGrid = this.activeGrid;
   var wIndex = parseInt(wGrid.getAttribute("activeRow"), 10);

   // alert (wGrid.rows[wIndex].cells[0].firstChild.nodeValue + " :: " + wGrid.rows[wIndex].cells[1].firstChild.nodeValue);

   var wObject = getElement(wGrid.getAttribute("MemberOf"));
   wObject.value = wGrid.rows[wIndex].getAttribute("submitValue");
   wObject.value = wObject.value.replace(/&apos;/g, "'");

   var wSelectedRow = getElement(wObject.id + "_SelectedRow");
   wSelectedRow.value = wIndex;

   // alert("id = " + wObject.id + ", value = " + wObject.value + ", selectedRow = " + wSelectedRow.value);
   if (this.autoSubmit == true)
   {
      form_submit();
   }
}

Grid.prototype.onMouseOver = function (pRow)
{
   var wObject = getElement( pRow.getAttribute("memberOf") );
   var wGrid = getElement("_" + wObject.id);
   this.initialSettings(wGrid);

   // temporario miranda
   //if (document.activeElement != wGrid)
   //{
   //   wGrid.setActive();
   //}
 
   if ( wGrid.getAttribute("activeRow") != pRow.getAttribute("row") )
   {
      this.unselectLine();

      pRow.style.backgroundColor = this.activeRowBackgroundColor;
      pRow.style.color = this.activeRowColor;

      if (this.activeRowTextDecoration != null)
      {
         pRow.style.textDecoration = this.activeRowTextDecoration;
      }

      wGrid.setAttribute("activeRow", pRow.getAttribute("row"));
   }
}

Grid.prototype.scrollIntoView = function (pObject, pContainer)
{
    var wHeaderHeight = this.headerHeight;

    var innerFunction = function()
    {
        var OFFSET = wHeaderHeight;

        var wTop = pObject.offsetTop;
        var wHeight = pObject.offsetHeight;
        var wScrollTop = pContainer.scrollTop;
        var wViewHeight = pContainer.offsetHeight;

        if (wTop < wScrollTop + OFFSET)
        {
           pContainer.scrollTop = wTop - OFFSET;
        }
        else if(wTop + wHeight > wScrollTop + wViewHeight)
        {
           pContainer.scrollTop = (wTop + wHeight - wViewHeight);
        }
    }

    window.setTimeout(innerFunction, 0);
}

Grid.prototype.unselectLine = function (pGrid)
{
   if (pGrid != null && pGrid != undefined)
   {
      this.initialSettings(pGrid);
   }

   var wGrid = this.activeGrid;
   var wIndex = parseInt(wGrid.getAttribute("activeRow"), 10);
    
   wGrid.rows[wIndex].style.backgroundColor = this.originalBackgroundColor;
   wGrid.rows[wIndex].style.color = this.originalColor;
}

var grid = new Grid();

