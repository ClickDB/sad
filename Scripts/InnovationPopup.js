// Popup Methods _________________________________________________
 var wObject;
 
function Popup () 
{
}

Popup.prototype.open = function (pName)
{
   if ( form_validatePopup(pName) == "Error")
   {
      return;
   }

    wObject = getElement(pName);

   if (wObject != null && wObject.getAttribute("prePopup") != null)
   {
      var wRoutine = wObject.getAttribute("prePopup");

      if (wRoutine.indexOf("return") == -1)
      {
         eval(wRoutine);  
      }
      else
      {
         var wExpr = /(.+)(?:\b)+(return\s*(?:false|true)?[\s;]*)$/;

         var wStmts = wExpr.exec(wRoutine);

         if (wStmts == null)
         {
            eval(wRoutine);          
         }
         else
         {
       eval(wStmts[1]);

           return;  
         }
      }
   }

   this.post(pName);
}

Popup.prototype.post = function (pObjectName)
{
    try
    {
        var wObject        = getElement(pObjectName);

        var wFormName      = "PopupLOV_" + wObject.id;

        var wHideColumns   = wObject.getAttribute("hideColumns");
        var wListColumns   = wObject.getAttribute("listColumns");
        var wListTitles    = wObject.getAttribute("listTitles");
        var wSubmitColumns = wObject.getAttribute("submitColumns");
        var wReturnFields  = wObject.getAttribute("returnFields");
        var wPopupCaption  = wObject.getAttribute("popupCaption");
        var wPopupHeight   = wObject.getAttribute("popupHeight");
        var wPopupWidth    = wObject.getAttribute("popupWidth");
        var wMaxRows       = wObject.getAttribute("maxRows");
        var wPopupStyles   = wObject.getAttribute("popupStyles");
		
        //var wDataSrc       = wObject.getAttribute("dataSrc"); 
        var wDataSrc       = ( wObject.dataSrc ) ? wObject.dataSrc : wObject.getAttribute("dataSrc"); 
		
        var wParameter     = wObject.getAttribute("parameter");

        var wParameterArray     = null;
        var wParameterFields    = "";
        var wParameterDatatypes = "";
        
        if (wParameter != null && wParameter != "")
        {
           wParameterArray = eval(wParameter);

           var wParameterObject;
           var wParameterComma = "";
 
           for (var wIndex in wParameterArray)
           {
               wParameterObject = getElement(wParameterArray[wIndex]);

               if (wParameterObject != null)
               {
                  if (wParameterObject.value == "")
                  {
                     wParameterFields = wParameterFields + wParameterComma + "null";
                  }
                  else
                  {
                     wParameterFields = wParameterFields + wParameterComma + encodeURIComponent(wParameterObject.value.replace(/\,/g, "&comma;"));
                  }
                  if ( wParameterObject.getAttribute("datatype") == "Date")
                  {
                     wParameterDatatypes = wParameterDatatypes + wParameterComma + wParameterObject.getAttribute("datatype") + ":" + wParameterObject.getAttribute("mask");
                  }
                  else
                  {
                     wParameterDatatypes = wParameterDatatypes + wParameterComma + wParameterObject.getAttribute("datatype");
                  }

                  wParameterComma = ",";
               }
           }
        }

        if (wMaxRows == null || wMaxRows == "null") 
        { 
           wMaxRows = "0"; 
        }

        // Creating the wUrl to check its length
        var wUrl = "PopupLOV";

		var wUniqueId      = getElement("session_uniqueId");
		var wSeparatorMark = "?";

		if ( wUniqueId != null && wUniqueId.value != null && wUniqueId.value != "" )
		{
            wUrl = wUrl + wSeparatorMark + "uniqueId=" + wUniqueId.value;
			wSeparatorMark = "&";
		}
		
        wUrl = wUrl + wSeparatorMark + "ControlName=" + wObject.id;
        wUrl = wUrl + "&HideColumns=" + wHideColumns;
        wUrl = wUrl + "&ListColumns=" + wListColumns;
        wUrl = wUrl + "&ListTitles=" + wListTitles;
        wUrl = wUrl + "&SubmitColumns=" + wSubmitColumns;
        wUrl = wUrl + "&ReturnFields=" + wReturnFields;
        wUrl = wUrl + "&PopupCaption=" + wPopupCaption;
        wUrl = wUrl + "&PopupHeight=" + wPopupHeight;
        wUrl = wUrl + "&PopupWidth=" + wPopupWidth;
        wUrl = wUrl + "&MaxRows=" + wMaxRows;

        if (wParameterFields != "")
        {
           wUrl = wUrl + "&ParameterFields=" + wParameterFields;
           wUrl = wUrl + "&ParameterDatatypes=" + wParameterDatatypes;
        }

        wUrl = wUrl + "&DataSrc=" + encodeURIComponent(wDataSrc);

        var wComposedUrl = "";
        with(window.location)
        {
           wComposedUrl = protocol + "//" + hostname + ((port || "") == "" ? "" : ":" + port) + /^(.+[\\/])[^\\/]+$/.exec(pathname)[1];
        }

        if((wComposedUrl + wUrl).length > 2083)
        {
           var xs_newHiddenInput = function(pName, pValue)
           {
               return "<input type='hidden' name='" + pName + "' value='" + encodeURIComponent(pValue).replace(/'/g, "%27") + "'>";
           }

           var xs_newHiddenInputNoEncode = function(pName, pValue)
           {
               return "<input type='hidden' name='" + pName + "' value='" + pValue.replace(/'/g, "%27") + "'>";
           }
  
           var wFormHTML = "<html><body><label style='font-family:sans-serif;font-size:12px;color:#ffffff;background-color:#cc0000;position:absolute;top:0px;left:10px'>&nbsp;&nbsp;Loading...&nbsp;&nbsp;</label>";

           wFormHTML += "<form name = 'form' id = 'form' method='post' action='PopupLOV' target='_self'>";

           wFormHTML += xs_newHiddenInput("SubmitMode", "post");
           wFormHTML += xs_newHiddenInput("ControlName", wObject.id);
           wFormHTML += xs_newHiddenInput("HideColumns", wHideColumns);
           wFormHTML += xs_newHiddenInput("ListColumns", wListColumns);
           wFormHTML += xs_newHiddenInput("ListTitles", wListTitles);
           wFormHTML += xs_newHiddenInput("SubmitColumns", wSubmitColumns);
           wFormHTML += xs_newHiddenInput("ReturnFields", wReturnFields);
           wFormHTML += xs_newHiddenInput("PopupCaption", wPopupCaption);
           wFormHTML += xs_newHiddenInput("PopupHeight", wPopupHeight);
           wFormHTML += xs_newHiddenInput("PopupWidth", wPopupWidth);
           wFormHTML += xs_newHiddenInput("MaxRows", wMaxRows);
           wFormHTML += xs_newHiddenInput("DataSrc", wDataSrc);

           if (wParameterFields != "")
           {
              wFormHTML += xs_newHiddenInputNoEncode("ParameterFields", wParameterFields);
              wFormHTML += xs_newHiddenInput("ParameterDatatypes", wParameterDatatypes);
           }
  
           wFormHTML += "</form><script>try{ window.focus(); } catch(e){}; try{ document.forms[0].submit(); } catch(e){}</script></body></html>";

           if (js.popupMode == "Modal"
                && window.navigator.appVersion.indexOf("MSIE 6") == -1)
           {
               var wModalPopup = null;
               
               try
               {
                  wModalPopup = new ModalPopup(wFormName);
               }
               catch(e)
               {
                  alert(e.description);
                  return;
               }
               
               try
               {
                  wModalPopup.height = wPopupHeight;
                  wModalPopup.width = wPopupWidth;
                  wModalPopup.caption = wPopupCaption;
                  wModalPopup.id = wFormName;
                  wModalPopup.masterField = wObject.getAttribute("masterField");

                  wModalPopup.innerHTML = wFormHTML;
                  wModalPopup.show();
               } 
               catch(e)
               {
                  alert("Error: " + e.description);
               }
           }
           else
           {
              var wWindow = window.open("", wFormName, wPopupStyles);
              try
              {
                 wWindow.document.write(wFormHTML);
              } 
              catch(e)
              { 
                 // alert("Error: " + e.description);
              }
           }   
        }
        else
        {
           var wTitle = "_blank"; 

           if(js.popupMode == "Modal")
           {
               var wModalPopup = null;
               
               try
               {
                  wModalPopup = new ModalPopup(wFormName);
               }
               catch(e)
               {
                  alert(e.description);
                  return;
               }

               try
               {
                  wModalPopup.height = wPopupHeight;
                  wModalPopup.width = wPopupWidth;
                  wModalPopup.caption = wPopupCaption;
                  wModalPopup.id = wFormName;
                  wModalPopup.masterField = wObject.getAttribute("masterField");

                  wModalPopup.src = wUrl;
                  wModalPopup.show();
               } 
               catch(e)
               { 
                  alert("Error: " + e.description);
               }
           }
           else
           {
              var wWindow = window.open(wUrl, wTitle, wPopupStyles);
            
              wWindow.focus();
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_openPopup");
    }    
}

Popup.prototype.isPropertyValue = function (pEvent)
{
    try
    {
        if (document.all)
        {
           if (pEvent.propertyName == "value")
           {
              return true;
           } 
           else
           {
              return false; 
           }
        }
        else
        {
           // It's necessary to implement the logic for Mozilla and Chrome
           return true; 
        } 
    }
    catch (Err)
    {
       fatalMsg(Err, "popup.isPropertyValue");
    }    
}
Popup.prototype.show = function (pName)
{
   try
   {
      var wObject = getElement(pName);

      var wPopupMode = wObject.getAttribute("popupMode");

      var wPopupUrl          = wObject.getAttribute("popupUrl");
      var wPopupParameters   = wObject.getAttribute("popupParameters");
      var wPopupReturnFields = wObject.getAttribute("popupReturnFields");

      var wPopupTop    = wObject.getAttribute("popupTop");
      var wPopupLeft   = wObject.getAttribute("popupLeft");
      var wPopupHeight = wObject.getAttribute("popupHeight");
      var wPopupWidth  = wObject.getAttribute("popupWidth");

      if (wPopupParameters != null || wPopupReturnFields != null)
      {
         var wSeparatorMark = "?";
		 
		 var wUniqueId = getElement("session_uniqueId");

		 if ( wUniqueId != null && wUniqueId.value != null && wUniqueId.value != "" )
		 {
             wPopupUrl += wSeparatorMark + "uniqueId=" + wUniqueId.value;
			 wSeparatorMark = "&";
		 }
  
         if (wPopupParameters != null)
         {
            wPopupUrl += wSeparatorMark + "Parameters=" + wPopupParameters;
			wSeparatorMark = "&";
         } 

         if (wPopupReturnFields != null)
         {
            wPopupUrl += wSeparatorMark + "ReturnFields=" + wPopupReturnFields;
         }
      } 

      if (wPopupMode == "Modal")
      {      
         var wModalPopup = new ModalPopup(wObject.id);

         var wPopupCaption     = wObject.getAttribute("popupCaption");
         var wPopupCloseButton = wObject.getAttribute("popupCloseButton");
         var wPopupScrollbars  = wObject.getAttribute("popupScrollbars");

         if (wPopupTop    != null) { wModalPopup.top = wPopupTop; }
         if (wPopupLeft   != null) { wModalPopup.left = wPopupLeft; }
         if (wPopupHeight != null) { wModalPopup.height = wPopupHeight; }
         if (wPopupWidth  != null) { wModalPopup.width = wPopupWidth; }

         if (wPopupCaption != null)     { wModalPopup.caption = wPopupCaption; }
         if (wPopupCloseButton != null) { wModalPopup.closeButton = String(wPopupCloseButton).toLowerCase() != "false"; }
         if (wPopupScrollbars != null)  { wModalPopup.scrollbars = String(wPopupScrollbars).toLowerCase() != "no"; }

         wModalPopup.src = wObject.getAttribute("popupUrl");

         wModalPopup.show();
      }
      else
      {
         var wTitle = wObject.getAttribute("popupUrl");

         var wPopupScrollbars = wObject.getAttribute("popupScrollbars");
         var wPopupStatus     = wObject.getAttribute("popupStatus");
         var wPopupLocation   = wObject.getAttribute("popupLocation");
         var wPopupToolbar    = wObject.getAttribute("popupToolbar");
         var wPopupMenubar    = wObject.getAttribute("popupMenubar");
         var wPopupResizable  = wObject.getAttribute("popupResizable");

         var wStyles = "";
         var wComma = "";

         if (wPopupTop    != null) { wStyles += wComma + "top="    + wPopupTop  ; wComma = "," }
         if (wPopupLeft   != null) { wStyles += wComma +"left="   + wPopupLeft  ; wComma = "," }
         if (wPopupHeight != null) { wStyles += wComma +"height=" + wPopupHeight; wComma = "," }
         if (wPopupWidth  != null) { wStyles += wComma +"width="  + wPopupWidth ; wComma = "," }

         if (wPopupScrollbars != null) { wStyles += wComma +"scrollbars=" + wPopupScrollbars; wComma = "," };
         if (wPopupStatus     != null) { wStyles += wComma +"status="     + wPopupStatus    ; wComma = "," };
         if (wPopupLocation   != null) { wStyles += wComma +"location="   + wPopupLocation  ; wComma = "," };
         if (wPopupToolbar    != null) { wStyles += wComma +"toolbar="    + wPopupToolbar   ; wComma = "," };
         if (wPopupMenubar    != null) { wStyles += wComma +"menubar="    + wPopupMenubar   ; wComma = "," };
         if (wPopupResizable  != null) { wStyles += wComma +"resizable="  + wPopupResizable ; wComma = "," };

         if (wPopupScrollbars == null) { wStyles += wComma +"scrollbars=yes"; wComma = "," };
         if (wPopupStatus     == null) { wStyles += wComma +"status=yes"    ; wComma = "," };
         if (wPopupLocation   == null) { wStyles += wComma +"location=no"   ; wComma = "," };
         if (wPopupToolbar    == null) { wStyles += wComma +"toolbar=no"    ; wComma = "," };
         if (wPopupMenubar    == null) { wStyles += wComma +"menubar=no"    ; wComma = "," };
         if (wPopupResizable  == null) { wStyles += wComma +"resizable=no"  ; wComma = "," };

         window.open(wPopupUrl, wTitle, wStyles);
      }
    }
    catch (Err)
    {
       fatalMsg(Err, "popup.show");
    }    

}

var popup = new Popup();

function ModalPopup(pName)
{
    pName = pName || "ModalPopup";
    
    if(document.getElementById(pName + "_popup") != null)
    {
        throw new Error("Attempting to display two instances of \"" + pName + "\".\n\nClick OK to try again...");
    }

    this.innerHTML = null;
    this.src = null;
    this.masterField = null;
    this.activeElement = (document.activeElement || {}).id || "";

    this.centered = true;
    this.scrollbars = true;
    this.resizable = true;
    this.height = 300;
    this.width = 300;
    this.left = 100;
    this.top = 100;
    this.layered = true;
    this.zIndex = 900;
    this.caption = "";
    this.closeButton = true;

    this.id = pName;

    this.popup = null;
    this.iframe = null;
    this.layer = null;
    this.boundary = null;
    

    ModalPopup.disposeInstance = function(instance)
    {
       var wArr = ModalPopup.instanceArray;
       var wNewArr = [];

       if(wArr != null)
       {
          for(var i = 0, len = wArr.length; i < len; ++i)
          {
             if(instance == null)
             {
                wArr[i].hide();
                wArr[i] = null;
             }
             else if(instance === wArr[i])
             {
                wArr[i].hide();
                wArr[i] = null;
                break;
             }
             if(wArr[i] != null)
             {
                wNewArr.push(wArr[i]);
             }
          }
          
          ModalPopup.instanceArray = wNewArr;
       }
    }
    
    ModalPopup.appendInstance = function(instance)
    {
       if(ModalPopup.instanceArray == null)
       {
          ModalPopup.instanceArray = [];
       }
       
       ModalPopup.instanceArray.push(instance);
    }

    ModalPopup.prototype.hide = function()
    {
        var wbody = document.getElementsByTagName("BODY")[0];
        
        if (wbody != null)
        {
           // Fires the iframe.onunload event. The event object can't be referenced ... 
           var wIframeBody = this.iframe.contentWindow.document.getElementsByTagName("BODY")[0];
           var wFunction = wIframeBody.getAttribute("onunload");
           if (typeof wFunction == "function")
           {
              wFunction();
           }

            if(this.popup != null)
            {
                wbody.removeChild(this.popup);
            }

            if(this.layer != null)
            {
				unregisterEvent(window, "resize", ModalPopup.resizeLayer);
				
                wbody.removeChild(this.layer);
            }
            
            if(this.boundary != null)
            {
                wbody.removeChild(this.boundary);
            }

            var wDocumentActiveElementId = (document.activeElement || {}).id || "";
            var wRE = /([^\s,]+)/;
            var wMasterField = (wRE.exec(this.masterField) || [null, ""])[1];

            if(wMasterField != null
               && (wDocumentActiveElementId == this.activeElement
                   || wDocumentActiveElementId == "body"))
            {
               setFocus(getElement(wMasterField));
            }
            else if(wDocumentActiveElementId == "body"
                    && this.activeElement != null)
            {
               setFocus(getElement(this.activeElement));
            }
        }
    }
    
    ModalPopup.prototype.resizeLayer = function()
    {
		if(this.layer == null) return;
		
        var wBody = document.getElementsByTagName("BODY")[0];
        var wWidth = wBody.clientWidth || screen.availWidth;
        var wHeight = wBody.clientHeight || screen.availHeight;
        
		with(this.layer.style)
		{
			width = Math.max(wWidth, wBody.scrollWidth);
			height = Math.max(wHeight, wBody.scrollHeight);
		}
    }
    
    ModalPopup.prototype.onclose = function()
    {
       ModalPopup.disposeInstance(this);
    }
    
	
	ModalPopup.prototype.show = function()
    {
        var wbody = document.getElementsByTagName("BODY")[0];
		
        if(this.popup == null)
        {
            this.popup = createPopup(this);
			
            wbody.appendChild(this.popup);

	        if(this.layered)
            {
                createLayer(this);
                wbody.appendChild(this.layer);
            }

            if(this.innerHTML != null)
            {
                this.iframe.contentWindow.document.write(this.innerHTML);
            }
            else
            {
                this.iframe.src = this.src || "";
            }

            var wThis = this;
            window.closeModalPopup = function()
			{ 
				ModalPopup.disposeInstance(wThis); 
				
				if (browser.isFirefox || browser.isChrome) 
				{	  				     
                    var wwObject = wObject || (  getElement( pName + "_popup" ) ); 
					
                    if ( wwObject ) 
					{ 
                        eval(wwObject.getAttribute("onpropertychange"));                                                                                 
                    } 
				}
		    }
        }

        if(this.layer != null)
        {
            var wThis = this;
            ModalPopup.resizeLayer = function(){wThis.resizeLayer();};

			registerEvent(window, "resize", ModalPopup.resizeLayer);
            
            ModalPopup.resizeLayer();
            this.layer.style.display = "block";
        }

		//var wHeightOffset = this.popup.rows[0].offsetHeight + this.popup.rows[2].offsetHeight; 
        var wHeightOffset = parseInt(this.popup.rows[0].cells[0].style.height, 10) + parseInt(this.popup.rows[2].cells[0].style.height, 10);
        
        this.height = parseInt(this.height, 10);
        this.width = parseInt(this.width, 10);
        this.left = parseInt(this.left, 10);
        this.top = parseInt(this.top, 10);
        
        this.height += wHeightOffset;
        
        if(this.centered === true)
        {
            var wleft = (wbody.clientWidth - this.width) / 2;
            var wtop = (wbody.clientHeight - this.height) / 2;
            
            this.left = wleft;
            this.top = wtop;
        }
        
        if(this.width > wbody.clientWidth)
        {
            this.left = 0;
            this.width = wbody.clientWidth;
        }

        if(this.height > wbody.clientHeight)
        {
            this.top = 0;
            this.height = wbody.clientHeight; 
        }
        
        with(this.popup.style)
        {
            top = this.top + "px";
            left = this.left + "px";
            width = this.width + "px";
            height = this.height + "px";
        }
        
        // ** Registro de eventos **
        var wIFrame = this.iframe;

        registerEvent(this.iframe, "load", function(){onLoadHandler(wIFrame);});
        
        this.popup.style.display = ""; // Não foi usado "block" pois os browsers Firefox e Opera não formatavam a TABLE (popup) corretamente.
        
        ModalPopup.appendInstance(this);
    }
    
    function onLoadHandler(pIFrame)
    {
		var wDocument = pIFrame.contentWindow.document;
        var wElements = getFirstAndLast(wDocument);
        
        ModalPopup.FIRST_ELEMENT = wElements.first;
        ModalPopup.LAST_ELEMENT = wElements.last;
		
		if ( pIFrame.contentWindow.opener === null ) {
			delete pIFrame.contentWindow.opener;
		}
		
		registerEvent(wDocument, "keydown", function(e){preventTab(e)});
        
        try
        {
            // Caso o desenvolvedor não tenha informado algum elemento para ter o foco, 
            // o primeiro elemento retornado pela função getFirstAndLast() deve ser usado.
            if(wElements.first != null
                && (wDocument.getElementById("form_activeControl").value || "") == "")
            {
                wElements.first.focus();
            }
        }
        catch(Err)
        {        
        }
    }

    function getFirstAndLast(pParentElement)
    {
        var wMinTabIndex = Number.MAX_VALUE;
        var wMaxTabIndex = -1;
        var wTabIndex;
        
        var wMinIndex, wMaxIndex;
        var wFirstElement, wLastElement;
        
        // Percorre a hierarquia de objetos, iniciando a busca a partir do primeiro child do elemento passado como parâmetro.
        // Elementos considerados como CONTAINER (tais como SPAN, DIV e FIELDSET) não devem ser analisados internamente (child nodes)
        // caso não estajam visíveis.
        // Já os elementos "navegáveis" só serão analisados se estiverem habilitados (disabled) e visíveis (visibility e display).
        function transverseDOM(parent)
        {
            for(var node = parent.firstChild; node != null; node = node.nextSibling)
            {
                if(node.nodeType == 1) // HTMLElement (qualquer tag)
                {
                    switch(node.nodeName)
                    {
                        // Containters
                        case "SPAN":
                        case "DIV":
                        case "FIELDSET":
                            // Se um elemento container não estiver visível, seus elementos internos também não estarão
                            if(node.style.visibility === "hidden"
                                || node.style.display === "none")
                            {
                                continue;
                            }
                            break;
                        // Tags que serão analisadas (considerar como campos)
                        case "INPUT":
                            if(node.type == "hidden")
                            {
                                continue;
                            }
                        case "SELECT":
                        case "TEXTAREA":
                        case "BUTTON":
                            wTabIndex = parseInt(node.tabIndex || "0", 10);

                            if(wTabIndex >= 0 // NaN retornará "false" nesta expressão
                                && node.disabled === false
                                && node.style.visibility !== "hidden"
                                && node.style.display !== "none")
                            {
                                // TabIndex igual a 0 (zero) é considerado maior do que qualquer tabIndex.
                                if(wTabIndex == 0)
                                {
                                    // Se o primeiro elemento ainda não tiver sido definido, será armazenado a referência 
                                    // do primeiro elemento com tabIndex igual a zero para o caso de todos os elementos
                                    // possuirem tabIndex igual a zero.
                                    if(wFirstElement == null)
                                    {
                                        wMinTabIndex = wTabIndex;
                                        wFirstElement = node;
                                    }
                                    // TabIndex igual a zero SEMPRE deve ser considerado como último na ordenação.
                                    wMaxTabIndex = wTabIndex;
                                    wLastElement = node;
                                }
                                else
                                {
                                    // Deve-se armazenar a primeira ocorrência do menor tabIndex
                                    if(wTabIndex < wMinTabIndex)
                                    {
                                        wMinTabIndex = wTabIndex;
                                        wFirstElement = node;
                                    }
                                    
                                    // Deve-se armazenar a última ocorrência de elementos com mesmo tabIndex ou a primeira ocorrência do maior tabIndex
                                    if(wTabIndex >= wMaxTabIndex)
                                    {
                                        wMaxTabIndex = wTabIndex;
                                        wLastElement = node;
                                    }
                                }
                            }
                            
                            // Campos NUNCA possuirão elementos "filhos"
                            continue;
                    }
                    
                    // Chamada recursiva para avaliar elementos "filhos"
                    transverseDOM(node);
                }
            }
        }

        transverseDOM(pParentElement);

        return {first: wFirstElement, last: wLastElement};
    }
    
    function preventTab(pEvent)
    {
		var wKeyCode = pEvent.keyCode;
		
		stopPropagation(pEvent);
		
        if(wKeyCode == 9)
        {
            if(pEvent.altKey || pEvent.ctrlKey)
            {
                return;
            }
            
			var wTarget = target(pEvent);
			
            if(pEvent.shiftKey)
            {
                if(wTarget == ModalPopup.FIRST_ELEMENT)
                {
					preventDefault(pEvent);
					if(browser.isOpera)
					{
						pEvent.keyCode = 0;
					}
                    setFocus(ModalPopup.LAST_ELEMENT);
                }
            }
            else
            {
                if(wTarget == ModalPopup.LAST_ELEMENT)
                {
					preventDefault(pEvent);
					if(browser.isOpera)
					{
						pEvent.keyCode = 0;
					}
                    setFocus(ModalPopup.FIRST_ELEMENT);
                }
            }
        }
        else if(wKeyCode == 27
                   && !pEvent.shiftKey
                   && !pEvent.altKey
                   && !pEvent.ctrlKey)
        {
            ModalPopup.disposeInstance();
        }
    }

    function createLayer(pRef)
    {
        var wLayer = document.createElement("DIV");
        
        with(wLayer)
        {
            id = pRef.id + "_layer";
            with(style)
            {
                position = "absolute";
                backgroundColor = "#333333";
                left = "0px";
                top = "0px";
                zIndex = parseInt(pRef.popup.style.zIndex, 10) - 1;
            }
        }
		setOpacity(wLayer, 10);

		registerEvent(wLayer, "mousedown", function(e){preventDefault(e); stopPropagation(e);});
		
        pRef.layer = wLayer;
    }
    
    function createPopup(pRef)
    {
        var wTable = document.createElement("TABLE");
        var wHeader = document.createElement("DIV");
        var wContent = document.createElement("IFRAME");
        var wFooter = document.createElement("SPAN");
        
        var wRowHeader = wTable.insertRow(-1);
        var wRowContent = wTable.insertRow(-1);
        var wRowFooter = wTable.insertRow(-1);
		
		var HEADER_BACKGROUND_COLOR = "#CECECE";
		var FOOTER_BACKGROUND_COLOR = "#F5F5F5";

       // ** Definição do header **
        if (pRef.caption != null)
        {
            var tnode = wHeader.appendChild(document.createTextNode(pRef.caption));
        }
		
        with(wHeader)
        {
            id = pRef.id + "_header";
            with(style)
            {
                fontWeight = "bold";
                paddingLeft = "10px";
                cursor = "default";
            }
        }

		var wHeaderCell;
        with(wHeaderCell = wRowHeader.insertCell(-1))
        {
            appendChild(wHeader);
            
            with(style)
            {
                backgroundColor = HEADER_BACKGROUND_COLOR;
                fontFamily = "verdana";
                fontSize = "11px";
                
                width = "100%";
                height = "20px";
            }
        }
		registerEvent(wHeaderCell, "mousedown", function(e){pRef.onmousedown_move(e);});

        with(wRowHeader.insertCell(-1))
        {
			style.backgroundColor = HEADER_BACKGROUND_COLOR;
			
            if(pRef.closeButton)
            {
                var wBtnClose = document.createElement("DIV");
                
                with(wBtnClose)
                {
                    id = pRef.id + "_btn_close";
                    innerHTML = "x";
                    tabIndex = -1;
                    
                    onclick = function(){pRef.onclose();};
                    
                    with(style)
                    {
                        fontSize = "10px";
                        fontWeight = "bold";
                        fontFamily = "tahoma";
                        color = "#ff0000";
						unselectable = "on";
						
						align = "center";
						cursor = "pointer";

						width = "15px";
						height = "15px";						
                    }
                }
                
                appendChild(wBtnClose);
            }
		}

        // ** Definição do content **
        pRef.iframe = wContent;
		
        with(wContent)
        {
            id = pRef.id + "_iframe";
            frameBorder = "0";
            tabIndex = -1;

            if(pRef.scrollbars === false)
            {
                scrolling = "no";
            }

            with(style)
            {
                width = "100%";
                height = "100%";
            }
        }
		with(wRowContent.insertCell(-1))
        {
            colSpan = 2;
			appendChild(wContent);
        }
		
        // ** Definição do footer **
        with(wFooter)
        {
            id = pRef.id + "_footer";
        }
        with(wRowFooter.insertCell(-1))
        {
            with(style)
            {
                height = "15px";
                backgroundColor = FOOTER_BACKGROUND_COLOR;
            }

            appendChild(wFooter);
            
            if(!pRef.resizable)
            {
                colSpan = 2;
            }
        }

        if(pRef.resizable)
        {
			var wFooterCell;
            with(wFooterCell = wRowFooter.insertCell(-1))
            {
                with(style)
                {
                    width = "10px";
                    cursor = "se-resize";
                    backgroundColor = FOOTER_BACKGROUND_COLOR;
                }
            }
			registerEvent(wFooterCell, "mousedown", function(e){pRef.onmousedown_resize(e);});
        }
        
        // ** Definição do POPUP (table) **
        with(wTable)
        {
            id = pRef.id + "_popup";
            
            with(style)
            {
				display = "none";
			
                border = "1px solid black";
                left = pRef.left + "px";
                top = pRef.top + "px";
                height = pRef.height + "px";
                width = pRef.width + "px";
                position = "absolute";
                zIndex = pRef.zIndex || 950;
            }
            cellPadding = 0;
            cellSpacing = 0;
        }

        return wTable;
    }
    
    ModalPopup.prototype.getBoundaryFrame = function()
    {
        var wpopup = this.popup;
        
        if(this.boundary == null)
        {
            var wdiv = document.createElement("DIV");
            
            with(wdiv.style)
            {
                border = "2px solid #000000";
                position = "absolute";
                backgroundColor = "#333333";
            }

			setOpacity(wdiv, 10);
            
            wdiv.zIndex = parseInt(wpopup.style.zIndex, 10) + 1;
            wdiv.id = this.id + "_boundary";
            wdiv = document.getElementsByTagName("BODY")[0].appendChild(wdiv);

            this.boundary = wdiv;
        }
        
        with(this.boundary.style)
        {
            left = wpopup.offsetLeft + "px";
            top = wpopup.offsetTop + "px";
            width = wpopup.offsetWidth + "px";
            height = wpopup.offsetHeight + "px";
            display = "block";
        }
        
        return this.boundary;
    }
    
    // ** Funções usadas para mover o POPUP **
    ModalPopup.prototype.onmousedown_move = function(pEvent)
    {
		if(mouseButtonValue(pEvent) != 1) // botão esquerdo
			return;
        
        var wbody = document.getElementsByTagName("BODY")[0];
        var wpopup = this.popup;

        registerEvent(document, "mouseup", ModalPopup.onmouseup_move);
        registerEvent(document, "mousemove", ModalPopup.onmousemove_move);
        
        ModalPopup.offsetX = pEvent.clientX - wpopup.offsetLeft;
        ModalPopup.offsetY = pEvent.clientY - wpopup.offsetTop;
        
        ModalPopup.FRAME = this.getBoundaryFrame();
        ModalPopup.POPUP = this.popup;

        ModalPopup.MAX_WIDTH = wbody.clientWidth - wpopup.offsetWidth;
        ModalPopup.MAX_HEIGHT = wbody.clientHeight - wpopup.offsetHeight;

        wpopup.style.visibility = "hidden";
		
		preventDefault(pEvent);
		stopPropagation(pEvent);
    }
    
    ModalPopup.onmousemove_move = function(pEvent)
    {
        var cx = pEvent.clientX;
        var cy = pEvent.clientY;
       
        var _left = cx - ModalPopup.offsetX;
        var _top = cy - ModalPopup.offsetY; 

        var _setY = (_top > 20 && _top < ModalPopup.MAX_HEIGHT) || (cy > 20);
        
        with(ModalPopup.FRAME.style)
        {
            left = _left;
            if(_setY)
                top = _top;
        }

		preventDefault(pEvent);
		stopPropagation(pEvent);
    }

    ModalPopup.onmouseup_move = function(pEvent)
    {
        var wboundary = ModalPopup.FRAME;
        var wframe = ModalPopup.POPUP;
		
        with(wframe.style)
        {
            left = wboundary.offsetLeft + "px";
            top = wboundary.offsetTop + "px";
        }
        wboundary.style.display = "none";
        wframe.style.visibility = "visible";
        
        unregisterEvent(document, "mouseup", ModalPopup.onmouseup_move);
        unregisterEvent(document, "mousemove", ModalPopup.onmousemove_move);

		ModalPopup.resizeLayer();
    }
    
    // ** Funções usadas para redimensionar o POPUP **
    ModalPopup.prototype.onmousedown_resize = function(pEvent)
    {
		if(mouseButtonValue(pEvent) != 1) // botão esquerdo
			return;

        var wbody = document.getElementsByTagName("BODY")[0];
        var wpopup = this.popup;

        wbody.style.cursor = "se-resize";
		
        registerEvent(document, "mouseup", ModalPopup.onmouseup_resize);
        registerEvent(document, "mousemove", ModalPopup.onmousemove_resize);

        ModalPopup.startY = pEvent.clientY;
        ModalPopup.startX = pEvent.clientX;
        
        ModalPopup.FRAME = this.getBoundaryFrame();
        ModalPopup.POPUP = wpopup;
        
        ModalPopup.MAX_HEIGHT = wbody.clientHeight - wpopup.offsetHeight;
        ModalPopup.MAX_WIDTH = wbody.clientWidth - wpopup.offsetWidth;
        wpopup.style.visibility = "hidden";
        
        ModalPopup.START_HEIGHT = ModalPopup.FRAME.offsetHeight;
        ModalPopup.START_WIDTH = ModalPopup.FRAME.offsetWidth;
        
		preventDefault(pEvent);
		stopPropagation(pEvent);
    }

    ModalPopup.onmousemove_resize = function(pEvent)
    {
        //var evt = window.event;
        var cy = pEvent.clientY;
        var cx = pEvent.clientX;
        
        var wframe = ModalPopup.FRAME;
        var H = (ModalPopup.START_HEIGHT + (cy - ModalPopup.startY));
        var W = (ModalPopup.START_WIDTH + (cx - ModalPopup.startX));
        
        if(H > 100)
        {
            wframe.style.height = H;
        }
        
        if(W > 100)
        {
            wframe.style.width = W;
        }
    }

    ModalPopup.onmouseup_resize = function(pEvent)
    {
		var wbody = document.getElementsByTagName("BODY")[0];
        var wframe = ModalPopup.FRAME;
        
        with(ModalPopup.POPUP.style)
        {
            width = wframe.offsetWidth;
            height = wframe.offsetHeight;
        } 
        
        wframe.style.display = "none";
		
		unregisterEvent(document, "mouseup", ModalPopup.onmouseup_resize);
        unregisterEvent(document, "mousemove", ModalPopup.onmousemove_resize);

        wbody.style.cursor = "";
        ModalPopup.POPUP.style.visibility = "visible";
		
		ModalPopup.resizeLayer();
    }
}

function preventDefault(pEvent)
{
	if(pEvent.preventDefault)
	{
		pEvent.preventDefault();
	}
	else
	{
		pEvent.returnValue = false;
	}
}

function stopPropagation(pEvent)
{
	if(pEvent.stopPropagation)
	{
		pEvent.stopPropagation();
	}
	else
	{
		pEvent.cancelBubble = true;
	}
}

function registerEvent(pObject, pEventName, pFunction)
{
	if(pObject.addEventListener)
	{
		pObject.addEventListener(pEventName, pFunction, false);
	}
	else if(pObject.attachEvent)
	{
		pObject.attachEvent("on" + pEventName, pFunction);
	}
	else
	{
		throw new Error("Browser does not support Dynamic Event Registration.");
	}
}

function unregisterEvent(pObject, pEventName, pFunction)
{
	if(pObject.addEventListener)
	{
		pObject.removeEventListener(pEventName, pFunction, false);
	}
	else if(pObject.attachEvent)
	{
		pObject.detachEvent("on" + pEventName, pFunction);
	}
	else
	{
		throw new Error("Browser does not support Dynamic Event Registration.");
	}
}

function mouseButtonValue(pEvent)
{
	if(pEvent.which)
	{
		return pEvent.which;
	}
	
	var wButton = pEvent.button;
	
	/* Vide: http://msdn.microsoft.com/en-us/library/ms533544(v=VS.85).aspx 
	
		Integer that specifies or receives one of the following values.
		0
		Default. No button is pressed.
		1
		Left button is pressed.
		2
		Right button is pressed.
		3
		Left and right buttons are both pressed.
		4
		Middle button is pressed.
		5
		Left and middle buttons both are pressed.
		6
		Right and middle buttons are both pressed.
		7
		All three buttons are pressed	
	*/
	if(wButton & 1) // botão esquerdo
	{
		return 1;
	}
	else if(wButton & 2) // botão direito
	{
		return 3;
	}
	else if(wButton & 4) // botão do meio
	{
		return 2;
	}
	else
	{
		return 0;
	}
}

function setOpacity(pObject, pValue)
{
	if(browser.isMSIE)
	{
		pObject.style.filter = "alpha(opacity=" + pValue + ")";
		pObject.style.zoom = 1;
		
		try
        {
		   pObject.style.opacity = (pValue / 100); // Projeto Sercomtel --> temporario
        }
        catch (Err)
        {
           // Ignore Exception 
        }    
	}
	else
	{
		pObject.style.opacity = (pValue / 100);
	}
}

function target(pEvent)
{
	return pEvent.target || pEvent.srcElement;
}