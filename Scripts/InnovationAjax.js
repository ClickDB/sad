// Ajax Methods _________________________________________________
 
var ajax_httpRequest = null;
var ajax_httpResponse = null;

function ajax_getResponse ()
{
   try
   {
      if (ajax_httpRequest.readyState == 4 || ajax_httpRequest.readyState == "complete")
      {
         ajax_httpResponse = ajax_httpRequest.responseText;
      }
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.response");
   }    
}

function Ajax (pAutoRestore) 
{
   try
   {
    this.autoPopulate = true;
    this.autoAlert = true;
    this.autoRestore = pAutoRestore || false;

    this.checkBrowser = true;
    this.exceptionRaised = false;
    this.exceptionMessage = null;

    this.url = null;

    this.currentUrl = "";

    this.statusMsg = null;

    this.formArray = null;

    this.submitArray = null;
    this.requestParameters = null;

    this.returnArray = null;

    this.responseArray = null;
    this.responseFormat = "Array";

    this.alertArray = null;

    this.httpResponse = null;
    this.httpRequest = null;

    this.submitFields = null;
    this.returnFields = null;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.constructor");
   }    

}

Ajax.prototype.getAlerts = function ()
{
   try
   {
      var wMessage = "";
      var wNewLine = "";

      if (this.alertArray != null)
      {
         for (var wIndex in this.alertArray)
         {
             wMessage = wMessage + wNewLine + this.alertArray[wIndex];
             wNewLine = "\n";
         }
      }

      return wMessage;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.getAlerts()");
   }    
}

Ajax.prototype.validate = function (pObject, pMethod, pMandatory)
{
   try
   {
      var wValidate = false;

      if (pObject == null || pObject.value == undefined)
      {
         pObject = event.srcElement;
      }

      if (pObject.value == "null")
      {
         wValidate = true;
      }

      if (pObject.value != pObject.getAttribute("originalValue"))
      {
         wValidate = true;
      }

      if (pMandatory != null && pMandatory.toUpperCase() == "ALWAYS")
      {
         wValidate = true;
      }

      if (wValidate == true)
      {
         this.invoke(pMethod);

         if (this.exceptionRaised == true)
         {
            pObject.setAttribute("originalValue", "null");
         }
         else
         {
            pObject.setAttribute("originalValue", pObject.value);
         }
      }
    }
    catch (Err)
    {
       fatalMsg(Err, "ajax.validate");
    }
}

Ajax.prototype.invoke = function (pMethod)
{
   try
   {
      var wUrl = null;
      var wParameters;
      var wResponse;
      var wCurrentWindowStatus = window.status;

      if (this.currentUrl == "") {
         this.currentUrl = form.getAttribute("CurrentUrl");
      }

      // Defining the url to be called ...
      if (this.url == null)
      {

         wUrl = this.currentUrl; 
      }
      else
      {
         wUrl = this.url;
      }

      wParameters = "AjaxSubmitMode=AjaxSubmit";

      wParameters = wParameters + "&AjaxResponseFormat=" + this.responseFormat;

      if (this.checkBrowser == false)
      {
         wParameters = wParameters + "&AjaxGetBrowserValues=False";

         this.checkBrowser = true;
      }

      if (pMethod != null && pMethod != "")
      {
         wParameters = wParameters + "&AjaxMethod="+ pMethod;
      }

      window.status = 'ajax.parameters ...';

      if (this.submitFields != null)
      {
         wParameters = wParameters + this.getSubmitFieldsParameters();
      }
      else if (this.submitArray != null)
      {
         wParameters = wParameters + this.getSubmitArrayParameters();
      }
      else
      {
         wParameters = wParameters + this.getFormParameters();
      }
      this.requestParameters = wParameters;

      // Posting the ajax request ...
      window.status = 'ajax.post ...';
      this.post(wUrl, wParameters);

      if ( this.autoPopulate == true )
      {  
         window.status = 'ajax.populate ...';
         this.populate();
      }

      if ( this.autoAlert == true )
      { 
         window.status = 'ajax.displayAlerts ...';

         if (this.statusMsg == null || this.statusMsg == "")
         {
            window.status = wCurrentWindowStatus;
         }

         this.displayAlerts();
      }
      else
      {
         window.status = wCurrentWindowStatus;
      }

      if (this.autoRestore == true)
      {
         this.autoPopulate = true;
         this.autoAlert = true;
         this.checkBrowser = true;

         this.submitArray = null;
         this.returnArray = null;

         this.submitFields = null;
         this.returnFields = null;
      }
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.invoke");
   }    
}

Ajax.prototype.getFormParameters = function ()
{
   try
   {
        var wParameters = "";

        if (this.formArray == null)
        { 
           this.formArray = new Array();

           // --> Possible tagNames:
           //     INPUT.type = button,checkbox,file,hidden,image,password,radio,reset,submit,text
           //     TEXTAREA.type = textarea
           //     SELECT.type = select-one, select-multiple

          this.formArray = this.formArray.concat(toArray(document.getElementsByTagName("INPUT")));
          this.formArray = this.formArray.concat(toArray(document.getElementsByTagName("TEXTAREA")));
          this.formArray = this.formArray.concat(toArray(document.getElementsByTagName("SELECT")));
        }
 
        for (var i = 0; i < this.formArray.length; i++)
        {
            if (this.formArray[i].value != "")
            {
               wParameters += "&" + this.formArray[i].id + "=" + encodeURIComponent(this.formArray[i].value);
            }
        }  

        return wParameters;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.getFormParameters()");
   }    
}

Ajax.prototype.getSubmitFieldsParameters = function ()
{
  try
  {
    var wElement;
    var wParameters = "";
    var wFields = (this.submitFields || "").split(/\s*[,;]+\s*/);
	 
    for (var i = 0, j = wFields.length; i < j; ++i)
    {
        wElement = getElement(wFields[i]);

        if (wElement != null && wElement.value != "")
        {
           wParameters += "&" + wElement.id + "=" + encodeURIComponent(wElement.value);
        } 
    }
    return wParameters;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.getSubmitFieldsParameters()");
   }    
}

Ajax.prototype.getSubmitArrayParameters = function ()
{
   try
   {
     var wParameters = "";

     if (this.submitArray != null)
     {
        for (var i = 0; i < this.submitArray.length; i++)
        {
            if (this.submitArray[i].value != "")
            {
               wParameters += "&" + this.submitArray[i].id + "=" + encodeURIComponent(this.submitArray[i].value);
            }
        }  
     } 

     return wParameters;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.submitParameters()");
   }    
}


Ajax.prototype.get = function (pField)
{
   try
   {
      var wFieldName;
      var wFieldValue = "";

      if (typeof pField == 'object')
      {
         wFieldName = pField.value;
      }
      else
      {
         wFieldName = pField;
      }

      if (this.responseArray != null)
      {
         for (var wIndex in this.responseArray)
         {
             if (wFieldName == wIndex)
             {
                wFieldValue = this.responseArray[wIndex];
                break;
             }
         }
      }

      return wFieldValue;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.get()");
   }    
}

Ajax.prototype.displayAlerts = function ()
{
   try
   {
       var wMessage = "";
       var wNewLine = "";

       if (this.statusMsg != null && this.statusMsg != "")
       {
          window.status = this.statusMsg;
       }

       wMessage = this.getAlerts();

       if (wMessage != "")
       {
         if (this.exceptionRaised == true)
         {
            raise(wMessage);
         }
         else
         {
            alert(wMessage);
         }
       }
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.displayAlerts()");
   }    
}

Ajax.prototype.populate = function ()
{
   try
   {
        var wField;
        var wValue;

        var wDecimals;                                        
        var wDecimalSeparator = form.getAttribute("decimalSeparator");

        // The populate process won't be done if exception is raised
        if (this.exceptionRaised == true)
        {
           return;
        }

        if (this.responseArray != null)
        {
           for (var wIndex in this.responseArray)
           {
               wField = document.getElementById(wIndex);

               if (wField != null)
               {
                  wValue = this.responseArray[wIndex];
                  
                  if (wValue != "")
                  {
                     wValue = wValue.replace(/&lt;/g, "<");
                     wValue = wValue.replace(/&amp;/g, "&");
                  } 

                  wDecimals = wField.getAttribute("Decimals"); 

                  if (wDecimals != null)
                  {
                     if (wDecimalSeparator != ".")
                     {
                        wValue = wValue.replace(/\./g, wDecimalSeparator);
                     }
                  } 

                  if (wValue != wField.value)
                  {
                     wField.value = wValue;

                     wField.setAttribute("originalValue", wValue);  
                  }
               }
           }
       }
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.populate()");
   }    
}

Ajax.prototype.submit = function ()
{
   try
   {
      if (this.currentUrl == "") {
         this.currentUrl = form.getAttribute("CurrentUrl");
      }

      window.status = 'form_parameters...';
      var wParameters = "AjaxSubmitMode=AjaxSubmit" + this.getFormParameters();

      // Posting the ajax request ...
      window.status = 'ajax.post...';
      this.post(this.currentUrl, wParameters);

      window.status = 'ajax.populate...';
      this.populate();
      this.displayAlerts();
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.submit()");
   }    
}

Ajax.prototype.post = function (pUrl, pParameters)
{
   try
   {
      var wParameters;

      if (window.XMLHttpRequest)
      {
         ajax_httpRequest = new XMLHttpRequest();
      }
      else if (window.ActiveXObject)
      {
         ajax_httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }

      if (ajax_httpRequest == null)
      {
         alert ("Browser does not support HTTP Request");
         return;
      }

      // Initializing attributes ...
      ajax_responseText = "";

      this.exceptionRaised = false;
      this.exceptionMessage = null;
      this.statusMsg = null;
      this.responseArray = null;
      this.alertArray = null;

      // Fixing pParameters ...
      wParameters = pParameters;

      // Using DoPost ...
      ajax_httpRequest.onreadystatechange = ajax_getResponse;
      ajax_httpRequest.open("POST", pUrl, false);

      ajax_httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

      ajax_httpRequest.send(wParameters);

      // Using DoGet ...
      //pUrl = pUrl + "?" + pParameters;
      //ajax_httpRequest.onreadystatechange = ajax_getResponse;
      //ajax_httpRequest.open("GET", pUrl, false);
      //ajax_httpRequest.send(null);

      // Executing getResponse when using Firefox ...
      if (ajax_httpResponse == "")
      {
         ajax_getResponse();
      }

      this.requestHttp = ajax_httpRequest;
      this.httpResponse = ajax_httpResponse; 

      if (this.responseFormat == "Array")
      {
         this.analyzeArray(); 
      }
      else
      {
         this.analyzeXML();
      } 
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.post");
   }    

}

Ajax.prototype.analyzeArray = function ()
{
   try
   {
       var wValueArray = null;   

       var wFieldBuffer = "";
       var wFieldSeparator = "";

       var wAlertBuffer = "";
       var wAlertSeparator = "";
       var wAlertCount = 0;

       wValueArray = eval(this.httpResponse);

       if (wValueArray != null)
       {
          for (var wName in wValueArray)
          {
              if (wName == "form_statusMsg") // Moving form_statusMsg to this.statusMsg
              {
                 this.statusMsg = wValueArray[wName];
              }
              else if (wName == "form_exception") // --> Moving form_exception to this.exceptionRaised
              {
                 if (wValueArray[wName] == "True")
                 {
                    this.exceptionRaised = true;
                 }
                 else
                 {
                    this.exceptionRaised = false;
                 }
              }
              else if (wName == "form_exceptionMessage") // --> Moving form_exception to this.exceptionRaised
              {
                 this.exceptionMessage = wValueArray[wName];
              }
              else if (wName == "form_alert")     // --> Loading wAlertBuffer 
              {
                 wAlertBuffer = wValueArray[wName];
              } 
              else
              {
                 if (wFieldBuffer == "")
                 {
                    wFieldBuffer = "({";
                 } 

                 wFieldBuffer += wFieldSeparator + wName + ":";
                 wFieldBuffer += "'" + wValueArray[wName] + "'";

                 wFieldSeparator = ",";
              }
          }
       } // --> Final de if (wValueArray != null)

       // Loading this.responseArray  
       if (wFieldBuffer != "")
       {
          wFieldBuffer += "})";
          this.responseArray = eval(wFieldBuffer); 
       } 

       // Loading this.alertArray  
       if (wAlertBuffer != "")
       {
          // This replace can't be removed ... 
          wAlertBuffer = wAlertBuffer.replace(/&delim;/g, "'");

          this.alertArray = eval(wAlertBuffer);
       }

       // Setting form attributes
       this.setFormAttributes(); 
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.analyzeArray()");
   }    
}

Ajax.prototype.analyzeXML = function ()
{
   try
   {
       var wDocument;
       var wRoot;
       var wFieldBuffer = "";
       var wFieldSeparator = "";

       var wAlertBuffer = "";
       var wAlertSeparator = "";
       var wAlertCount = 0;

       var wXml = this.httpResponse;

       if (window.ActiveXObject)
       {
          wDocument = new ActiveXObject("Microsoft.XMLDOM");

          if (!wDocument)
          {
             wDocument = new ActiveXObject("Msxml.DOMDocument");
          }

          wDocument.async = "false";
          wDocument.loadXML(wXml);
       }
       else
       {
          var wParser = new DOMParser();
          wDocument = wParser.parseFromString(wXml, "text/xml");
       }

       wRoot = wDocument.documentElement;

       if (wRoot == null)
       {
          alert(MSG_0300); // Xml contains invalid caracters
          return;
       }

       if (wRoot.childNodes == null)
       {
          alert(MSG_0300); // Xml contains invalid caracters
          return;
       }

       for (var wCount = 0; wCount < wRoot.childNodes.length; wCount++)
       {
           
           if (wRoot.childNodes[wCount].nodeName == "form_statusMsg") // Moving form_statusMsg to this.statusMsg
           {
              if (wRoot.childNodes[wCount].childNodes.length == 0)
              {
                 this.statusMsg = null;
              }
              else
              {
                 for (var wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
                 {
                     this.statusMsg = wRoot.childNodes[wCount].childNodes[0].nodeValue;
                 }
              }
           }
           else if (wRoot.childNodes[wCount].nodeName == "form_exception")   // Moving form_exception to this.exceptionRaised
           {
              if (wRoot.childNodes[wCount].childNodes.length == 0)
              {
                 this.exceptionRaised = false;
              }
              else
              {
                 for (var wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
                 {
                     if (wRoot.childNodes[wCount].childNodes[0].nodeValue == "True")
                     {
                        this.exceptionRaised = true;
                     }
                     else
                     {
                        this.exceptionRaised = false;
                     }
                 }
              }
           }
           else if (wRoot.childNodes[wCount].nodeName == "form_exceptionMessage")   // Moving form_exception to this.exceptionRaised
           {
              if (wRoot.childNodes[wCount].childNodes.length == 0)
              {
                 this.exceptionRaised = false;
              }
              else
              {
                 for (var wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
                 {
                     this.exceptionMessage = wRoot.childNodes[wCount].childNodes[0].nodeValue;
                 }
              }
           }
           else if (wRoot.childNodes[wCount].nodeName == "form_alert")    // Loading wAlertBuffer  
           {
              if (wAlertBuffer == "")
              {
                 wAlertBuffer = "({";
              } 

              wAlertBuffer += wAlertSeparator + wRoot.childNodes[wCount].nodeName + "_" + wAlertCount + ":";
              
              wAlertCount++;

              if (wRoot.childNodes[wCount].childNodes.length == 0)
              {
                 wAlertBuffer += "''";
              }
              else
              {
                 for (var wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
                 {
                     wAlertBuffer += "'" + wRoot.childNodes[wCount].childNodes[0].nodeValue + "'";
                 }
              }

              wAlertSeparator = ",";
           }
           else
           {
              if (wFieldBuffer == "")
              {
                 wFieldBuffer = "({";
              } 

              wFieldBuffer += wFieldSeparator + wRoot.childNodes[wCount].nodeName + ":";

              if (wRoot.childNodes[wCount].childNodes.length == 0)
              {
                 wFieldBuffer += "''";
              }
              else
              {
                 for (var wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
                 {
                     wFieldBuffer += "'" + wRoot.childNodes[wCount].childNodes[0].nodeValue + "'";
                 }
              }

              wFieldSeparator = ",";
          }
       }

       // Loading this.responseArray  
       if (wFieldBuffer != "")
       {
          wFieldBuffer += "})";
          wFieldBuffer = wFieldBuffer.replace(/&lt;/g, "<");
          wFieldBuffer = wFieldBuffer.replace(/&amp;/g, "&");
          this.responseArray = eval(wFieldBuffer); 
       } 

       // Loading this.alertArray  
       if (wAlertBuffer != "")
       {
          wAlertBuffer += "})";
          wAlertBuffer = wAlertBuffer.replace(/&lt;/g, "<");
          wAlertBuffer = wAlertBuffer.replace(/&amp;/g, "&");
          this.alertArray = eval(wAlertBuffer);
       } 

       // Setting form attributes
       this.setFormAttributes(); 
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.analyzeXML()");
   }    
}

Ajax.prototype.setFormAttributes = function ()
{
   try
   {
       // Setting form.exception
       if (this.exceptionRaised == true)
       {
          form.setAttribute("exception", "true"); 
       }
       else
       {
          form.setAttribute("exception", "false"); 
       }

       // Setting form.exceptionMessage 
       if (this.exceptionMessage == null)
       {
          form.setAttribute("exceptionMessage", ""); 
       }
       else
       {
          form.setAttribute("exceptionMessage", this.exceptionMessage); 
       }

       // Setting form.statusMsg 
       if (this.statusMsg == null)
       {
          form.setAttribute("statusMsg", ""); 
       }
       else
       {
          form.setAttribute("statusMsg", this.statusMsg); 
       }
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax.setFormAttributes()");
   }    
}

Ajax.prototype.encodingUrl = function (str)
{  
    var hex_chars = "0123456789ABCDEF";  
    var noEncode = /^([a-zA-Z0-9\_\-\.\=\;\&\,])$/;  
    var strCode, hex1, hex2, strEncode = "";  

    for (var n = 0; n < str.length; n++) 
    {  
        if (noEncode.test(str.charAt(n))) 
        {  
            strEncode += str.charAt(n);  
        } 
        else 
        {  
            strCode = str.charCodeAt(n);  
            hex1 = hex_chars.charAt(Math.floor(strCode / 16));  
            hex2 = hex_chars.charAt(strCode % 16);  
            strEncode += "%" + (hex1 + hex2);  
        }  
    }  

    return strEncode;  
}

var ajax = new Ajax(true);
