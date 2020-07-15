var js_submitMode = "";
var ajax_compatibility = "Version 7.2";
var js_exceptionRaised = false;

var option_invokeMode = "";
var raise_error = false;
var raise_element = null;

// Js Methods _________________________________________________________

/*
 * Returns a 'range' object with properties 'start' and 'end' with values of
 * start and end positions of selected text in a text element.
 */
function getSelection(el) {
	var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

	if (typeof el.selectionStart == "number"
			&& typeof el.selectionEnd == "number") {
		start = el.selectionStart;
		end = el.selectionEnd;
	} else {
		range = document.selection.createRange();

		if (range && range.parentElement() == el) {
			len = el.value.length;
			normalizedValue = el.value.replace(/\r\n/g, "\n");
            
			// Create a working TextRange that lives only in the input
			textInputRange = el.createTextRange();
			textInputRange.moveToBookmark(range.getBookmark());
            
			// Check if the start and end of the selection are at the very end
			// of the input, since moveStart/moveEnd doesn't return what we want
			// in those cases
			endRange = el.createTextRange();
			endRange.collapse(false);
            
			if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
				start = end = len;
			} else {
				start = -textInputRange.moveStart("character", -len);
				start += normalizedValue.slice(0, start).split("\n").length - 1;
                
				if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
					end = len;
				} else {
					end = -textInputRange.moveEnd("character", -len);
					end += normalizedValue.slice(0, end).split("\n").length - 1;
				}
			}
		}
	}

	return {
		start : start,
		end : end
	};
}

function js_validateMaxlength(pEvent, pControl) {
	// Get Max Length.
	var wMaxLength;

	if (pControl.getAttribute("maxLength") == null)
	{
	    wMaxLength = 214748364;	 
	}
	else
	{
	    wMaxLength = parseInt(pControl.getAttribute("maxLength"), 10);
	}
	
	// Get decimal separator.
	var wDecimalSeparator = form.getAttribute("decimalSeparator");
	if (wDecimalSeparator == null) {
		wDecimalSeparator = ".";
	}

	// Get keyPressed.
	var wKeyCode = pEvent.which || pEvent.keyCode;
	var wKeyValue = String.fromCharCode(wKeyCode);

	// Get and clear control value.
	var range = getSelection(pControl);
	var wStartPos = range.start;
	var wEndPos = range.end;
	var wWord = pControl.value;

	// Remove selected area.
	var wPrefix = "";
	if (wStartPos > 0) {
		wPrefix = wWord.substring(0, wStartPos);
	}

	var wSufix = "";
	if (wEndPos < wMaxLength) {
		wSufix = wWord.substring(wEndPos, wMaxLength);
	}

	wWord = wPrefix + wKeyValue + wSufix;

	// Get digits places.
	var wIntegers = 0;
	var wDecimals = parseInt(pControl.getAttribute("decimals"), 10);
	var wMask = pControl.getAttribute("mask");

	if (wMask == null || wMaxLength > wMask.length) {
		if (wDecimals > 0) {
			wIntegers = wMaxLength - wDecimals - 1;
		} else {
			wIntegers = wMaxLength;
		}
	} else {
		wIntegers = 0;
		for (i = 0; i < wMask.length; i++) {
			if (wMask.charAt(i) == ".") {
				break;
			} else if (wMask.charAt(i) == "9" || wMask.charAt(i) == "#"
					|| wMask.charAt(i) == "0") {
				wIntegers++;
			}
		}
	}

	// Count digits.
	var wDecCount = 0;
	var wIntCount = 0;
	var wIsDec = false;

	for (i = 0; i < wWord.length; i++) {
		if (wWord.charAt(i) == wDecimalSeparator) {
			wIsDec = true;
		} else if (wWord.charAt(i) >= "0" && wWord.charAt(i) <= "9") {
			if (wIsDec) {
				wDecCount++;
			} else {
				wIntCount++;
			}
		}
	}

	if (wDecCount > wDecimals) {
		return false;
	}

	if (wIntCount > wIntegers) {
		return false;
	}

	return true;
}

function js_clearElements()
{
    try
    {
	   js_exceptionRaised = false;

       form.setAttribute("LastKeyCode", "");
       form.setAttribute("LastShiftKey", "");
       form.setAttribute("LastAltKey", "");
       form.setAttribute("LastCtrlKey", "");
    }
    catch (Err)
    {
       fatalMsg(Err, "js_clearElements");
    }    
}

function js_submitHandler()
{
    try
    {
       form.setAttribute("LastAction", "Submit");
    }
    catch (Err)
    {
       fatalMsg(Err, "js_submitHandler");
    }    
}

function js_clickHandler()
{
    try
    {
       if (js_exceptionRaised == true)
       {
	  return true;
       }

       return false;
    }
    catch (Err)
    {
       fatalMsg(Err, "js_clickHandler");
    }    
}

function js_onkeydown()
{
    try
    {
       form.setAttribute("LastKeyCode", event.keyCode);
       form.setAttribute("LastShiftKey", event.shiftKey);
       form.setAttribute("LastAltKey", event.altKey);
       form.setAttribute("LastCtrlKey", event.ctrlKey);

       if (event.keyCode == 34) 
       {
          form_submit();
       }

       if (event.shiftKey == true && event.keyCode == 123 ) // Shift-F12
       {
          var wExceptionMessage = form.getAttribute("exceptionMessage");

          if (wExceptionMessage != null)
          {
             alert( wExceptionMessage );
          }
       }		 
    }
    catch (Err)
    {
       fatalMsg(Err, "js_onkeydown");
    }    
}

function js_keydownHandler(pEvent)
{
    try
    {
       form.setAttribute("LastKeyCode", pEvent.keyCode);
       form.setAttribute("LastShiftKey", pEvent.shiftKey);
       form.setAttribute("LastAltKey", pEvent.altKey);
       form.setAttribute("LastCtrlKey", pEvent.ctrlKey);

       if (pEvent.keyCode == 34) 
       {
          form_submit();
       }

       if (pEvent.shiftKey == true && pEvent.keyCode == 123 ) // Shift-F12
       {
          var wExceptionMessage = form.getAttribute("exceptionMessage");

          if (wExceptionMessage != null)
          {
             alert( wExceptionMessage );
          }
       }		 
    }
    catch (Err)
    {
       fatalMsg(Err, "js_onkeydown");
    }    
}

function js_movingFocus()
{
    try
    {
        js_exceptionRaised = false; 

        var wElement;

        if (js.ignoreValidation == true)
        {
           js.ignoreValidation = false;

           return true;
        }

        if (document.hasFocus() == false )
        {
           return true;
        }

        if (get("form_mode") == "PrepareQuery")
        {
           return true;
        }

        if (event.toElement == null)
        {   
           return true;
        }

        if (event.toElement.getAttribute("validateMode") != null)
        {
           var wValidateMode = event.toElement.getAttribute("validateMode");

           if (wValidateMode == "Ignore")
           {
              return true;
           }  
           else if (wValidateMode == "Customize")
           {
              return true;
           }  
           else if (wValidateMode == "CheckMaster")
           {
              if (event.toElement.getAttribute("masterField") != null)
              {
                 if (event.toElement.getAttribute("masterField") == event.srcElement.id)
                 {
                    return true;
                 }
                 else
                 {
                    return false;
                 }              
              } 
           }  
        } 

        // Validating Required Attribute ...
        if (event.srcElement.getAttribute("required") == "True") 
        {
           js_validateRequired(event.srcElement);
           
           if (js_exceptionRaised == true)
           {
              return true;
           }
        }  

        return false;
    }
    catch (Err)
    {
       fatalMsg(Err, "js_movingFocus");
    }    
}


function js_onclickForCheckBox(pObject, pObjectName, pDatablock, pCheckedValue, pUncheckedValue)
{
    try
    {
        var wField = getElement(pObjectName);
        var wInput = getElement(pObjectName + "_checkbox");

        if ( wInput.checked == true )
        {
           wField.value = wField.getAttribute("checkedValue");
        }
        else
        {
           wField.value = wField.getAttribute("uncheckedValue");
        }

        if (pDatablock != "")
        {
           js_setStatus(); 
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_onclickForCheckBox");
    }    
}

function js_onfocusin(pControl, pPanel)
{
    try 
    {
	   js.onFocus(pControl);
       /*	   
       js_clearElements();

       var wActiveControl = getElement("form_activeControl");

       if (wActiveControl == null)
       {
          return; 
       }

       wActiveControl.value = pControl.id;

       if (pPanel != null)
       {
          js_selectLine(pControl, pPanel);
       }
	   */
    }
    catch (Err)
    {
       fatalMsg(Err, "js_onfocusin");
    }    
}

function js_selectLine(pControl, pPanel)
{
    try 
    {
        var wFieldArray;
        var wInitialValue;

        if (pPanel != null)
        {
           var wActivePanel   = getElement("form_activePanel");
           wActivePanel.value = pPanel;

           // Change the default value of the selected Panel
           if ( js_getStatus() == "INSERT")
           {
              wFieldArray = panel.getSubFields(pPanel);

              for (var i = 0; i < wFieldArray.length; i++)
              {
                  wField = wFieldArray[i];

                  if (wField.value == "")
                  {
                     wInitialValue = wField.getAttribute("InitialValue");

                     if (wInitialValue != null && wInitialValue != "" )
                     {
                        setProperty(wField, "InitialValue", wInitialValue);
                     } 
                  }
              }
           }

           // Change the backgroundColor of the selected Panel
           var wPanel = getElement(pPanel);

           if (wPanel.getAttribute("subPanelOf") != null)
           {
              var wCollectionPanel = getElement(wPanel.getAttribute("subPanelOf"));
              var wSelected = getElement(wCollectionPanel.id + "_selected");
              var wCurrent = getElement(wCollectionPanel.id + "_current");

              // Clears the backgroundColor of the previous selected Panel

              wFieldArray = panel.getSubFields(wCollectionPanel.id + "_panel_" + wSelected.value);

              for (i = 0; i < wFieldArray.length; i++)
              {
                  wField = wFieldArray[i];

                  setProperty(wField, "backgroundColor", wField.getAttribute("originalBackgroundColor")); 
              }

              wFieldArray = panel.getSubFields(pPanel);

              // Finding the selectedBackColor of the DBCollection
              var wSelectedBackColor = wCollectionPanel.getAttribute("selectedBackColor");

              // Change the backgroundColor of the selected Panel
              for (i = 0; i < wFieldArray.length; i++)
              {
                  wField = wFieldArray[i];

                  if (wSelectedBackColor == null)
                  { 
                     setProperty(wField, "backgroundColor", "#FFFF80");
                  }
                  else
                  {
                     setProperty(wField, "backgroundColor", wSelectedBackColor);
                  } 

              }

              wSelected.value = wPanel.getAttribute("occurrence");
              wCurrent.value = wSelected.value;
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_selectLine");
    }    
}

function js_unselectLine()
{
    try
    {

    }
    catch (Err)
    {
       fatalMsg(Err, "js_unselectLine");
    }    
}

function js_setStatus()
{
    try
    {
       var wActivePanel  = getElement( get("form_activePanel") );

       if (wActivePanel == null)
       {
          return;
       }

       var wFormStatus   = getElement("form_status");
       var wFormMode     = getElement("form_mode");
       var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
       var wRowId        = getElement(wActivePanel.id + "_rowid");

       if (wActivePanel.getAttribute("toolbarMode") != "Basic")
       {
          if (wFormMode.value != "PrepareQuery")
          {
             if ( (wRecordStatus.value == "" && wRowId.value == "") || wRecordStatus.value.toUpperCase() == "INSERT")
             {
                wRecordStatus.value = "INSERT";
             }
             else
             {
                wRecordStatus.value = "CHANGED";
             }

             wFormStatus.value = "CHANGED";
          }
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_setStatus");
    }    
}

function js_getStatus()
{
    try
    {
       var wActivePanel  = getElement( get("form_activePanel") );

       if (wActivePanel == null)
       {
          return "";
       }

       var wFormStatus   = getElement("form_status");
       var wFormMode     = getElement("form_mode");
       var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
       var wRowId        = getElement(wActivePanel.id + "_rowid");

       if (wActivePanel.getAttribute("toolbarMode") != "Basic")
       {
          if (wFormMode.value != "PrepareQuery")
          {
             if ( (wRecordStatus.value == "" && wRowId.value == "") || wRecordStatus.value.toUpperCase() == "INSERT")
             {
                return "INSERT";
             }
             else
             {
                return "CHANGED";
             }
          }
       }

       return "";
    }
    catch (Err)
    {
       fatalMsg(Err, "js_getStatus");
    }    
}

function js_validateRequired(pObject)
{
    try
    {
       if (rTrim(pObject.value) == "")
       {
          raise(MSG_0001);
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_validateRequired");
    }    
}

function js_validateHighest(pObject, pHighest)
{
    try
    {
       if (pObject.value > pHighest)
       {
          raise(MSG_0010  + " (" + pHighest + ")");
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_validateHighest");
    }    
}

function js_validateLowest(pObject, pLowest)
{
    try
    {
       if (pObject.value < pLowest)
       {
          raise(MSG_0011 + " (" + pLowest + ")");
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_validateLowest");
    }    
}

function js_openPopup(pObjectName)
{
    // Deprecated method, replaced by popup.post ...
    try
    {
        popup.post(pObjectName);
    }
    catch (Err)
    {
       fatalMsg(Err, "js_openPopup");
    }    
}

function form_validatePopup(pControl)
{
    try
    {
        var wControl = getElement(pControl);
        var wBuffer = wControl.getAttribute("returnFields");
        var wFields = new Array();
        var wIndex = 0;
        var wEachElement;

        // ReturnField Array
        if (wBuffer.indexOf(",") == -1)
        {
           wFields[0] = wBuffer;
        }
        else
        {
           while (wBuffer.indexOf(",") != -1)
           {
              wFields[wIndex] = wBuffer.substr(0, wBuffer.indexOf(","));
              wBuffer = wBuffer.substr(wBuffer.indexOf(",") + 1);       
              wIndex++;
           }

           wFields[wIndex] = wBuffer;
        }

        // Validating AllowInsert, AllowUpdate e AllowQuery
        var wActivePanel  = getElement( get("form_activePanel") );

        if (wActivePanel != null)
        {
           var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
           var wRowId        = getElement(wActivePanel.id + "_rowid");

           var wMasterField;

           if (wControl.getAttribute("masterField") != null)
           {
              wMasterField  = getElement( wControl.getAttribute("masterField") );
           }

           if (wRecordStatus.value == "DELETE")
           {
              alert(MSG_0210); // Record selected to be deleted
              return "Error";
           }

           // Allow Insert and Allow Update validation
           var wFormMode = getElement("form_mode");

           if (wFormMode.value == "PrepareQuery")
           {
              if (wMasterField != null)
              {
                 if ( wMasterField.getAttribute("allowQuery") == 'False' ) 
                 {
                    alert(MSG_0203); // Field is protected against inquiry
                    setFocus(wMasterField);
                    return "Error";
                 }
              }
              else
              {   
                 for (var j = 0; j < wFields.length; j++)
                 {
                     wEachElement = getElement(wFields[j]);
                     if ( wEachElement.getAttribute("allowQuery") == "False" ) 
                     {
                        alert(MSG_0203); // Field is protected against inquiry
                        setFocus(wEachElement);
                        return "Error";
                     }
                  }  
              }
           } 
           else
           { 
              if ( (wRecordStatus.value == "" && wRowId.value == "") || wRecordStatus.value.toUpperCase() == "INSERT")
              {
                 if (wMasterField != null)
                 {
                    if ( wMasterField.getAttribute("allowInsert") == 'False' ) 
                    {
                       alert(MSG_0201); // Field is protected against insert
                       setFocus(wMasterField);
                       return "Error";
                    }
                 }
                 else
                 {   
                    for (j = 0; j < wFields.length; j++)
                    {
                        wEachElement = getElement(wFields[j]);

                        if (wEachElement != null)
                        {  
                           if ( wEachElement.getAttribute("allowInsert") == 'False' ) 
                           {
                              alert(MSG_0201); // Field is protected against insert
                              setFocus(wEachElement);
                              return "Error";
                           }
                        } 
                     }  
                 }
              }
              else
              {
                 if (wMasterField != null)
                 {
                    if ( wMasterField.getAttribute("allowUpdate") == "False" ) 
                    {
                       alert(MSG_0202); // Field is protected against update
                       setFocus(wMasterField);
                       return "Error";
                    }
                 }
                 else
                 {   
                    for (j = 0; j < wFields.length; j++)
                    {
                        wEachElement = getElement(wFields[j]);
                        if (wEachElement != null)
                        {  
                           if ( wEachElement.getAttribute("allowUpdate") == 'False' ) 
                           {
                              alert(MSG_0202); // Field is protected against update
                              setFocus(wEachElement);
                              return "Error";
                           }
                        } 
                     }  
                 }
              }
           }
        }
    
        return "";
    }
    catch (Err)
    {
       fatalMsg(Err, "form_validatePopup");
    }    
}

function js_dropdownClick(pName) 
{
    try
    {
        var wTextbox = getElement(pName + "_textbox");
        var wListbox = getElement(pName + "_listbox");
        var wDropdown = getElement(pName + "_dropdown");

        var wActivePanel  = getElement( get("form_activePanel") );

        if ( wActivePanel != null )
        {
           var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
           var wRowId        = getElement(wActivePanel.id + "_rowid");

           if (wRecordStatus.value == "DELETE")
           {
              alert(MSG_0210); // Record selected to be deleted
              return;
           }

           // Allow Insert and Allow Update validation
           var wFormMode     = getElement("form_mode");
           var wField;

           if (wFormMode.value == "PrepareQuery")
           {
              wField = getElement(pName);

              if ( wField.getAttribute("allowQuery") == "False" ) 
              {
                 alert(MSG_0203); // Field is protected against inquiry
                 return;
              }
           } 
           else
           { 
              if ( (wRecordStatus.value == "" && wRowId.value == "") || wRecordStatus.value.toUpperCase() == "INSERT")
              {
                 wField = getElement(pName);

                 if ( wField.getAttribute("allowInsert") == "False" ) 
                 {
                    alert(MSG_0201); // Field is protected against insert
                    return;
                 }
              }
              else
              {
                 wField = getElement(pName);

                 if ( wField.getAttribute("allowUpdate") == "False" ) 
                 {
                    alert(MSG_0202); // Field is protected against update
                    return;
                 }
              }
           }
        }

        if (wListbox.style.visibility.toUpperCase() == 'HIDDEN') 
        {
            wListbox.style.top = parseInt(wTextbox.style.top) + parseInt(wTextbox.style.height);
            wListbox.style.left = wTextbox.style.left;
            wListbox.style.width = parseInt(wTextbox.style.width) + parseInt(wDropdown.style.width);

            wListbox.style.visibility = 'inherit';

            wListbox.options[0].selected = true;

            for (i = 0; i < wListbox.options.length; i++) 
            {
                if (wTextbox.value == wListbox.options[i].text)
                {
                   wListbox.options[i].selected = true;
                }
            }

            setFocus(wListbox);
        } 
        else 
        {
            wListbox.style.visibility = 'hidden';
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_dropdownClick");
    }    
}

function js_listboxBlur(pName) 
{
    try
    {
       wListbox = getElement(pName + "_listbox");
       wListbox.style.visibility = 'hidden';
    }
    catch (Err)
    {
       fatalMsg(Err, "js_listboxBlur");
    }    
}

function js_listboxClick(pName) 
{
    try
    {
        var wTextbox = getElement(pName + "_textbox");
        var wListbox = getElement(pName + "_listbox");
        var wCombobox = getElement(pName);

        for (i = 0; i < wListbox.options.length; i++) 
        {
            if (wListbox.options[i].selected == true) 
            {
                wTextbox.value = wListbox.options[i].text;

                if (wCombobox.value != wListbox.options[i].value)
                {
                   wCombobox.value = wListbox.options[i].value;

                   form_changeStatus(wCombobox);            
                }
            }
        }

        wListbox.style.visibility = 'hidden';

        setFocus(wTextbox);
    }
    catch (Err)
    {
       fatalMsg(Err, "js_listboxClick");
    }    
}

function js_setValueForCombobox(pField) 
{
    try
    {
        var wTextbox = getElement(pField.id + "_textbox");
        var wListbox = getElement(pField.id + "_listbox");
        var wCombobox = pField;

        wTextbox.value = wCombobox.value;

        for (i = 0; i < wListbox.options.length; i++) 
        {
            if (wCombobox.value == wListbox.options[i].value)
            {
                wTextbox.value = wListbox.options[i].text;
            }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_setValueForCombobox");
    }
}

function js_textboxKeyup(pName, pValue) 
{
    try
    {
        var wListbox = getElement(pName + "_listbox");
        var wCombobox = getElement(pName);

        wCombobox.value = pValue;

        for (i = 0; i < wListbox.options.length; i++) 
        {
            if (wListbox.options[i].text.toUpperCase() == pValue.toUpperCase()) 
            {
                wListbox.selectedIndex = i;
                wCombobox.value = wListbox.options[i].value;
	    	break;
            } 
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js_textboxKeyup");
    }    
}

// Form Methods _________________________________________________________

function form_onfocusin(pControl, pPanel)
{
    try
    {
        var wActiveControl = getElement("form_activeControl");

        wActiveControl.value = pControl.id;

        if (pPanel != null)
        {
           var wFormActivePanel = getElement("form_activePanel");
           wFormActivePanel.value = pPanel;
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_onfocusin");
    }    
}

function form_onload()
{
    try
    {
        form_showAlerts();

        var wActiveControl = getElement("form_activeControl");

        if (wActiveControl.value != "")
        {
           if (wActiveControl.value.toUpperCase() == "(PANEL)")
           {
              var wActivePanel = getElement( get("form_activePanel") );

              if (wActivePanel != null)
              { 
                 form_setPanelFocus(wActivePanel.id);   
              }
    
              wActiveControl = getElement("form_activeControl");
           }

           var wControl = getElement(wActiveControl.value);

           if (wControl != null)
           {
              setFocus(wControl);
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_onload");
    }    
}

function form_setActivePanel(pActivePanel)
{
    try
    {
        var wFormActivePanel = getElement("form_activePanel");
    
        if (wFormActivePanel != null) 
        {
           wFormActivePanel.value = pActivePanel;
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_setActivePanel");
    }    
}

function form_keyPress(pControl, pEvent, pDatatype, pAllowInsert, pAllowUpdate, pCaseRestriction)
{
    try
    {
        var wField;

        var wFormMode = getElement("form_mode");

        if (wFormMode != null && wFormMode.value != "PrepareQuery")
        {
           var wActivePanel;
           if ( get("form_activePanel") != "")
           {
              wActivePanel = getElement( get("form_activePanel") );
           }

           if ( wActivePanel != null )
           {
              // Allow Insert and Allow Update validation
              var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
              var wRowId        = getElement(wActivePanel.id + "_rowid");

              if ( (wRecordStatus.value == "" && wRowId.value == "") || wRecordStatus.value.toUpperCase() == "INSERT")
              {
                 if (pAllowInsert == 'FALSE')
                 {
                    alert(MSG_0201); // Field is protected against insert
                    js.resetKeyCode(pEvent);
                    return;
                 }
              }
              else
              {
                 if (pAllowUpdate == 'FALSE')
                 {
                    js.resetKeyCode(pEvent);
                    return;
                 }
              }
           }

           // Numeric field validation
           if (pDatatype == 'NUMBER')
           {
              if (browser.isIE())
              {
                 var wDecimalSeparator = form.getAttribute("decimalSeparator"); // The default decimal separator is dot
                 var wDecimalSeparatorKeyCode = 46; // The default decimal separator is dot

                 if (wDecimalSeparator != null && wDecimalSeparator == ',')
                 {
                    wDecimalSeparatorKeyCode = 44;
                 }

                 if (pEvent.keyCode != 48 &&
                     pEvent.keyCode != 49 &&
                     pEvent.keyCode != 50 &&
                     pEvent.keyCode != 51 &&
                     pEvent.keyCode != 52 &&
                     pEvent.keyCode != 53 &&
                     pEvent.keyCode != 54 &&
                     pEvent.keyCode != 55 &&
                     pEvent.keyCode != 56 &&
                     pEvent.keyCode != 57 &&
                     pEvent.keyCode != wDecimalSeparatorKeyCode )
                 {
                     alert(MSG_0200); // Invalid KeyCode on numeric fields
                     pEvent.keyCode = 0;
                     return;
                 }

                 // Checking if the field contains decimals ...
                 var wDecimals = pControl.getAttribute("decimals");
                 if ( wDecimals == null && pEvent.keyCode == wDecimalSeparatorKeyCode )
                 {
                     alert(MSG_0310); // Invalid KeyCode on numeric fields without decimals
                     pEvent.keyCode = 0;
                     return;
                 }
				 if (pEvent.keyCode == wDecimalSeparatorKeyCode && pControl.value.indexOf(wDecimalSeparator) != -1) 
				 {
					alert(MSG_0324); // Too many decimal separators
					pEvent.keyCode = 0;
					return;
				 } 
				 else if (!js_validateMaxlength(pEvent, pControl)) {
					pEvent.keyCode = 0;
					return;
				 }
              }
              else
              {
	             var wDecimalSeparator = form.getAttribute("decimalSeparator"); // The default decimal separator is dot
                 var wDecimalSeparatorKeyCode = 46; // The default decimal separator is dot

                 if (wDecimalSeparator != null && wDecimalSeparator == ',')
                 {
                    wDecimalSeparatorKeyCode = 44;
                 }

                 if (pEvent.which != 48 &&
                     pEvent.which != 49 &&
                     pEvent.which != 50 &&
                     pEvent.which != 51 &&
                     pEvent.which != 52 &&
                     pEvent.which != 53 &&
                     pEvent.which != 54 &&
                     pEvent.which != 55 &&
                     pEvent.which != 56 &&
                     pEvent.which != 57 &&
                     pEvent.which != 27 &&
                     pEvent.which != 13 &&
                     pEvent.which != 8 &&
                     pEvent.which != 0 &&
                     pEvent.which != wDecimalSeparatorKeyCode )
                 {
                     alert(MSG_0200); // Invalid KeyCode on numeric fields
                     pEvent.preventDefault();
                     return;
                 }

                 // Checking if the field contains decimals ...
                 var wDecimals = pControl.getAttribute("decimals");
                 if ( wDecimals == null && pEvent.which  == wDecimalSeparatorKeyCode )
                 {
                     alert(MSG_0310); // Invalid KeyCode on numeric fields without decimals
                     pEvent.preventDefault();
                     return;
                 }
				 
                 if (pEvent.keyCode == wDecimalSeparatorKeyCode && pControl.value.indexOf(wDecimalSeparator) != -1) {
            	 	alert(MSG_0324); // Too many decimal separators
            	 	pEvent.preventDefault();
            	 	return;
                 }
                 else if (!js_validateMaxlength(pEvent, pControl))
				 {
					 pEvent.preventDefault();
					 return;
				 }	
              }				 
          }
       }

       // Case Restriction validation
       if (pCaseRestriction == 'UPPERCASE')
       {
          if (browser.isIE())
          {
             if (pEvent.keyCode >= 97 && pEvent.keyCode <= 122)
             {
                pEvent.keyCode = pEvent.keyCode - 32;
             }

             if (pEvent.keyCode == 231) { pEvent.keyCode = 199; }

             if (pEvent.keyCode == 225) { pEvent.keyCode = 193; }
             if (pEvent.keyCode == 233) { pEvent.keyCode = 201; }
             if (pEvent.keyCode == 237) { pEvent.keyCode = 205; }
             if (pEvent.keyCode == 243) { pEvent.keyCode = 211; }
             if (pEvent.keyCode == 250) { pEvent.keyCode = 218; }

             if (pEvent.keyCode == 226) { pEvent.keyCode = 194; }
             if (pEvent.keyCode == 234) { pEvent.keyCode = 202; }
             if (pEvent.keyCode == 238) { pEvent.keyCode = 206; }
             if (pEvent.keyCode == 244) { pEvent.keyCode = 212; }
             if (pEvent.keyCode == 251) { pEvent.keyCode = 219; }

             if (pEvent.keyCode == 227) { pEvent.keyCode = 195; }
             if (pEvent.keyCode == 245) { pEvent.keyCode = 213; }
          }
          else
          {
             if (pEvent.which >= 97 && pEvent.which <= 122)
             {
                pThis.value += String.fromCharCode(pEvent.which).toUpperCase();
      	        pEvent.preventDefault();
             }

             if (pEvent.which == 231) { pThis.value += String.fromCharCode(199); pEvent.preventDefault();}

             if (pEvent.which == 225) { pThis.value += String.fromCharCode(193); pEvent.preventDefault(); }
             if (pEvent.which == 233) { pThis.value += String.fromCharCode(201); pEvent.preventDefault(); }
             if (pEvent.which == 237) { pThis.value += String.fromCharCode(205); pEvent.preventDefault(); }
             if (pEvent.which == 243) { pThis.value += String.fromCharCode(211); pEvent.preventDefault(); }
             if (pEvent.which == 250) { pThis.value += String.fromCharCode(218); pEvent.preventDefault(); }

             if (pEvent.which == 226) { pThis.value += String.fromCharCode(194); pEvent.preventDefault(); }
             if (pEvent.which == 234) { pThis.value += String.fromCharCode(202); pEvent.preventDefault(); }
             if (pEvent.which == 238) { pThis.value += String.fromCharCode(206); pEvent.preventDefault(); }
             if (pEvent.which == 244) { pThis.value += String.fromCharCode(212); pEvent.preventDefault(); }
             if (pEvent.which == 251) { pThis.value += String.fromCharCode(219); pEvent.preventDefault(); }

             if (pEvent.which == 227) { pThis.value += String.fromCharCode(195); pEvent.preventDefault(); }
             if (pEvent.which == 245) { pThis.value += String.fromCharCode(213); pEvent.preventDefault(); }
          }
       }
       else if (pCaseRestriction == 'LOWERCASE')
       {
          if (browser.isIE())
          {
             if (pEvent.keyCode >= 65 && pEvent.keyCode <= 90)
             {
                pEvent.keyCode = pEvent.keyCode + 32;
             }

             if (pEvent.keyCode == 199) { pEvent.keyCode = 231; }

             if (pEvent.keyCode == 193) { pEvent.keyCode = 225; }
             if (pEvent.keyCode == 201) { pEvent.keyCode = 233; }
             if (pEvent.keyCode == 205) { pEvent.keyCode = 237; }
             if (pEvent.keyCode == 211) { pEvent.keyCode = 243; }
             if (pEvent.keyCode == 218) { pEvent.keyCode = 250; }

             if (pEvent.keyCode == 194 ) { pEvent.keyCode = 226; }
             if (pEvent.keyCode == 202 ) { pEvent.keyCode = 234; }
             if (pEvent.keyCode == 206 ) { pEvent.keyCode = 238; }
             if (pEvent.keyCode == 212 ) { pEvent.keyCode = 244; }
             if (pEvent.keyCode == 219 ) { pEvent.keyCode = 251; }

             if (pEvent.keyCode == 195 ) { pEvent.keyCode = 227; }
             if (pEvent.keyCode == 213 ) { pEvent.keyCode = 245; }
          }
          else
          {
             if (pEvent.which >= 65 && pEvent.which <= 90)
             {
                pThis.value += String.fromCharCode(pEvent.which).toLowerCase();
            pEvent.preventDefault();
             }

             if (pEvent.which == 199) { pThis.value += String.fromCharCode(231); pEvent.preventDefault();}

             if (pEvent.which == 193) { pThis.value += String.fromCharCode(225); pEvent.preventDefault();}
             if (pEvent.which == 201) { pThis.value += String.fromCharCode(233); pEvent.preventDefault();}
             if (pEvent.which == 205) { pThis.value += String.fromCharCode(237); pEvent.preventDefault();}
             if (pEvent.which == 211) { pThis.value += String.fromCharCode(243); pEvent.preventDefault();}
             if (pEvent.which == 218) { pThis.value += String.fromCharCode(250); pEvent.preventDefault();}
             if (pEvent.which == 194 ) { pThis.value += String.fromCharCode(226); pEvent.preventDefault();}
             if (pEvent.which == 202 ) { pThis.value += String.fromCharCode(234); pEvent.preventDefault();}
             if (pEvent.which == 206 ) { pThis.value += String.fromCharCode(238); pEvent.preventDefault();}
             if (pEvent.which == 212 ) { pThis.value += String.fromCharCode(244); pEvent.preventDefault();}
             if (pEvent.which == 219 ) { pThis.value += String.fromCharCode(251); pEvent.preventDefault();}

             if (pEvent.which == 195 ) { pThis.value += String.fromCharCode(227); pEvent.preventDefault();}
             if (pEvent.which == 213 ) { pThis.value += String.fromCharCode(245); pEvent.preventDefault();}
          }
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_keyPress");
    }    
}

function form_changeStatus(pControl)
{
    try
    {
        var wActivePanel = getElement( get("form_activePanel") );

        if (wActivePanel == null )
        {
           return;       
        }

        var wFormStatus   = getElement("form_status");
        var wFormMode     = getElement("form_mode");
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
        var wRowId        = getElement(wActivePanel.id + "_rowid");

        if (wActivePanel.getAttribute("toolbarMode") != "Basic")
        {
           if (wFormMode.value != "PrepareQuery")
           {
              if ( (wRecordStatus.value == "" && wRowId.value == "") || wRecordStatus.value.toUpperCase() == "INSERT")
              {
                 wRecordStatus.value = "INSERT";
              }
              else
              {
                 wRecordStatus.value = "CHANGED";
              }
              wFormStatus.value = "CHANGED";
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_changeStatus");
    }    
}

function form_changeStatusForLOV(pControl)
{
    try
    {
        if (browser.isIE() && event.propertyName != "value")
        {
           return;
        }

        var wActivePanel  = getElement( get("form_activePanel") );
        var wFormStatus   = getElement("form_status");
        var wFormMode     = getElement("form_mode");
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
        var wRowId        = getElement(wActivePanel.id + "_rowid");

        if (wActivePanel.getAttribute("toolbarMode") != "Basic")
        {
           if (wFormMode.value != "PrepareQuery")
           {
              if ( (wRecordStatus.value == "" && wRowId.value == "") || wRecordStatus.value.toUpperCase() == "INSERT")
              {
                 wRecordStatus.value = "INSERT";
              }
              else
              {
                 wRecordStatus.value = "CHANGED";
              }

              wFormStatus.value = "CHANGED";
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_changeStatusForLOV");
    }    
}

// Transforma um objeto ArrayLike em Array -   similiar a copyArray() do Innovation.js
function toArray(pArrayLike)
{
	var wArray = [];
		
	for (var i = 0; i < pArrayLike.length; ++i)
	{
		wArray.push(pArrayLike[i]);
	}
		
	return wArray;
}

function form_executeQuery() 
{
    try
    {
        var wActivePanel = getElement( get("form_activePanel") );

        if ( wActivePanel == null )
        {
           alert("N�o existe painel selecionado. Consulta n�o pode ser realizada");
           return; 
        }

        var wFormMode = getElement("form_mode");
        var wFormStatus = getElement("form_status");
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
        var wDynamicWhere = getAttribute("dynamicWhere");
        var wGroupingSeparator = form.getAttribute("groupingSeparator");
        var wDecimalSeparator = form.getAttribute("decimalSeparator");
        var wCollectionPanel = getElement( wActivePanel.getAttribute("subPanelOf") );

        var wAllowQuery;
        var wField;
        var wFieldValue;
        var wSql = "";
        var wOperator = "";

        // Validation 
        if ( wCollectionPanel == null)
        {
           wAllowQuery = wActivePanel.getAttribute("allowQuery");
        }
        else
        {
           wAllowQuery = wCollectionPanel.getAttribute("allowQuery");
        }

        if ( wAllowQuery == "False")
        {
           alert(MSG_0109); // Query not allowed
           return;
        }

        if ( wActivePanel.getAttribute("toolbarMode") != "Basic" && wFormStatus.value.toUpperCase() == "CHANGED") 
        {
           if ( confirm(MSG_0105) ) // Do you want to save the changes you have made? 
           {
              form_saveChanges();
              return;
           }
        }

        if ( wCollectionPanel != null)
        {
           form_setActivePanel(wCollectionPanel.id + "_panel_0");
           set(wCollectionPanel.id + "_selected", "0");
           set(wCollectionPanel.id + "_current", "0");
        }

        var wFieldArray = panel.getSubFields(wActivePanel.id);

        if ( wActivePanel.getAttribute("toolbarMode") == "Basic" || wFormMode.value == "PrepareQuery") 
        {
            for (var i = 0; i < wFieldArray.length; i++)
            {
                wField = wFieldArray[i];

                if ( wField.getAttribute("allowQuery") == "True" && wField.getAttribute("columnName") != null)
                {
                   wFieldValue = replaceAll(wField.value, ' ', '');

                   if (wFieldValue != '') 
                   {
                      // Replacing GroupingSeparator and DecimalSeparator
                      if (wField.getAttribute("dataType") == "Number")
                      {
                         wFieldValue = replaceAll(wField.value, wGroupingSeparator, '');
                         wFieldValue = replaceAll(wFieldValue, wDecimalSeparator, '.');
                      }
                      else
                      {
                         wFieldValue = wField.value;
                      }

                      if (wField.value.indexOf("%") != -1) {
                          wSql = wSql + wOperator + wField.getAttribute("columnName") +  " like '" + wFieldValue + "' ";
                      } else if (wField.value.indexOf("#") != -1) {
                          wSql = wSql + wOperator + wField.getAttribute("columnName") +  " " + wFieldValue.substr(wField.value.indexOf("#") + 1) +  " ";
                      } else if (wField.value.charAt(0) == '>') {
                          wSql = wSql + wOperator + wField.getAttribute("columnName") +  " " + wFieldValue +  " ";
                      } else if (wField.value.charAt(0) == '<') {
                          wSql = wSql + wOperator + wField.getAttribute("columnName") +  " " + wFieldValue +  " ";
                      } else if (wField.value.charAt(0) == '=') {
                          wSql = wSql + wOperator + wField.getAttribute("columnName") +  " " + wFieldValue +  " ";
                      } else if (wField.value.charAt(0) == '!') {
                          wSql = wSql + wOperator + wField.getAttribute("columnName") +  " " + wFieldValue +  " ";
                      } 
                      else 
                      {
                          if (wField.getAttribute("dataType") == "Number") 
                          {
                              wSql = wSql + wOperator + wField.getAttribute("columnName") +  " = " + wFieldValue +  " ";
                          } 
                          else if (wField.getAttribute("dataType") == "Date") 
                          {
                              if (wField.getAttribute("mask") == null)
                              {
                                 wSql = wSql + wOperator + wField.getAttribute("columnName") +  " = TO_DATE('" + wFieldValue +  "', 'yyyy-mm-dd') ";
                              }
                              else
                              {
                                 wSql = wSql + wOperator + wField.getAttribute("columnName") +  " = TO_DATE('" + wFieldValue +  "', '" + wField.getAttribute("mask") + "') ";
                              }
                          } 
                          else 
                          {
                              wSql = wSql + wOperator + wField.getAttribute("columnName") +  " = '" + wFieldValue +  "' ";
                          }
                      }

                      wOperator = " and ";
                   }
                }
            }

            wDynamicWhere.value = wSql;
        }

        wFormMode.value = "ExecuteQuery";
        wFormStatus.value = "QUERY";
        wRecordStatus.value = "QUERY";

        form_submit();
    }
    catch (Err)
    {
       fatalMsg(Err, "form_executeQuery");
    }    
}

function form_executeInsert()
{
    try
    {
        var wActivePanel  = getElement( get("form_activePanel") );
        var wRecordStatus = getElement( wActivePanel.id + "_recordStatus");

        wRecordStatus.value = "INSERT";

        form_submit();
    }
    catch (Err)
    {
       fatalMsg(Err, "form_executeInsert");
    }    
}

function form_executeUpdate()
{
    try
    {
        var wActivePanel  = getElement( get("form_activePanel") );
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");

        wRecordStatus.value = "UPDATE";

        form_submit();
    }
    catch (Err)
    {
       fatalMsg(Err, "form_executeUpdate");
    }    
}

function form_executeDelete()
{
    try
    {
        var wActivePanel  = getElement( get("form_activePanel") );
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");

        if ( confirm("Do you want to delete the current record?") ) 
        {
           wRecordStatus.value = "DELETE";

           form_submit();
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_executeDelete");
    }    
}

function form_saveChanges() 
{
    try
    {
        var wFormStatus = getElement("form_status");
        var wFormMode = getElement("form_mode");

        if (wFormStatus.value.toUpperCase() == "CHANGED") 
        {
            // wFormStatus.value = "NEW";
            wFormMode.value = "SaveChanges";

            form_submit();
        } 
        else 
        {
            alert(MSG_0110); // No changes to be saved
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_saveChanges");
    }    
}

function form_discardChanges(pObject) 
{
    try
    {
        var wFormStatus = getElement("form_status");
        var wFormMode = getElement("form_mode");
        var wField;
        var wFirstField;

        if (wFormStatus.value.toUpperCase() == "CHANGED") 
        {
           if ( confirm(MSG_0100) == false) 
           {
              return;
           }
        } 

        if (form.getAttribute("panelList") != null)
        {
           var wPanelList = new Array();
           wPanelList = eval(form.getAttribute("panelList"));

           for (var wIndex in wPanelList)
           {
               panel.clear(wPanelList[wIndex]);
           }
        }

        var wFieldArray = panel.getSubFields( form.getAttribute("masterPanel") );

        // Disable panel fields
        for (i = 0; i < wFieldArray.length; i++) 
        {
            wField = wFieldArray[i];

            if (wField.type.toUpperCase() != "HIDDEN" && wField.style.visibility.toUpperCase() != "HIDDEN")
            {
               if ( wField.getAttribute("allowInsert") == "True" ) 
               {
                  if (wFirstField == null)
                  {
                     wFirstField = wField;
                     break;
                  }
               }
            }
        }

        // Set focus on first insert field
        if (wFirstField != null)
        {
           setFocus(wFirstField);
        }

        wFormStatus.value = "NEW";
    }
    catch (Err)
    {
       fatalMsg(Err, "form_discardChanges");
    }    
}

function form_refresh()
{
    try
    {
        var wActivePanel = getElement( get("form_activePanel") );
        var wFormMode = getElement("form_mode");
        var wFormStatus = getElement("form_status");
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
        var wRowId        = getElement(wActivePanel.id + "_rowid");
        var wDynamicOrderBy = getAttribute("dynamicOrderBy");

        var wField;
        var wFirstField = -1;

        var wFieldArray = panel.getSubFields(wActivePanel.id);

        // Clear panel fields
        for (i = 0; i < wFieldArray.length; i++)
        {
            wField = wFieldArray[i];
        
            setProperty(wField, "value", ""); 
            wField.setAttribute("originalValue", ""); 

            if (wField.type.toUpperCase() != "HIDDEN" && wField.style.visibility.toUpperCase() != "HIDDEN")
            {
               if (wFirstField == null)
               {
                  wFirstField = wField;
               }
            }
        }

        // Set focus on first query field
        if (wFirstField != null)
        {
           setFocus(wFirstField);
        }

        // Clear dynamicOrderBy clause
        wDynamicOrderBy.value = "";

        wFormStatus.value = "NEW";
        wRecordStatus.value = "";
        wRowId.value = "";
        wFormMode.value = "Refresh";
    }
    catch (Err)
    {
       fatalMsg(Err, "form_refresh");
    }    
}

function form_prepareQuery(pObject) 
{
    try
    {
        var wActivePanel = getElement( get("form_activePanel") );
        var wFormMode = getElement("form_mode");
        var wFormStatus = getElement("form_status");
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
        var wRowId = getElement(wActivePanel.id + "_rowid");
        var wDynamicOrderBy = getAttribute("dynamicOrderBy");
        var wCollectionPanel = getElement( wActivePanel.getAttribute("subPanelOf") );
        var wAllowQuery;

        var wField;
        var wFirstField = null;
        var wFieldArray;

        var wDetailList;
        var wFirstConfirm = true;

        var i = 0;
        var j = 0;

        if (wFormStatus.value.toUpperCase() == "CHANGED")
        {
           alert(MSG_0003);
           return;
        }

        if ( wCollectionPanel == null)
        {
           wAllowQuery = wActivePanel.getAttribute("allowQuery");

           if ( wAllowQuery == "False")
           {
              alert(MSG_0104);  // Query is not allowed
              return;
           }

           // Validating the selected panel
           if (wRecordStatus.value != "") 
           {
              if ( confirm(MSG_0105) ) // Do you want to save the changes you have made?
              {
                 form_saveChanges();
                 return;
              }
              else
              {
                 wFirstConfirm = false;
              }
           }

           // Validating the detail panel's of the selected panel
           if (wActivePanel.getAttribute("detailList") != null)
           {
              wDetailList = new Array();
              wDetailList = eval(wActivePanel.getAttribute("detailList"));

              var wDetailStatus;              

              /*
              if (wFirstConfirm == true)
              {
                 for (var wIndex in wDetailList)
                 {
                    wDetailStatus = getElement(wDetailList[wIndex] + "_recordStatus");

                    if (wDetailStatus != null && wDetailStatus.value != "")
                    {
                       if ( confirm(MSG_0105) ) // Do you want to save the changes you have made?
                       {
                          form_saveChanges();
                          return;
                       }
                       else
                       {
                          break;
                       }
                    }
                 }
              }
              */
           }

           // Clearing the selected panel
           panel.clear(wActivePanel.id);

           // Clearing the detail panel's of the selected panel
           if (wActivePanel.getAttribute("detailList") != null)
           {
              for (var wIndex in wDetailList)
              {
                 panel.clear(wDetailList[wIndex]);
              }
           }


        }
        else
        {
           wAllowQuery = wCollectionPanel.getAttribute("allowQuery");

           if ( wAllowQuery == "False")
           {
              alert(MSG_0104); // Query is not allowed
              return;
           }

            var wOccurs = getElement(wCollectionPanel.id + "_occurs");
            var wMax = parseInt(wOccurs.value);
            var wCurrentStatus = "";

            for (var i = 0; i < wMax; i++)
            {
                wCurrentStatus = getElement(wCollectionPanel.id + '_panel_' + i + '_recordStatus');

                if (wCurrentStatus.value != "")
                {
                   break;
                }
            }

            if (wCurrentStatus.value != "")
            {
               if ( confirm(MSG_0105) ) // Do you want to save the changes you have made?
               {
                  form_saveChanges();
                  return;
              }
           }

            panel.clear(wCollectionPanel.id);

            // lock all the panels of a collection panel, except the first one

            for (var i = 1; i < wMax; i++)
            {
                var wFieldArray = panel.getSubFields(wCollectionPanel.id + "_panel_" + i);

                for (var j = 0; j < wFieldArray.length; j++) 
                {
                    wFieldArray[j].setAttribute("allowQuery", "False");
                }
            }

            form_setActivePanel(wCollectionPanel.id + "_panel_0");

            // The ActivePanel must be restored to the first element of the collection             
            wActivePanel = getElement( get("form_activePanel") );

            //set(wCollectionPanel.id + "_selected", "0");
            //set(wCollectionPanel.id + "_current", "0");
        }

        var wFieldArray = panel.getSubFields(wActivePanel.id);

        // Disable panel fields
        for (i = 0; i < wFieldArray.length; i++) 
        {
            wField = wFieldArray[i];

            setProperty(wField, "value", "");  
            wField.setAttribute("originalValue", "");

            if ( wField.getAttribute("allowQuery") == "True" ) 
            {
               if (wField.type.toUpperCase() != "HIDDEN" && wField.style.visibility.toUpperCase() != "HIDDEN")
               {
                  if (wFirstField == null)
                  {
                     wFirstField = wField;
                  }
               }
            }
        }

        // Clear dynamicOrderBy clause
        wDynamicOrderBy.value = "";

        wFormStatus.value = "NEW";
        wRecordStatus.value = "";
        wRowId.value = "";
        wFormMode.value = "PrepareQuery";

        // Set focus on first query field
        if (wFirstField != null)
        {
           setFocus(wFirstField);
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_prepareQuery");
    }    
}

function form_prepareInsert() 
{
    try
    {
        var wActivePanel = getElement( get("form_activePanel") );
        var wFormMode = getElement("form_mode");
        var zValor = document.getElementById("valor");
        var zFormStatus = document.getElementById("form_status");    
        var wFormStatus = getElement("form_status");    
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
        var wRowId = getElement(wActivePanel.id + "_rowid");
        var wCollectionPanel = getElement(wActivePanel.getAttribute("subPanelOf"));
        var wAllowInsert;
        var wField;
        var wFirstField = null;
        var wDetailList;
        var wFirstConfirm = true;

        if ( wCollectionPanel == null)
        {
           // Validation 
           wAllowInsert = wActivePanel.getAttribute("allowInsert");

           if ( wAllowInsert == "False")
           {
              alert(MSG_0106); // Insert is not allowed
              return;
           }

           // Validating the selected panel
           if (wRecordStatus.value != "")
           {
              if ( confirm(MSG_0105) ) // Do you want to save the changes you have made?
              {
                 form_saveChanges();
                 return;
              }
              else
              {
                 wFirstConfirm = false;
              }
           }

           // Validating the detail panel's of the selected panel
           if (wActivePanel.getAttribute("detailList") != null)
           {
              wDetailList = new Array();
              wDetailList = eval(wActivePanel.getAttribute("detailList"));

              var wDetailStatus;              

              if (wFirstConfirm == true)
              {
                 for (var wIndex in wDetailList)
                 {
                    wDetailStatus = getElement(wDetailList[wIndex] + "_recordStatus");

                    if (wDetailStatus != null && wDetailStatus.value != "")
                    {
                       if ( confirm(MSG_0105) ) // Do you want to save the changes you have made?
                       {
                          form_saveChanges();
                          return;
                       }
                       else
                       {
                          break;
                       }
                    }
                 }
              }
           }

           // Clearing the selected panel
           panel.clear(wActivePanel.id);

           // Clearing the detail panel's of the selected panel
           if (wActivePanel.getAttribute("detailList") != null)
           {
              for (var wIndex in wDetailList)
              {
                 panel.clear(wDetailList[wIndex]);
              }
           }
        }
        else
        {
           wAllowInsert = wCollectionPanel.getAttribute("allowInsert");

           if ( wAllowInsert == "False")
           {
              alert(MSG_0106); // Insert is not allowed
              return;
           }

           var wOccurs = getElement(wCollectionPanel.id + "_occurs");
           var wMax = parseInt(wOccurs.value) - 1;
           var wLastRecordStatus = getElement(wCollectionPanel.id + '_panel_' + wMax + '_recordStatus');

           if (wLastRecordStatus.value != "")
           {
              if ( confirm(MSG_0105) ) // Do you want to save the changes you have made?
              {
                 form_saveChanges();
                 return;
              }

              if (wLastRecordStatus.value == "DELETE")
              {
                 panel.resetBorderColor(wCollectionPanel.id + '_panel_' + wMax);
              }
           }

           form_shift();
        }

        var wFieldArray = panel.getSubFields(wActivePanel.id);

        // Disable panel fields
        for (i = 0; i < wFieldArray.length; i++)
        {
            wField = wFieldArray[i];

            setProperty(wField, "value", "");

            wField.setAttribute("originalValue", "");

            if ( wField.getAttribute("allowInsert") == "True" )
            {
               if (wField.type.toUpperCase() != "HIDDEN" && wField.style.visibility.toUpperCase() != "HIDDEN")
               {
                  if (wFirstField == null)
                  {
                     wFirstField = wField;
                  }
               }
            }
        }

        // Set focus on first insert field
        if (wFirstField != null)
        {
           setFocus(wFirstField);
        }

        if (wFormStatus.value != "CHANGED")
        {
            wFormStatus.value = "NEW";
        }

        wRecordStatus.value = "";
        wRowId.value = "";

        wFormMode.value = "PrepareInsert";
    }
    catch (Err)
    {
       fatalMsg(Err, "form_prepareInsert");
    }    
}

function form_prepareDelete(pObject, pMethod)
{
    try
    {
        var wActivePanel  = getElement( get("form_activePanel") );
        var wFormMode     = getElement("form_mode");
        var wFormStatus   = getElement("form_status");
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
        var wRowId        = getElement(wActivePanel.id + "_rowid");
        var wCollectionPanel  = getElement(wActivePanel.getAttribute("subPanelOf"));
        var wAllowDelete;

        var wField;

        // Validation 
        if ( wCollectionPanel == null)
        {
           wAllowDelete = wActivePanel.getAttribute("allowDelete");
        }
        else
        {
           wAllowDelete = wCollectionPanel.getAttribute("allowDelete");
        }

        if ( wAllowDelete == "False")
        {
           alert(MSG_0103); // Record can't be deleted
           return;
        }

        if (wRecordStatus.value == "DELETE")
        {
           alert(MSG_0108); // Record already selected to be deleted
           return;
        }

        if (wRecordStatus.value == "CHANGED")
        {
           if ( confirm(MSG_0105) ) // Do you want to save the changes you have made?
           {
              form_saveChanges();
              return;
           }
        }

        if ( wRecordStatus.value == "" && wRowId.value == "")
        {
           if ( wCollectionPanel == null )
           {
              form_clear(wActivePanel.id);
           }
           else
           {
              form_shrink();
           }
 
           return; 
        }

        if ( wRecordStatus.value != "" && wRowId.value == "")
        {
           if ( confirm(MSG_0102) ) // Remove the current record
           {
              if ( wCollectionPanel == null )
              {
                 form_clear(wActivePanel.id);
              }
              else
              {
                 form_shrink();
              }
           }
 
           return; 
        }



        if ( wCollectionPanel != null )
        {
           if ( wRecordStatus.value == "" && wRowId.value == "")
           {
              form_shrink();
              return; 
           }

           if ( wRecordStatus.value != "" && wRowId.value == "")
           {
              form_shrink();
              return; 
           }
        }

        if ( confirm(MSG_0102) ) // Remove the current record
        {
           if (pMethod != null)
           {
              form.setAttribute("exception", "false");
              var wStatusMsg;

              if (option_invokeMode.toUpperCase() == "SUBMIT")
              {    
                 invoke(pMethod);
                 return;
              }
              else
              {
                 ajaxInvoke(pMethod);

                 wStatusMsg = form.getAttribute("statusMsg");
              }

              option_invokeMode = "";

              if (wStatusMsg != null && wStatusMsg != "")
              {
                 window.status = wStatusMsg; 
              }

              if (form.getAttribute("exception") == "true")
              {
	         form_setFocus( get("form_activePanel") );
	         return;
              }
           }

           panel.setBorderColor(wActivePanel, "red");

           wFormStatus.value = "CHANGED";
           wRecordStatus.value = "DELETE";
           wFormMode.value = "PrepareDelete";
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_prepareDelete");
    }    
}

function form_firstRecord() 
{
    try
    {
       form_navigate("FIRST");
    }
    catch (Err)
    {
       fatalMsg(Err, "form_firstRecord");
    }    
}

function form_previousRecord() 
{
    try
    {
       form_navigate("PREVIOUS");
    }
    catch (Err)
    {
       fatalMsg(Err, "form_previousRecord");
    }    
}

function form_nextRecord() 
{
    try
    {
       form_navigate("NEXT");
    }
    catch (Err)
    {
       fatalMsg(Err, "form_nextRecord");
    }    
}

function form_lastRecord() 
{
    try
    {
       form_navigate("LAST");
    }
    catch (Err)
    {
       fatalMsg(Err, "form_lastRecord");
    }    
}

function form_navigate(pAction) 
{
    try
    {
        var wActivePanel = getElement( get("form_activePanel") );
        var wFormMode = getElement("form_mode");
        var wFormStatus = getElement("form_status");
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");

        if (wFormStatus.value == "CHANGED")
        {
           alert(MSG_0003);
           return;
        }

        // Validation 
        if ( form_validate() == null ) 
        {
           return;
        }

        if (pAction == "FIRST") 
        {
            wFormMode.value = "firstRecord";
            wRecordStatus.value = "FIRST";
        } 
        else if (pAction == "NEXT") 
        {
            wFormMode.value = "nextRecord";
            wRecordStatus.value = "NEXT";
        } 
        else if (pAction == "PREVIOUS") 
        {
            wFormMode.value = "previousRecord";
            wRecordStatus.value = "PREVIOUS";
        } 
        else if (pAction == "LAST") 
        {
            wFormMode.value = "lastRecord";
            wRecordStatus.value = "LAST";
        } 
        else if (pAction == "SAME") 
        {
            wFormMode.value = "sameRecord";
            wRecordStatus.value = "SAME";
        } 
        else if (pAction == "ROLLUP") 
        {
           wFormMode.value = "rollUp";
           wRecordStatus.value = "ROLLUP";
        }
        else if (pAction == "ROLLDOWN") 
        {
           wFormMode.value = "rollDown";
           wRecordStatus.value = "ROLLDOWN";
        } 
        else 
        {
            wFormMode.value = "";
            wRecordStatus.value = "";
        }

        wFormStatus.value = "QUERY";

        // If DBCollection, updates the recordStatus of all the panels
        var wSubPanelOf = wActivePanel.getAttribute("subPanelOf");

        if (wSubPanelOf != null)
        {
           var wOccurs = parseInt( get(wSubPanelOf + "_occurs") );

           for (j = 0; j < wOccurs; j++)
           {
               wRecordStatus = getElement(wSubPanelOf + "_panel_" + j + "_recordStatus");
               wRecordStatus.value = pAction;
           }
        }

        // Submit the web page
        form_submit();
    }
    catch (Err)
    {
       fatalMsg(Err, "form_navigate");
    }    
}

function form_orderAscending()
{
    var wFormStatus = getElement("form_status");

    if (wFormStatus.value == "CHANGED")
    {
       alert(MSG_0003);
       return;
    }

    if ( get("form_status") == "CHANGED") 
    {
       if ( confirm(MSG_0105) ) // Save Changes 
       {
          form_saveChanges();
          return;
       }
    }

    if (get("form_activeControl") == "")
    {
        alert(MSG_0107); // No field selected
        return;
    }

    var wActivePanel = getElement( get("form_activePanel") );

    if (wActivePanel == null)
    {
        alert(MSG_0107); // No field selected
        return;
    }

    var wActiveControl = getElement(get("form_activeControl"));

    if (wActiveControl == null)
    {
        alert(MSG_0107); // No field selected
        return;
    }

    var wFormMode = getElement("form_mode");
    var wFormStatus = getElement("form_status");
    var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
    var wDynamicOrderBy = getAttribute("dynamicOrderBy");

    if (wActiveControl.getAttribute("columnName") == null)
    {
       alert(MSG_0111); // Selected field is no database field
       return;
    }

    wDynamicOrderBy.value = wActiveControl.getAttribute("columnName") + " asc";

    wFormStatus.value = "QUERY";
    wRecordStatus.value = "QUERY";
    wFormMode.value = "ExecuteQuery";

    // If DBCollection, updates the recordStatus of all the panels
    var wCollectionPanel = wActivePanel.getAttribute("subPanelOf");

    if (wCollectionPanel != null)
    {
       var wOccurs = parseInt( get(wCollectionPanel + "_occurs") );

       for (j = 0; j < wOccurs; j++)
       {
           wRecordStatus = getElement(wCollectionPanel + "_panel_" + j + "_recordStatus");
           wRecordStatus.value = "QUERY";
       }
    }

    form_submit();
}

function form_orderDescending()
{
    var wFormStatus = getElement("form_status");

    if (wFormStatus.value == "CHANGED")
    {
       alert(MSG_0003);
       return;
    }

    if ( get("form_status") == "CHANGED") 
    {
       if ( confirm(MSG_0105) ) // Save Changes 
       {
          form_saveChanges();
          return;
       }
    }

    if (get("form_activeControl") == "")
    {
        alert(MSG_0107); // No field selected
        return;
    }

    var wActivePanel = getElement( get("form_activePanel") );

    if (wActivePanel == null)
    {
        alert(MSG_0107); // No field selected
        return;
    }

    var wActiveControl = getElement(get("form_activeControl"));

    if (wActiveControl == null)
    {
        alert(MSG_0107); // No field selected
        return;
    }

    var wFormMode = getElement("form_mode");
    var wFormStatus = getElement("form_status");
    var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
    var wDynamicOrderBy = getAttribute("dynamicOrderBy");

    if (wActiveControl.getAttribute("columnName") == null)
    {
       alert(MSG_0111); // Selected field is no database field
       return;
    }

    wDynamicOrderBy.value = wActiveControl.getAttribute("columnName") + " desc";

    wFormStatus.value = "QUERY";
    wRecordStatus.value = "QUERY";
    wFormMode.value = "ExecuteQuery";

    // If DBCollection, updates the recordStatus of all the panels
    var wCollectionPanel = wActivePanel.getAttribute("subPanelOf");

    if (wCollectionPanel != null)
    {
       var wOccurs = parseInt( get(wCollectionPanel + "_occurs") );

       for (j = 0; j < wOccurs; j++)
       {
           wRecordStatus = getElement(wCollectionPanel + "_panel_" + j + "_recordStatus");
           wRecordStatus.value = "QUERY";
       }
    }

    form_submit();
}

function form_shift()
{
   var wActivePanel = getElement( get("form_activePanel") );
   var wCollectionPanel = getElement(wActivePanel.getAttribute("subPanelOf"));
   var wOccurs = getElement(wCollectionPanel.id + "_occurs");

   if (wOccurs.value == 1)
   {
      return;
   }

   var wMax = parseInt(wOccurs.value) - 1;
   var wInputPanel;
   var wOutputPanel;

   var wInputArray;
   var wOutputArray;

   var wInputField;
   var wOutputField;

   var wInputStatus;
   var wOutputStatus;

   var wInputIndex;
   var wOutputIndex;

   var wIndex = 0;
   var i = 0;

   for (wIndex = wMax; wIndex > -1; wIndex--)
   {
       wInputIndex = wIndex - 1;
       wOutputIndex = wIndex;

       wInputPanel = wCollectionPanel.id + '_panel_' + wInputIndex;
       wOutputPanel = wCollectionPanel.id + '_panel_' + wOutputIndex;

       wInputArray = panel.getSubFields(wInputPanel);
       wOutputArray = panel.getSubFields(wOutputPanel);

       // If the activePanel is already the outputPanel then clears only the outputArray
       if (wOutputPanel == wActivePanel.id)
       {
          panel.clear(wOutputPanel);
          break;
       }

       // Shift the contents of the input panel into the output panel and clears the input panel
       wInputStatus = getElement(wCollectionPanel.id + '_panel_' + wInputIndex + '_recordStatus');
       wOutputStatus = getElement(wCollectionPanel.id + '_panel_' + wOutputIndex + '_recordStatus');
       wOutputStatus.value = wInputStatus.value;

       if (wOutputStatus.value == "DELETE")
       {
          panel.setBorderColor(wOutputPanel, "Red");
       }

       wInputStatus = getElement(wCollectionPanel.id + '_panel_' + wInputIndex + '_rowid');
       wOutputStatus = getElement(wCollectionPanel.id + '_panel_' + wOutputIndex + '_rowid');
       wOutputStatus.value = wInputStatus.value;

       for (i = 0; i < wInputArray.length; i++)
       {
           wOutputArray[i].value = wInputArray[i].value;
           wOutputArray[i].setAttribute("originalValue", wInputArray[i].getAttribute("originalValue"));
       }

       panel.clear(wInputPanel);

       // If the activePanel is inputPanel then breaks the loop
       if (wInputPanel == wActivePanel.id)
       {
           break;
       }
    }
}

function form_shrink()
{
   var wActivePanel = getElement( get("form_activePanel") );

   if ( wActivePanel == null )
   {
      return;
   }

   if (wActivePanel.getAttribute("SubPanelOf") == null)
   {
      return;
   }

   var wCollectionPanel = getElement( wActivePanel.getAttribute("SubPanelOf") );

   if (wCollectionPanel == null)
   {
      return;
   }

   var wOccurs = getElement(wCollectionPanel.id + "_occurs");

   var wMax = parseInt(wOccurs.value) - 1;
   var wInputPanel;
   var wOutputPanel;

   var wInputArray;
   var wOutputArray;

   var wInputField;
   var wOutputField;

   var wInputStatus;
   var wOutputStatus;

   var wInputIndex;
   var wOutputIndex;

   var wMin = 0;
   var wIndex = 0;
   var i = 0;

   for (wIndex = 0; wIndex <= wMax; wIndex++)
   {
       wInputPanel = wCollectionPanel.id + '_panel_' + wIndex;

       if (wInputPanel == wActivePanel.id)
       {
          wMin = wIndex;
          break;
       }
   }    

   for (wIndex = wMin; wIndex <= wMax; wIndex++)
   {
       wOutputIndex = wIndex;
       wOutputPanel = wCollectionPanel.id + '_panel_' + wOutputIndex;

       wOutputArray = panel.getSubFields(wOutputPanel);

       // If the activePanel is already the outputPanel then clears only the outputArray
       if (wOutputIndex == wMax)
       {
          panel.clear(wOutputPanel);
          break;
       }

       wInputIndex = wIndex + 1;
       wInputPanel = wCollectionPanel.id + '_panel_' + wInputIndex;

       wInputArray = panel.getSubFields(wInputPanel);

       // Shift the contents of the input panel into the output panel and clears the input panel
       wInputStatus = getElement(wCollectionPanel.id + '_panel_' + wInputIndex + '_recordStatus');
       wOutputStatus = getElement(wCollectionPanel.id + '_panel_' + wOutputIndex + '_recordStatus');
       wOutputStatus.value = wInputStatus.value;

       if (wOutputStatus.value == "DELETE")
       {
          panel.setBorderColor(wOutputPanel, "Red");
       }

       wInputStatus = getElement(wCollectionPanel.id + '_panel_' + wInputIndex + '_rowid');
       wOutputStatus = getElement(wCollectionPanel.id + '_panel_' + wOutputIndex + '_rowid');
       wOutputStatus.value = wInputStatus.value;

       for (i = 0; i < wInputArray.length; i++)
       {
           wOutputArray[i].value = wInputArray[i].value;
           wOutputArray[i].setAttribute("originalValue", wInputArray[i].getAttribute("originalValue")); 
       }

       panel.clear(wInputPanel);
    }

    // Checks if the current panel has rowid

    var wRowId = get(wActivePanel.id + "_rowid");
    var wNewPanel = wActivePanel.id;

    if (wRowId == "")
    {
       var wOccurrence = parseInt( wActivePanel.getAttribute("Occurrence") ) - 1;

       for (i = wOccurrence; i >= 0; i--)
       {
           wNewPanel = wCollectionPanel.id + '_panel_' + i;

           wRowId = get(wNewPanel + "_rowid");

           if (wRowId != "")
           {
              break;
           }           
       } 

   }    

   form_setPanelFocus(wNewPanel);

   var wActiveControl = getElement(get("form_activeControl"));  

   setFocus(wActiveControl);
}


function form_setPanelFocus(pPanel) 
{
    var wRowId = getElement(pPanel + "_rowid");
    var wFirstField = null;

    if (wRowId.value == "")
    {
       pMode = "INSERT";
    }
    else
    {
       pMode = "UPDATE";
    }

    var wFieldArray = panel.getSubFields(pPanel);

    if (pMode == "UPDATE")
    {
       for (i = 0; i < wFieldArray.length; i++) 
       {
           wField = wFieldArray[i];
           
           if ( wField.getAttribute("allowUpdate") == "True" ) 
           {
              if (wField.type.toUpperCase() != "HIDDEN" && wField.style.visibility.toUpperCase() != "HIDDEN")
              {
                 if (wFirstField == null)
                 {
                    wFirstField = wField;
                    break;
                 }
              }
           }
       }
    }
    else if (pMode.toUpperCase() == "INSERT")
    {
       for (i = 0; i < wFieldArray.length; i++) 
       {
           wField = wFieldArray[i];

           if ( wField.getAttribute("allowInsert") == "True" ) 
           {
              if (wField.type.toUpperCase() != "HIDDEN" && wField.style.visibility.toUpperCase() != "HIDDEN")
              {
                 if (wFirstField == null)
                 {
                    wFirstField = wField;
                    break;
                 }
              }
           }
       }
    }

    // Set focus on first insert field
    if (wFirstField != null)
    {
       var wActiveControl = getElement("form_activeControl");  
       wActiveControl.value = wFirstField.id;
    }
}

function form_setFocus(pPanel)
{
   form_setPanelFocus(pPanel);

   var wActiveControl = getElement(get("form_activeControl"));  

   setFocus(wActiveControl);
}

function form_populate(pXml)
{
    try
    {

    var wDocument;
    var wRoot;
    var wField;
    var wValue;

    var wDecimals;                                        
    var wDecimalSeparator = form.getAttribute("decimalSeparator"); 

    if (window.ActiveXObject)
    {
         wDocument = new ActiveXObject("Microsoft.XMLDOM");

         if (!wDocument)
         {
            wDocument = new ActiveXObject("Msxml.DOMDocument");
         }

         wDocument.async = "false";
         wDocument.loadXML(pXml);
    }
    else
    {
         var wParser = new DOMParser();
         wDocument = wParser.parseFromString(pXml, "text/xml");
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

    for (wCount = 0; wCount < wRoot.childNodes.length; wCount++)
    {
        if (wRoot.childNodes[wCount].nodeName != "form_alert")
        {
           wField = getElement(wRoot.childNodes[wCount].nodeName);

           if (wField != null)
           {
              if (wRoot.childNodes[wCount].childNodes.length == 0)
              {
                  if (wField.value != "")
                  {
                     wField.value = "";

                     wField.setAttribute("originalValue", "");  
                  }
              }
              else
              {
                 for (wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
                 {
                     wValue = wRoot.childNodes[wCount].childNodes[0].nodeValue;
                     wValue = wValue.replace(/&lt;/g, "<");
                     wValue = wValue.replace(/&amp;/g, "&");

                     wDecimals = wField.getAttribute("Decimals"); 

                     if (wDecimals != null)
                     {
                        if (wDecimalSeparator != ".")
                        {
                           wValue = wValue.replace(/\./g, wDecimalSeparator);
                        }
                     } 
                     // Miranda - Revisar

                     if (wValue != wField.value)
                     {
                        wField.value = wValue;

                        wField.setAttribute("originalValue", wValue);  
                     }
                 }  
              }
           }
        }
    }
    }
    catch (Err)
    {
       fatalMsg(Err, "form_populate");
    }    

}

function form_parameters()
{
    var wForm = null;
    var wFormCount = 0;
    var wElement = null;
    var wElementCount = 0;
    var wParameters = "";

    if (document.forms.length > 0)
    {

       for (wFormCount = 0; wFormCount < document.forms.length; wFormCount++)
       {
          wForm = document.forms(wFormCount);

          if(wForm.elements.length > 0)
          {
             wElementCount = 0;

             for (wElementCount = 0; wElementCount < wForm.elements.length; wElementCount++)
             {
                wElement = wForm.elements(wElementCount);

                if (wElement.value != "")
                {
                   wParameters += "&" + wElement.id + "=" + wElement.value;
                }
             }
          }
       } 
    }

    return wParameters;
}

function form_initialize()
{

    var wForm = null;
    var wFormCount = 0;
    var wElement = null;
    var wElementCount = 0;

    if (document.forms.length > 0)
    {
       for (wFormCount = 0; wFormCount < document.forms.length; wFormCount++)
       {
          wForm = document.forms(wFormCount);
          if(wForm.elements.length > 0)
          {
             wElementCount = 0;
             for (wElementCount = 0; wElementCount < wForm.elements.length; wElementCount++)
             {
                 wElement = wForm.elements(wElementCount);
                 wElement.value = "";
             }
          }
       } 
    }
}

function form_unselectLine(pCollectionPanel)
{
     var wSelectedLine = getElement(pCollectionPanel + "_selected");

     if (wSelectedLine != null) 
     { 
          // Clears the backgroundColor of the previous selected Panel
          var wFieldArray = panel.getSubFields(pCollectionPanel + "_panel_" + wSelectedLine.value);

          for (var i = 0; i < wFieldArray.length; i++)
          {
              setProperty(wFieldArray[i], "backgroundColor", wField.getAttribute("originalBackgroundColor")); 
          }
    }
}

function form_clear(pPanel)
{
   try
   { 
       panel.clear(pPanel);
    }
    catch (Err)
    {
       fatalMsg(Err, "form_clear");
    }    
}

function form_validate() 
{
    var wFormStatus = getElement("form_status");

    if (wFormStatus.value == "CHANGED") 
    {
       if ( confirm("Do you want to save the changes you have made?") ) 
       {
          form_saveChanges();
          return null;
       }
    }

    return "true";
}

function form_getActivePanel()
{
    wActivePanel = getElement("form_ActivePanel");
    form_getPanel(wActivePanel.value);
}

function form_goHome()
{
    js.goHome();
}

function form_goHelp()
{
    if (form.getAttribute("helpPage") != null)
    {
       window.open(form.getAttribute("helpPage"), '_blank', 'center:yes;resizable:yes;scroll:yes;status:yes');
    }
}

function form_goNews()
{
    if (form.getAttribute("newsPage") != null)
    {
       window.showModalDialog(form.getAttribute("newsPage"), '_blank', 'center:yes;resizable:yes;scroll:yes;status:yes');
    }
}

function form_submit()
{
	
	
	
	
	if (form.getAttribute("submitMode") == "Ajax")
    {
       ajax.submit();
    }
    else
    {
       js_submitHandler();
       form.submit();
    }
}

// Ajax Methods _________________________________________________

var ajax_requestHttp;
var ajax_responseText;
var ajax_optionPopulate = "True";
var ajax_optionDisplayAlerts = "True";
var ajax_optionGetBrowserValues = "True";

var ajax_submitFields;
var ajax_returnFields;

function ajaxGetAlerts()
{
   try
   {
      return ajax_getAlerts();
   }
   catch (Err)
   {
      fatalMsg(Err, "ajaxGetAlerts");
   }    

}

function ajax_getAlerts()
{
   try
   {
      var wDocument;
      var wRoot;
      var wTagName = "form_alert";
      var wTagValue = "";
      var wMessage = "";
      var wNewLine = "";
      var wXml = ajax_responseText;

      wStatusMsg = form.getAttribute("statusMsg");          

      if (wStatusMsg != "")
      {
         window.status = wStatusMsg;
      }

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

      for (wCount = 0; wCount < wRoot.childNodes.length; wCount++)
      {
          if (wTagName == wRoot.childNodes[wCount].nodeName)
          {
             for (wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
             {
                 wTagValue = wRoot.childNodes[wCount].childNodes[0].nodeValue;
                 wMessage = wMessage + wNewLine + wTagValue;
                 wNewLine = "\n";
             }
          }
      }

      return wMessage;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_getAlerts");
   }    
}

function ajaxValidate(pObject, pMethod, pMandatory)
{
   try
   {
      ajax_validate(pObject, pMethod, pMandatory);
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_validate");
   }    
}

function ajax_validate(pObject, pMethod, pMandatory)
{
   try
   {
     if (ajax_compatibility == "Version 7.2")
     {
        if (ajax_optionPopulate == "True")
        {
           ajax.autoPopulate = true;
        }
        else
        {
           ajax.autoPopulate = false;
        }

        if (ajax_optionDisplayAlerts == "True")
        {
           ajax.autoAlert = true;
        }
        else
        {
           ajax.autoAlert = false;
        }

        if (ajax_optionGetBrowserValues == "True")
        {
           ajax.checkBrowser = true;
        }
        else
        {
           ajax.checkBrowser = false;
        }

        ajax.submitFields = ajax_submitFields;
        ajax.returnFields = ajax_returnFields;
        ajax.validate(pObject, pMethod, pMandatory);

        return; 
     }

      var wValidate = false;

      if (pObject.value != pObject.getAttribute("originalValue"))
      {
         wValidate = true;
      }

      if (pMandatory != null)
      {
         if (pMandatory.toUpperCase() == "ALWAYS")
         {
            wValidate = true;
         } 
      }

      if (wValidate == true)
      {
         ajax_optionDisplayAlerts = "False";

         form.setAttribute("exception", "false");
         form.setAttribute("statusMsg", "");

         ajaxInvoke(pMethod);

         window.status = "";

         var wStatusMsg = form.getAttribute("statusMsg");

         if (wStatusMsg != null && wStatusMsg != "")
         {
            window.status = wStatusMsg; 
         }

         var wException = form.getAttribute("form_exception");
 
         if (wException == "true")
         {
            pObject.setAttribute("originalValue", "null");
            raise( ajaxGetAlerts() );
         }
         else
         {
            pObject.setAttribute("originalValue", pObject.value);
            alertMsg( ajaxGetAlerts() );
         }
      }
    }
    catch (Err)
    {
       fatalMsg(Err, "ajax_validate");
    }    
}

function ajaxInvokeUrl(pUrl, pMethod, pParameters, pPopulate)
{
   try
   {
     ajax_invokeUrl(pUrl, pMethod, pParameters, pPopulate);
   }
   catch (Err)
   {
      fatalMsg(Err, "ajaxInvokeUrl");
   }    
}

function ajax_invokeUrl(pUrl, pMethod, pParameters, pPopulate)
{
   try
   {
      var wUrl = pUrl;
      var wParameters;
      var wResponse;
      var wWindowStatus = window.status;

      if (pParameters == null)
      {
         pParameters = "All";
      }

      if (pPopulate == null)
      {
         pPopulate = "Populate";
      }

      wParameters = "AjaxSubmitMode=AjaxSubmit";

      if (ajax_optionGetBrowserValues.toUpperCase() == "FALSE")
      {
         wParameters = wParameters + "&AjaxGetBrowserValues=False";

         ajax_optionGetBrowserValues = "True";
      }

      if (pMethod != null && pMethod != "")
      {
         wParameters = wParameters + "&AjaxMethod="+ pMethod;
      }

      if (pParameters.toUpperCase() == 'ALL')
      {
         window.status = 'ajax_parameters ...';

         if (ajax_submitFields == null)
         {
            wParameters = wParameters + form_parameters();
         }
         else
         {
            wParameters = wParameters + ajax_submitParameters();
         }
      }
      else
      {
         wParameters = wParameters + "&" + pParameters;
      }

      window.status = 'ajax_post ...';

      wResponse = ajax_post(wUrl, wParameters);

      if (pPopulate.toUpperCase() == 'POPULATE')
      {
         if ( ajax_optionPopulate == "True" )
         {  
            window.status = 'ajax_populate ...';
            ajax_populate();
         }

         if ( ajax_optionDisplayAlerts == "True" )
         { 
            window.status = 'ajax_displayAlerts ...';
            ajax_displayAlerts();
         }
      }

      window.status = wWindowStatus;

      // Restore ajax properties
      ajax_optionPopulate = "True";
      ajax_optionDisplayAlerts = "True";
      ajax_submitFields = null;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_invokeUrl");
   }    
}

function ajax_submitParameters()
{
   try
   {
     var wBuffer = ajax_submitFields;
     var wFields = new Array();
     var wIndex = 0;
     var wElement;
     var wParameters = "";

     if (wBuffer.indexOf(",") == -1)
     {
        wFields[0] = wBuffer;
     }
     else
     {
        while (wBuffer.indexOf(",") != -1)
        {
           wFields[wIndex] = wBuffer.substr(0, wBuffer.indexOf(","));
           // wFields[wIndex] = wFields[wIndex].trim();  //Miranda - revisar
           wBuffer = wBuffer.substr(wBuffer.indexOf(",") + 1);       
           wIndex++;
        }

        wFields[wIndex] = wBuffer;
        // wFields[wIndex] = wFields[wIndex].trim(); //Miranda - revisar
     }

     for (i = 0; i < wFields.length; i++)
     {
        wElement = getElement(wFields[i]);

        if (wElement != null)
        {  
           wParameters += "&" + wElement.id + "=" + wElement.value;
        } 
     }  

     return wParameters;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_submitParameters");
   }    
}

function ajaxGet(pField)
{
   try
   {
      return ajax_get(pField);
   }
   catch (Err)
   {
      fatalMsg(Err, "ajaxGet");
   }    
}

function ajax_get(pField)
{
   try
   {
      var wDocument;
      var wRoot;
      var wTagName;
      var wTagValue = "";
      var wXml = ajax_responseText;

      if (typeof pField == 'object')
      {
         wTagName = pField.value;
      }
      else
      {
         wTagName = pField;
      }

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

      for (wCount = 0; wCount < wRoot.childNodes.length; wCount++)
      {
          if (wTagName == wRoot.childNodes[wCount].nodeName)
          {
             for (wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
             {
                 wTagValue = wRoot.childNodes[wCount].childNodes[0].nodeValue;
                 wTagValue = wTagValue.replace(/&lt;/g, "<");
                 wTagValue = wTagValue.replace(/&amp;/g, "&");

                 break;
             }
          }
      }

      return wTagValue;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_get");
   }    
}
function ajaxDisplayAlerts()
{
   try
   {
      ajax_displayAlerts();
   }
   catch (Err)
   {
      fatalMsg(Err, "ajaxDisplayAlerts");
   }    
}

function ajax_displayAlerts()
{
   try
   {
       var wDocument;
       var wRoot;
       var wTagName = "form_alert";
       var wTagValue = "";
       var wMessage = "";
       var wNewLine = "";
       var wXml = ajax_responseText;

       wStatusMsg = form.getAttribute("statusMsg");          

       if (wStatusMsg != "")
       {
          window.status = wStatusMsg;
       }

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

       for (wCount = 0; wCount < wRoot.childNodes.length; wCount++)
       {
           if (wTagName == wRoot.childNodes[wCount].nodeName)
           {
              for (wSubCount = 0; wSubCount < wRoot.childNodes[wCount].childNodes.length; wSubCount++)
              {
                  wTagValue = wRoot.childNodes[wCount].childNodes[0].nodeValue;
                  wTagValue = wTagValue.replace(/&lt;/g, "<");
                  wTagValue = wTagValue.replace(/&amp;/g, "&");

                  wMessage = wMessage + wNewLine + wTagValue;
                  wNewLine = "\n";
              }
           }
       }

       if (wMessage != "")
       {
          alert(wMessage);
       }
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_displayAlerts");
   }    
}

function ajaxPopulate()
{
   try
   {
     ajax_populate();
   }
   catch (Err)
   {
      fatalMsg(Err, "ajaxPopulate");
   }    
}

function ajax_populate()
{
   try
   {
      form_populate(ajax_responseText);
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_populate");
   }    
}

function ajax_request(pUrl, pParameters)
{
   try
   {
      var wUrl = pUrl;
      var wParameters = "AjaxSubmitMode=AjaxRequest" + pParameters;
      var wResponse;

      wParameters = wParameters.replace(/%/gi,'%25');

      // window.status = 'ajax_post...';
      wResponse = ajax_post(wUrl, wParameters);

      return wResponse;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_request");
   }    
}

function ajax_submit()
{
   try
   {
      var wUrl = form.getAttribute("CurrentUrl");
      window.status = 'form_parameters...';
      var wParameters = "AjaxSubmitMode=AjaxSubmit" + form_parameters();
      var wResponse;

      wParameters = wParameters.replace(/%/gi,'%25');

      window.status = 'ajax_post...';
      wResponse = ajax_post(wUrl, wParameters);

       window.status = 'form_populate...';
       ajax_populate();
       ajax_displayAlerts();
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_submit(");
   }    
}

function ajaxInvoke(pMethod, pParameters, pPopulate)
{
   try
   {
     ajax_invoke(pMethod, pParameters, pPopulate);
   }
   catch (Err)
   {
      fatalMsg(Err, "ajaxInvoke");
   }    
}

function ajax_invoke(pMethod, pParameters, pPopulate)
{
   try
   {
     if (ajax_compatibility == "Version 7.2")
     {
        if (ajax_optionPopulate == "True")
        {
           ajax.autoPopulate = true;
        }
        else
        {
           ajax.autoPopulate = false;
        }

        if (ajax_optionDisplayAlerts == "True")
        {
           ajax.autoAlert = true;
        }
        else
        {
           ajax.autoAlert = false;
        }

        if (ajax_optionGetBrowserValues == "True")
        {
           ajax.checkBrowser = true;
        }
        else
        {
           ajax.checkBrowser = false;
        }

        ajax.submitFields = ajax_submitFields;
        ajax.returnFields = ajax_returnFields;
        ajax.invoke(pMethod);

        return; 
     }

       var wUrl = form.getAttribute("CurrentUrl");

       if (wUrl == null)
       {
          alert(MSG_0004);
          return;
       }

       ajax_invokeUrl(wUrl, pMethod, pParameters, pPopulate);
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_invoke");
   }    
}

function ajax_post(pUrl, pParameters)
{
   try
   {
      var wParameters;

      if (window.XMLHttpRequest)
      {
         ajax_requestHttp = new XMLHttpRequest();
      }
      else if (window.ActiveXObject)
      {
         ajax_requestHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }

      if (ajax_requestHttp == null)
      {
         alert (MSG_0005);
         return;
      }

      ajax_responseText = "";

      wParameters = url_encode(pParameters);

      // Using DoPost ...
      ajax_requestHttp.onreadystatechange = ajax_response;
      ajax_requestHttp.open("POST", pUrl, false);
      ajax_requestHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      ajax_requestHttp.send(wParameters);

      // Using Firefox ...
      if (ajax_responseText == "")
      {
         ajax_response();
      }

      // Using DoGet ...
      //pUrl = pUrl + "?" + pParameters;
      //ajax_requestHttp.onreadystatechange = ajax_response;
      //ajax_requestHttp.open("GET", pUrl, false);
      //ajax_requestHttp.send(null);

      return ajax_responseText;
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_post");
   }    

}
function ajax_response()
{
   try
   {
      if (ajax_requestHttp.readyState == 4 || ajax_requestHttp.readyState == "complete")
      {
         ajax_responseText = ajax_requestHttp.responseText;
      }
   }
   catch (Err)
   {
      fatalMsg(Err, "ajax_response");
   }    
}

function url_encode(str) 
{  
    var hex_chars = "0123456789ABCDEF";  
    var noEncode = /^([a-zA-Z0-9\_\-\.\=\;\&\,])$/;  
    var n, strCode, hex1, hex2, strEncode = "";  

    for(n = 0; n < str.length; n++) 
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

// Generic Functions

// Utilities methods _____________________________________________________
function invoke(pMethod, pParameters)
{
    var wUrl = form.getAttribute("CurrentUrl");
    invokeUrl(wUrl, pMethod, pParameters);
}

function invokeUrl(pUrl, pMethod, pParameters)
{
    var wUrl = pUrl;
    var wParameters;
    var wResponse;

    if (pParameters == null)
    {
       pParameters = "All";
    }

    wParameters = "AjaxSubmitMode=AjaxSubmit";

    if (pMethod != null && pMethod != "")
    {
       var wMethod = getElement("form_invokedMethod");
       wMethod.value = pMethod;
    }

    if (pParameters.toUpperCase() != 'ALL')
    {
       wParameters = "&" + pParameters;
    }

    form_submit();
}

function enable(pImageName)
{
   var wActiveObject   = getElement(pImageName);
   var wDisabledObject = getElement(pImageName + "_disabled");

   if (wDisabledObject != null)
   {
      wDisabledObject.style.visibility = "Hidden";  
   }

   if (wActiveObject != null)
   {
      wActiveObject.style.visibility = "Inherit";  

      var wValidateSpan = getElement("_" + pImageName + "_validateSpan");

      if (wValidateSpan != null)
      {
         wValidateSpan.style.visibility = "Inherit";  
      }  
   }
}

function disable(pImageName)
{
   var wActiveObject   = getElement(pImageName);
   var wDisabledObject = getElement(pImageName + "_disabled");

   if (wActiveObject != null)
   {
      wActiveObject.style.visibility = "Hidden";  

      var wValidateSpan = getElement("_" + pImageName + "_validateSpan");

      if (wValidateSpan != null)
      {
         wValidateSpan.style.visibility = "Hidden"; 
      }  
   } 

   if (wDisabledObject != null)
   {
      wDisabledObject.style.visibility = "Inherit";  
   }
}

function show(pObjectName)
{
   var wActiveObject   = getElement(pObjectName);

   if (wActiveObject != null)
   {
      wActiveObject.style.visibility = "Inherit";  
   }
}

function hide(pObject)
{
   if (pObject == null || pObject.value == "")
   {
      return;
   }

   var wActiveObject   = getElement(pObject.value);

   if (wActiveObject != null)
   {
      wActiveObject.style.visibility = "Hidden";  
   }
}

function menu_showBody(pObjectName)
{
   var wActiveObject   = getElement(pObjectName + "Body");

   if (wActiveObject != null)
   {
      wActiveObject.style.visibility = "Inherit";  
   }
}

function menu_hideBody(pObjectName)
{
   var wActiveObject   = getElement(pObjectName + "Body");

   if (wActiveObject != null)
   {
      wActiveObject.style.visibility = "Hidden";  
   }
}

function getAttribute(pAttribute)
{
   var wActivePanel  = getElement( get("form_activePanel") );
   var wResult;

   if ( wActivePanel.getAttribute("subPanelOf") == null )
   {
      wResult = getElement(wActivePanel.id + "_" + pAttribute);
   }
   else
   {
      wResult = getElement(wActivePanel.getAttribute("subPanelOf") + "_" + pAttribute);
   }

   return wResult;
}

function getElement(pObjectName)
{
    try
    {
        if (pObjectName == null || pObjectName == "")
        {
           return null;
        }
 
        var wObject = document.getElementById(pObjectName);

        if (wObject != null)
        {
           return wObject;  
        }
        else
        {
           return null;
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "getElement");
    }    
}

function getCurrent(pCollection, pObjectName)
{
    try
    {
        var wCollection = getElement(pCollection);
        var wCurrent    = getElement(pCollection + "_current");
        var wObject = getElement(wCollection.id + "_" + pObjectName + "_" + wCurrent.value);

        if (wObject != null)
        {
           return wObject;  
        }
        else
        {
           return null;
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "getCurrent");
    }    
}

function get(pParameter)
{
    try
    {
        if (typeof pParameter == "object")
        {
           return pParameter.value;
        }
        else if (typeof pParameter == "string")
        {
           var wField = getElement(pParameter); 

           if (wField != null)
           {
              return wField.value;  
           }
           else
           {
              return null;
           }
        }
        else
        {
           return pParameter;
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "get");
    }    
}

function set(pObject, pValue)
{
   var wField; 

   if (typeof pObject == "string")
   {
      wField = getElement(pObject); 
   }
   else
   {
      wField = pObject;
   }

   if (wField != null)
   {
      wField.value = pValue;  
      fix(wField);
   }
}

function trace(pMsg)
{
   var wTraceMsg = form.getAttribute("traceMsg"); 

   if (wTraceMsg == "")
   {
      wTraceMsg = pMsg;
   }
   else
   { 
      wTraceMsg = wTraceMsg + ", " + pMsg;
   }

   form.setAttribute("traceMsg", wTraceMsg);
}

function formatDate(pInputDate, pInputMask, pOutputMask)
{
   var wDay = 0;
   var wDayAlpha = "";

   var wMonth = 0;
   var wMonthAlpha = "";

   var wYear = 0;
   var wOutputDate = "";
   
   if ( checkDate(pInputDate, pInputMask) != "" )
   {
      return pInputDate;
   }

   // Parse input ____________________________________________________
   if (pInputMask == "ddmmyyyy")
   {
      wDay = parseInt(pInputDate.substring(0, 2), 10);
      wMonth = parseInt(pInputDate.substring(2, 4), 10);
      wYear = parseInt(pInputDate.substr(4), 10);
   }
   else if (pInputMask == "dd/mm/yyyy")
   {
      if (pInputDate.indexOf("/") != -1)
      {
         var wMonthAndYear = ""; 
         wDay = parseInt(pInputDate.substring(0, pInputDate.indexOf("/")), 10);

         wMonthAndYear = pInputDate.substr(pInputDate.indexOf("/") + 1); 
		 
         if (wMonthAndYear.indexOf("/") != -1)
         { 
            wMonth = parseInt(wMonthAndYear.substring(0, wMonthAndYear.indexOf("/")), 10);
			
            wYear = parseInt(wMonthAndYear.substr(wMonthAndYear.indexOf("/") + 1), 10);
         }
      }
   }

   // Fixes
   if (wDay < 10)
   {
      wDayAlfha = "0" + wDay;
   }
   else
   {
      wDayAlfha = "" + wDay;
   }

   if (wMonth < 10)
   {
      wMonthAlfha = "0" + wMonth;
   }
   else
   {
      wMonthAlfha = "" + wMonth;
   }

   // Output Parse ____________________________________________________

   if (pOutputMask == "ddmmyyyy")
   {
      wOutputDate = wDayAlfha + wMonthAlfha + wYear;
   }
   else if (pOutputMask == "dd/mm/yyyy")
   {
      wOutputDate = wDayAlfha + "/" + wMonthAlfha + "/" + wYear;
   }

   return wOutputDate;
}

function checkDate(pInputDate, pInputMask)
{
   var wDay = 0;
   var wDayAlpha = "";

   var wMonth = 0;
   var wMonthAlpha = "";

   var wYear = 0;
   var wOutputDate = "";
   
   // Parse input ____________________________________________________
   if (pInputMask == "ddmmyyyy")
   {
      wDay = parseInt(pInputDate.substring(0, 2), 10);
      wMonth = parseInt(pInputDate.substring(2, 4), 10);
      wYear = parseInt(pInputDate.substr(4), 10);
   }
   else if (pInputMask == "dd/mm/yyyy")
   {
      if (pInputDate.indexOf("/") != -1)
      {
         var wMonthAndYear = ""; 
         wDay = parseInt(pInputDate.substring(0, pInputDate.indexOf("/")), 10);

         wMonthAndYear = pInputDate.substr(pInputDate.indexOf("/") + 1); 
		 
         if (wMonthAndYear.indexOf("/") != -1)
         { 
            wMonth = parseInt(wMonthAndYear.substring(0, wMonthAndYear.indexOf("/")), 10);
			
            wYear = parseInt(wMonthAndYear.substr(wMonthAndYear.indexOf("/") + 1), 10);
         }
      }
   }

   // Fixes
   if (wDay < 10)
   {
      wDayAlfha = "0" + wDay;
   }
   else
   {
      wDayAlfha = "" + wDay;
   }

   if (wMonth < 10)
   {
      wMonthAlfha = "0" + wMonth;
   }
   else
   {
      wMonthAlfha = "" + wMonth;
   }

   // Date Validation   
   wOutputAux  = wDayAlfha + "/" + wMonthAlfha + "/" + wYear;
   var expReg  = /^(([0-2]\d|[3][0-1])\/([0]\d|[1][0-2])\/[1-2][0-9]\d{2})$/;
  
   if ((wOutputAux.match(expReg)) && (wOutputAux != ""))
   {
      var dia = parseInt(wOutputAux.substring(0,2), 10);
      var mes = parseInt(wOutputAux.substring(3,5), 10);
      var ano = parseInt(wOutputAux.substring(6,10), 10);

      if ( (mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia > 30 )
      {
         return MSG_0021 + " (" + wOutputAux + ")"; // Month contains only 30 days
      } 
      else
      {
         if (ano%4 != 0 && mes == 2 && dia > 28) 
         {
            return MSG_0023 + " (" + wOutputAux + ")"; // Month contains only 28 days
         } 
         else
         {
            if ( ano%4 == 0 && mes == 2 && dia > 29 )
            {
               return MSG_0022 + " (" + wOutputAux + ")"; // Month contains only 29 days
            } 
         }
      }
   } 
   else 
   {
      return MSG_0020 + " (" + wOutputAux + ")";
   }

   return "";

}

function rTrim(pText)
{
   var wText = "";
   var wConsider = false;

   if (pText == "")
   {
      return "";
   }

   for (i = pText.length - 1; i >= 0; i--)
   {
       if (wConsider == false && pText.charAt(i) != " ")
       {
          wConsider = true;
       }

       if (wConsider == true)
       {
          wText = wText + pText.charAt(i);   
       } 
   }  

   return wText;
}

function replaceAll (pText, pInputChar, pOutputChar)
{
   if (pInputChar == pOutputChar)
   {
      return pText;
   }

   while (pText.indexOf(pInputChar) != -1)
   {
      pText = pText.replace(pInputChar, pOutputChar);
   }

   return pText;
}

function nvl (pText, pValue)
{
   if (pText == '')
   {
      return pValue;
   }
   else
   {
      return pText;
   }
}

function move(pInputName, pOutputName)
{
   var wInputField = getElement(pInputName); 

   if (wInputField == null) 
   { 
      return; 
   } 

   var wOutputField = getElement(pOutputName); 
 
   if (wOutputField == null) 
   { 
      return; 
   } 

   wOutputField.value = wInputField.value;

   if ( wInputField.getAttribute("originalValue") != null )
   {
      wOutputField.setAttribute("originalValue", wInputField.getAttribute("originalValue"));
   }

   if (wInputField.type.toUpperCase() == "HIDDEN")
   {
      move(pInputName + "_textbox", pOutputName + "_textbox");

      if (isCheckbox(wOutputField))
      {
         updateCheckbox(wOutputField);
      }
   }
}

function clear(pInputName)
{
   var wInputField = getElement(pInputName); 

   if (wInputField == null) 
   { 
      return; 
   } 

   wInputField.value = "";

   if ( wInputField.getAttribute("originalValue") != null )
   {
       wInputField.setAttribute("originalValue", "");
   }

   if (wInputField.type.toUpperCase() == "HIDDEN")
   {
      clear(pInputName + "_textbox");

      if (isCheckbox(wInputField))
      {
         updateCheckbox(wInputField);
      }
   }
}

function setProperty(pObject, pProperty, pValue)
{
   var wField; 

   if (typeof pObject == "string")
   {
      wField = getElement(pObject); 
   }
   else
   {
      wField = pObject;
   }

   if (wField == null) 
   { 
      return; 
   } 

   if (pProperty.toUpperCase() == "INITIALVALUE")
   {
      wField.value = pValue;

	  if ( wField.type.toUpperCase() == "HIDDEN" )
      {
		  if ( isCheckbox(wField) )
		  {
			 updateCheckbox(wField);
		  }
		  else if ( isCombobox(wField) && getElement(wField.id + "_textbox") != null )
		  {
			 js_setValueForCombobox(wField);          
		  } 
	  }
	  
      return;
   }

   if (wField.type.toUpperCase() == "HIDDEN")
   {
      if ( pProperty.toUpperCase() == "VALUE" )
      {
          wField.value = pValue;
		 
		  if ( isCheckbox(wField) )
		  {
			 updateCheckbox(wField);
		  }
		  else if ( isCombobox(wField) && getElement(wField.id + "_textbox") != null )
		  {
			 setProperty(wField.id + "_textbox", pProperty, pValue);
		  }
      }
   }
   else
   {
      if (pProperty.toUpperCase() == "VALUE")
      {
         wField.value = pValue;
      }
      else if (pProperty.toUpperCase() == "BACKGROUNDCOLOR")
      {
         wField.style.backgroundColor = pValue;
      }
      else if (pProperty.toUpperCase() == "READONLY")
      {
         if (pValue.toUpperCase() == "TRUE")
         {
            wField.readOnly = true;
         }
         else
         {
            wField.readOnly = false;
         }
      }
      else if (pProperty.toUpperCase() == "BORDERCOLOR")
      {
         wField.style.borderColor = pValue;
      }
      else if (pProperty.toUpperCase() == "BORDERSTYLE")
      {
         wField.style.borderStyle = pValue;
      }
      else if (pProperty.toUpperCase() == "BORDERWIDTH")
      {
         wField.style.borderWidth = pValue;
      }
   }
}

function getProperty(pObject, pProperty)
{
   var wField; 

   if (typeof pObject == "string")
   {
      wField = getElement(pObject); 
   }
   else
   {
      wField = pObject;
   }

   if (wField == null) 
   { 
      return; 
   } 

   if (wField.type.toUpperCase() == "HIDDEN")
   {
      if (pProperty.toUpperCase() == "VALUE")
      {
         return wField.value;
      }

      if (isCheckbox(wField))
      {
         return getProperty(wField.id + "_checkbox", pProperty);
      }

      if (isCombobox(wField))
      {
         return getProperty(wField.id + "_textbox", pProperty);
      }
   }
   else
   {
      if (pProperty.toUpperCase() == "VALUE")
      {
         return wField.value;
      }
      else if (pProperty.toUpperCase() == "BACKGROUNDCOLOR")
      {
         return wField.style.backgroundColor;
      }
      else if (pProperty.toUpperCase() == "READONLY")
      {
         if (wField.readOnly == true)
         {
            return "True";
         }
         else
         {
            return "False";
         }
      }
      else if (pProperty.toUpperCase() == "BORDERCOLOR")
      {
         return wField.style.borderColor;
      }
      else if (pProperty.toUpperCase() == "BORDERSTYLE")
      {
         return wField.style.borderStyle;
      }
      else if (pProperty.toUpperCase() == "BORDERWIDTH")
      {
         return wField.style.borderWidth;
      }
   }

   return "";
}

function appendSuffix(pArray, pSuffix)
{
    try
    {
       for (i = 0; i < pArray.length; i++)
       {
           if (getElement(pArray[i] + pSuffix) != null)
           {
              pArray[i] = pArray[i] + pSuffix;
           }
       }

       return pArray;
    }
    catch (Err)
    {
       fatalMsg(Err, "appendSuffix");
    }    
}

function copyArray(pInputArray)
{
   var wArray = new Array();

   for (i = 0; i < pInputArray.length; i++)
   {
       wArray[i] = pInputArray[i];
   }

   return wArray;
}

function nothing()
{
}

function isCombobox(pObject)
{
   var wField; 

   if (typeof pObject == "string")
   {
      wField = getElement(pObject); 
   }
   else
   {
      wField = pObject;
   }

   if (wField == null) 
   { 
      return; 
   } 

   var wCombobox = getElement(wField.id + "_textbox");
   
   if (wCombobox == null)
   {
       return false;
   }    

   return true;
}

function isCheckbox(pObject)
{
   var wField; 

   if (typeof pObject == "string")
   {
      wField = getElement(pObject); 
   }
   else
   {
      wField = pObject;
   }

   if (wField == null) 
   { 
      return; 
   } 

   var wCheckbox = getElement(wField.id + "_checkbox");
   
   if (wCheckbox == null)
   {
       return false;
   }    

   return true;
}

function updateCheckbox(pObject)
{
   var wField; 

   if (typeof pObject == "string")
   {
      wField = getElement(pObject); 
   }
   else
   {
      wField = pObject;
   }

   if (wField == null) 
   { 
      return; 
   } 

   var wCheckedValue = wField.getAttribute("checkedValue"); 
   var wUncheckedValue = wField.getAttribute("uncheckedValue");
   var wCheckbox = getElement(wField.id + "_checkbox");

   if (wCheckedValue == wUncheckedValue)
   {
      wCheckbox.checked = false; 
	  return;
   }
   
   if (wField.value == wCheckedValue)
   {
      wCheckbox.checked = true; 
   }
   else
   {
      wCheckbox.checked = false; 
   }  
}

function exceptionRaised()
{
    if (js_exceptionRaised == true)
    {
       return true;
    }

    return false;
}

function raise(pMsg)
{
    try
    {
		raise_error = false;
		raise_element = null;
		
        js_exceptionRaised = true;

        if (pMsg != "")
        {
           alert(pMsg); 
        }

        try
        {
           event.srcElement.select();
        }
        catch (Err)
        {
			try
			{
				raise_error = true;
				
				if (event.srcElement)
				{
					raise_element = event.srcElement;
				}
				else
				{
					raise_element = browser.srcElement;
				}
				
				if (event.srcElement != null && browser.srcElement == null)
				{
					browser.srcElement = event.srcElement;
				}
			}
			catch (Err)
			{
			   // Ignore Exception 
			}    
        }    

		if(event.preventDefault)
		{
			event.preventDefault();
		}
		else
		{
			event.returnValue = false;
		}
		
		if(event.stopPropagation)
		{
			event.stopPropagation();
		}
		else
		{
			event.cancelBubble = true;
		}
    }
    catch (Err)
    {
       fatalMsg(Err, "raise");
    }    
}

function alertMsg(pMsg)
{
    try
    {
        if (pMsg != "")
        {
           alert(pMsg); 
        }

        if (event.toElement != null && event.toElement.getAttribute("validateMode") == "AlertOnly")
        {
           var wResultado;

           if (event.toElement.getAttribute("memberOf") == null) 
           { 
              wResultado = event.toElement.fireEvent("onclick");
           } 
           else
           {
              var wField = getElement( event.toElement.getAttribute("memberOf") );
              wResultado = wField.fireEvent("onclick");
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "alertMsg");
    }    
}

function fatalMsg(pException, pFunction)
{
    try
    {
       alert("Fatal error: " + pException.description + " executing " + pFunction + ".");

       setFocus(browser.srcElement);  // Projeto Sercomtel: setFocus(event.srcElement);
    }
    catch (Err)
    {
       alert("Fatal error: " + Err.description + " executing fatalMsg.");
    }    
}

function tabPressed()
{
    try
    {
       if (form.getAttribute("LastKeyCode") == "9" && form.getAttribute("LastShiftKey") == false)
       {
          return true; 
       }

       return false; 

    }
    catch (Err)
    {
       fatalMsg(Err, "tabPressed");
    }    
}

function shiftTabPressed()
{
    try
    {
       if (form.getAttribute("LastKeyCode") == "9" && form.getAttribute("LastShiftKey") == true)
       {
          return true; 
       }

       return false; 

    }
    catch (Err)
    {
       fatalMsg(Err, "shiftTabPressed");
    }    
}

function setFocus(pControl)
{
    try
    {
        var wControl;

        if (typeof pControl == "object")
        {
           wControl = pControl;
        }
        else if (typeof pControl == "string")
        {
           wControl = getElement(pControl); 
        }

        wControl.focus();
        try
        {
           wControl.select();
        }
        catch (Err)
        {
           // exception will be ignored
        }    
    }
    catch (Err)
    {
        // exception will be ignored
    }    
}

function getKeyCode(pEvent)
{
    try
    {
         var wKeyCode = pEvent.keyCode?pEvent.keyCode:pEvent.charCode; 

         return wKeyCode;
    }
    catch (Err)
    {
       fatalMsg(Err, "getKeyCode");
    }    
  
}

function fix(pElement)
{
    try
    {
       if ( pElement != null && typeof pElement == 'object')
       {
          wDecimals = pElement.getAttribute("Decimals"); 

          if (wDecimals != null)
          {
             var wResult = parseFloat(pElement.value);
             var wValue = wResult.toFixed(wDecimals);

             // Miranda - Revisar
             var wDecimalSeparator = form.getAttribute("decimalSeparator");

             if (wDecimalSeparator != ".")
             {
                wValue = wValue.replace(/\./g, wDecimalSeparator);
             }

             pElement.value = wValue;

             // Miranda - Revisar
          } 
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "fix");
    }    
}

function add(pFirstNumber, pSecondNumber, pResult)
{
    try
    {

        var wFirstNumber = get(pFirstNumber);
        var wSecondNumber = get(pSecondNumber); 

        pResult.value = parseFloat(wFirstNumber) + parseFloat(wSecondNumber);

        fix(pResult);
    }
    catch (Err)
    {
       fatalMsg(Err, "add");
    }    
}

function subtract(pFirstNumber, pSecondNumber, pResult)
{
    try
    {

        var wFirstNumber = get(pFirstNumber);
        var wSecondNumber = get(pSecondNumber); 

        pResult.value = parseFloat(wSecondNumber) - parseFloat(wFirstNumber);

        fix(pResult);
    }
    catch (Err)
    {
       fatalMsg(Err, "subtract");
    }    
}

function multiply(pFirstNumber, pSecondNumber, pResult)
{
    try
    {
        var wFirstNumber = get(pFirstNumber);
        var wSecondNumber = get(pSecondNumber); 

        pResult.value = parseFloat(wFirstNumber) * parseFloat(wSecondNumber);

        fix(pResult);
    }
    catch (Err)
    {
       fatalMsg(Err, "multiply");
    }    
}

function divide(pFirstNumber, pSecondNumber, pResult)
{
    try
    {

        var wFirstNumber = get(pFirstNumber);
        var wSecondNumber = get(pSecondNumber); 

        pResult.value = parseFloat(wSecondNumber) / parseFloat(wFirstNumber);

        fix(pResult);
    }
    catch (Err)
    {
       fatalMsg(Err, "divide");
    }    
}

function sumColumn(pCollection, pObjectName)
{
    try
    {
        var wCollection = getElement(pCollection);
        var wOccurs     = parseInt(get(pCollection + "_occurs"));
        var wObject;
        var wResult = 0;

        for (i = 0; i < wOccurs; i++)
        {
            var wObject = getElement(wCollection.id + "_" + pObjectName + "_" + i);

            if (wObject.value != "")
            {
               wResult = wResult + parseFloat(wObject.value);         
            }
        }
         
        return wResult;
    }
    catch (Err)
    {
       fatalMsg(Err, "getCurrent");
    }    
}

function getFormattedDate(pDateArray,pMask,pLanguageCode)
{
    var wDateArray = pDateArray;
   
    if (pMask == "DDMMYYYY" )
    {
        return (wDateArray.day + wDateArray.month + wDateArray.year);
    }
    else if (pMask == "MMDDYYYY" )
    {
        return (wDateArray.month + wDateArray.day + wDateArray.year);
    }
    else if (pMask == "YYYYMMDD")
    {
        return (wDateArray.year + wDateArray.month + wDateArray.day);
    }    
    else if (pMask == "DD/MM/YYYY")
    {
        return (wDateArray.day + "/" + wDateArray.month + "/" + wDateArray.year);
    }
    else if (pMask == "MM/DD/YYYY")
    {
        return (wDateArray.month + "/" + wDateArray.day + "/" + wDateArray.year);
    }
    else if (pMask == "YYYY/MM/DD")
    {
        return (wDateArray.year + "/" + wDateArray.month + "/" + wDateArray.day);
    }
    else if (pMask == "DD-MM-YYYY")
    {
        return (wDateArray.day + "-" + wDateArray.month + "-" + wDateArray.year);
    }    
    else if (pMask == "MM-DD-YYYY")
    {
        return (wDateArray.month + "-" + wDateArray.day + "-" + wDateArray.year);
    }
    else if (pMask == "YYYY-MM-DD")
    {
        return (wDateArray.year + "-" + wDateArray.month + "-" + wDateArray.day);
    }
    else if (pMask == "DD MM YYYY")
    {
        return (wDateArray.day + " " + wDateArray.month + " " + wDateArray.year);
    }
    else if (pMask == "YYYYMM")
    {
        return (wDateArray.year + wDateArray.month);
    } 	
    else
    {
        alert(MSG_0002); 
    }
}

function setFormattedDateCalendar(pDate,pMask, pLanguageCode)
{
    var wDate = pDate;
    var newDate = '';
     
    if (pMask == "DDMMYYYY")
    {
        newDate = wDate.value.substr(0,2) + '-' + 
        wDate.value.substr(2,2) + '-' + 
        wDate.value.substr(4,4);
    }
    else if (pMask == "MMDDYYYY")
    {
        newDate = wDate.value.substr(2,2) + '-' + 
        wDate.value.substr(0,2) + '-' + 
        wDate.value.substr(4,4);
    }
    else if (pMask == "YYYYMMDD")
    {
        newDate = wDate.value.substr(6,2) + '-' + 
        wDate.value.substr(4,2) + '-' + 
        wDate.value.substr(0,4);
    }
    else if( pMask == "DD/MM/YYYY")
    {
        newDate = replaceAll(wDate.value,"/","-");
    }
    else if( pMask == "DD-MM-YYYY")
    {
        newDate = wDate.value;
    }
    else if( pMask == "DD MM YYYY")
    {
        newDate = replaceAll(wDate.value," ","-");
    }
    else if( pMask == "MM/DD/YYYY" || pMask == "MM-DD-YYYY" )
    {
        newDate = wDate.value.substr(3,2) + '-' + 
        wDate.value.substr(0,2) + '-' + 
        wDate.value.substr(6,4);
    }
    else if( pMask == "YYYY/MM/DD" || pMask == "YYYY-MM-DD" )
    {
        newDate = wDate.value.substr(8,2) + '-' + 
        wDate.value.substr(5,2) + '-' + 
        wDate.value.substr(0,4);
    }
    else if (pMask == "YYYYMM")
    {
        newDate = '01-' + 
        wDate.value.substr(4,2) + '-' + 
        wDate.value.substr(0,4);
    }
    else if ( pMask == "DD" || pMask == "MM" || pMask == "MMM" ||
              pMask == "YY" || pMask == "YYYY" )
    {
        newDate = ''; 
    }
    else
    {
        alert(MSG_0002); 
        return;
    } 
    return newDate;
}


// *******************************************************
function JsFunctions () 
{
   this.exceptionRaised;
   this.byPass = null;
   this.ignoreValidation = false;
   this.popupMode = "Modal";
}

JsFunctions.prototype.goHome = function ()
{
    try
    {
        if (form.getAttribute("homePage") != null)
        {
           var wActivePanel  = getElement( get("form_activePanel") );

           if (wActivePanel != null)
           {
              var wFormStatus = document.getElementById("form_status");

              if (wActivePanel.getAttribute("toolbarMode") != "Basic" && wFormStatus.value == "CHANGED")
              {
                 if ( confirm("Do you want to save the changes you have made?") ) 
                 {
                    form_saveChanges();
                    return; 
                 }
              }
           }
           window.open(form.getAttribute("homePage"), '_self', 'center:yes;resizable:yes;scroll:yes;status:yes');
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.goHome");
    }    
}

JsFunctions.prototype.onLoad = function ()
{
    try
    {
        // Display the statusMsg
        if (form.getAttribute("statusMsg") != null && form.getAttribute("statusMsg") != "")
        {
           window.status = form.getAttribute("statusMsg");
        }

        // Display the alert messages 
        form_showAlerts();

        // Checks if the instances ajax and popup were created correctly		
		if ( ajax == null )
	    {
		   ajax = new Ajax(true);
	    }

		if ( popup == null )
	    {
		   popup = new Popup(true);
	    }
		
        // Sets the activeControl
        var wActiveControl = getElement("form_activeControl");

        if (wActiveControl == null)
        {
           return;
        }

        if (wActiveControl.value == "")
        {
           var wActivePanel = getElement( get("form_activePanel") );

           if (wActivePanel == null)
           {
              wActivePanel = getElement(form.getAttribute("masterPanel"));
           }

           if (wActivePanel != null)
           {
              var wField;
              var wFirstField;
              var wFieldArray;

              if (wActivePanel.getAttribute("originalClass") == "DBCollection")
              {
                 set ("form_activePanel", wActivePanel.id + "_panel_0" );
 
                 wFieldArray = panel.getSubFields( wActivePanel.id + "_panel_0" );
              }
              else
              {
                 set ("form_activePanel", wActivePanel.id ); 

                 wFieldArray = panel.getSubFields( wActivePanel.id );
              } 

              // Disable panel fields
              for (i = 0; i < wFieldArray.length; i++) 
              {
                  wField = wFieldArray[i];
       
                  if (wField.type.toUpperCase() != "HIDDEN" && wField.style.visibility.toUpperCase() != "HIDDEN")
                  {
                     if (wFirstField == null)
                     {
                        wFirstField = wField;
                        break;                          
                     }
                  }
               }

               // Set focus on first insert field
               if (wFirstField != null)
               {
                  set ("form_activeControl", wFirstField.id); 

                  setFocus(wFirstField);
               }
            }
         }
        else
        {
           var wControl = getElement(wActiveControl.value);

           if (wControl != null)
           {
              if (wControl.getAttribute("subFieldOf") != null)
              { 
                 set ("form_activePanel", wControl.getAttribute("subFieldOf")); 
              }

              setFocus(wControl);
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.onload");
    }    
}

JsFunctions.prototype.onChange = function (pControl)
{
    try
    {
        var wActivePanel  = getElement( get("form_activePanel") );

        if (wActivePanel == null)
        {
           return;       
        }

        var wFormStatus   = getElement("form_status");
        var wFormMode     = getElement("form_mode");
        var wRecordStatus = getElement(wActivePanel.id + "_recordStatus");
        var wRowId        = getElement(wActivePanel.id + "_rowid");

        if (wActivePanel.getAttribute("toolbarMode") != "Basic")
        {
           if (wFormMode.value != "PrepareQuery")
           {
              if ( (wRecordStatus.value == "" && wRowId.value == "") || wRecordStatus.value.toUpperCase() == "INSERT")
              {
                 wRecordStatus.value = "INSERT";
              }
              else
              {
                 wRecordStatus.value = "CHANGED";
              }

              wFormStatus.value = "CHANGED";
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.onChange()");
    }    
}

JsFunctions.prototype.onKeyPress = function (pThis, pEvent)
{
    try
    {
        var wFormMode = getElement("form_mode");

        if (pThis.getAttribute("subFieldOf") != null && wFormMode != null)
        {
           if (wFormMode.value == "PrepareQuery")
           {
              if (pThis.getAttribute("allowQuery") == "False")
              {
                 alert(MSG_0203); // Field is protected against query
                 js.resetKeyCode(pEvent);
                 return;
              }

              var wDBPanel = getElement(pThis.getAttribute("subFieldOf"));

              if (wDBPanel.getAttribute("allowQuery") == "False")
              {
                 alert(MSG_0207); // Panel is protected against query
                 js.resetKeyCode(pEvent);
                 return;
              }
            
              // When PrepareQuery, the numeric and caseRestriction validation won't be executed
              return;
           }
           else
           {
              var wRecordStatus = getElement(pThis.getAttribute("subFieldOf") + "_recordStatus");

              if ( wRecordStatus.value == "DELETE" )
              {
                    alert(MSG_0204); // Field is protected against delete
                    js.resetKeyCode(pEvent);
                    return;
              }

              // Allow Insert and Allow Update validation
              var wRowId = getElement(pThis.getAttribute("subFieldOf") + "_rowid");
              var wDBPanel = getElement(pThis.getAttribute("subFieldOf"));

              if ( wRowId.value == "" )
              {
                 if (pThis.getAttribute("allowInsert") == "False")
                 {
                    alert(MSG_0201); // Field is protected against insert
                    js.resetKeyCode(pEvent);
                    return;
                 }

                 if (wDBPanel.getAttribute("allowInsert") == "False")
                 {
                    alert(MSG_0205); // Panel is protected against insert
                    js.resetKeyCode(pEvent);
                    return;
                 }
              }
              else
              {
                 if (pThis.getAttribute("allowUpdate") == "False")
                 {
                    alert(MSG_0202); // Field is protected against update
                    js.resetKeyCode(pEvent);
                    return;
                 }

                 if (wDBPanel.getAttribute("allowUpdate") == "False")
                 {
                    alert(MSG_0206); // Panel is protected against update
                    js.resetKeyCode(pEvent);
                    return;
                 }
              }
           }
        }

        // Numeric field validation
        if (pThis.getAttribute("datatype") == "Number")
        {
           if (browser.isIE())
           {
              var wDecimalSeparator = form.getAttribute("decimalSeparator"); // The default decimal separator is dot
              var wDecimalSeparatorKeyCode = 46; // The default decimal separator is dot

              if (wDecimalSeparator != null && wDecimalSeparator == ',')
              {
                 wDecimalSeparatorKeyCode = 44;
              }

              if (pEvent.keyCode != 48 &&
                  pEvent.keyCode != 49 &&
                  pEvent.keyCode != 50 &&
                  pEvent.keyCode != 51 &&
                  pEvent.keyCode != 52 &&
                  pEvent.keyCode != 53 &&
                  pEvent.keyCode != 54 &&
                  pEvent.keyCode != 55 &&
                  pEvent.keyCode != 56 &&
                  pEvent.keyCode != 57 &&
                  pEvent.keyCode != 27 &&
                  pEvent.keyCode != 13 &&
	          pEvent.keyCode != 8 &&
                  pEvent.keyCode != wDecimalSeparatorKeyCode )
              {
                  alert(MSG_0200); // Invalid KeyCode on numeric fields
                  pEvent.keyCode = 0;
                  return;
              }

              // Checking if the field contains decimals ...
              var wDecimals = pThis.getAttribute("decimals");
              if ( wDecimals == null && pEvent.keyCode == wDecimalSeparatorKeyCode )
              {
                 alert(MSG_0310); // Invalid KeyCode on numeric fields without decimals
                 pEvent.keyCode = 0;
                 return;
              }
			  
			  if (pEvent.keyCode == wDecimalSeparatorKeyCode && pThis.value.indexOf(wDecimalSeparator) != -1) {
				  alert(MSG_0324); // Too many decimal separators
				  pEvent.keyCode = 0;
				  return;
			  } else if (!js_validateMaxlength(pEvent, pThis)) {
				  pEvent.keyCode = 0;
				  return;
			  }
			  
           }
           else
           {
              var wDecimalSeparator = form.getAttribute("decimalSeparator"); // The default decimal separator is dot
              var wDecimalSeparatorKeyCode = 46; // The default decimal separator is dot

              if (wDecimalSeparator != null && wDecimalSeparator == ',')
              {
                 wDecimalSeparatorKeyCode = 44;
              }

              if (pEvent.which != 48 &&
                  pEvent.which != 49 &&
                  pEvent.which != 50 &&
                  pEvent.which != 51 &&
                  pEvent.which != 52 &&
                  pEvent.which != 53 &&
                  pEvent.which != 54 &&
                  pEvent.which != 55 &&
                  pEvent.which != 56 &&
                  pEvent.which != 57 &&
                  pEvent.which != 27 &&
                  pEvent.which != 13 &&
	          pEvent.which != 8 &&
                  pEvent.which != 0 &&
                  pEvent.which != wDecimalSeparatorKeyCode )
              {
                  alert(MSG_0200); // Invalid KeyCode on numeric fields
                  pEvent.preventDefault();
                  return;
              }

              // Checking if the field contains decimals ...
              var wDecimals = pThis.getAttribute("decimals");
              if ( wDecimals == null && pEvent.which  == wDecimalSeparatorKeyCode )
              {
                 alert(MSG_0310); // Invalid KeyCode on numeric fields without decimals
                 pEvent.preventDefault();
                 return;
              }
			  
			   if (pEvent.keyCode == wDecimalSeparatorKeyCode && pThis.value.indexOf(wDecimalSeparator) != -1) 
			   {
				   alert(MSG_0324); // Too many decimal separators
				   pEvent.preventDefault();
				   return;
			   } 
			   else if (!js_validateMaxlength(pEvent, pThis))
			   {
				   pEvent.preventDefault();
				   return;
			   }
			  
           }
        }

        // Case Restriction validation
        if (pThis.getAttribute("caseRestriction") == "UpperCase")
        {
           if (browser.isIE())
           {
              if (pEvent.keyCode >= 97 && pEvent.keyCode <= 122)
              {
                 pEvent.keyCode = pEvent.keyCode - 32;
              }

              if (pEvent.keyCode == 231) { pEvent.keyCode = 199; }

              if (pEvent.keyCode == 225) { pEvent.keyCode = 193; }
              if (pEvent.keyCode == 233) { pEvent.keyCode = 201; }
              if (pEvent.keyCode == 237) { pEvent.keyCode = 205; }
              if (pEvent.keyCode == 243) { pEvent.keyCode = 211; }
              if (pEvent.keyCode == 250) { pEvent.keyCode = 218; }

              if (pEvent.keyCode == 226) { pEvent.keyCode = 194; }
              if (pEvent.keyCode == 234) { pEvent.keyCode = 202; }
              if (pEvent.keyCode == 238) { pEvent.keyCode = 206; }
              if (pEvent.keyCode == 244) { pEvent.keyCode = 212; }
              if (pEvent.keyCode == 251) { pEvent.keyCode = 219; }

              if (pEvent.keyCode == 227) { pEvent.keyCode = 195; }
              if (pEvent.keyCode == 245) { pEvent.keyCode = 213; }
           }
           else
           {
			  /*
              if (pEvent.which >= 97 && pEvent.which <= 122)
              {
                 pThis.value += String.fromCharCode(pEvent.which).toUpperCase();
	             pEvent.preventDefault();
              }

              if (pEvent.which == 231) { pThis.value += String.fromCharCode(199); pEvent.preventDefault();}
 
              if (pEvent.which == 225) { pThis.value += String.fromCharCode(193); pEvent.preventDefault(); }
              if (pEvent.which == 233) { pThis.value += String.fromCharCode(201); pEvent.preventDefault(); }
              if (pEvent.which == 237) { pThis.value += String.fromCharCode(205); pEvent.preventDefault(); }
              if (pEvent.which == 243) { pThis.value += String.fromCharCode(211); pEvent.preventDefault(); }
              if (pEvent.which == 250) { pThis.value += String.fromCharCode(218); pEvent.preventDefault(); }

              if (pEvent.which == 226) { pThis.value += String.fromCharCode(194); pEvent.preventDefault(); }
              if (pEvent.which == 234) { pThis.value += String.fromCharCode(202); pEvent.preventDefault(); }
              if (pEvent.which == 238) { pThis.value += String.fromCharCode(206); pEvent.preventDefault(); }
              if (pEvent.which == 244) { pThis.value += String.fromCharCode(212); pEvent.preventDefault(); }
              if (pEvent.which == 251) { pThis.value += String.fromCharCode(219); pEvent.preventDefault(); }

              if (pEvent.which == 227) { pThis.value += String.fromCharCode(195); pEvent.preventDefault(); }
              if (pEvent.which == 245) { pThis.value += String.fromCharCode(213); pEvent.preventDefault(); }
			  */
           }
        }
        else if (pThis.getAttribute("caseRestriction") == "LowerCase")
        {
           if (browser.isIE())
           {
              if (pEvent.keyCode >= 65 && pEvent.keyCode <= 90)
              {
                 pEvent.keyCode = pEvent.keyCode + 32;
              }

              if (pEvent.keyCode == 199) { pEvent.keyCode = 231; }

              if (pEvent.keyCode == 193) { pEvent.keyCode = 225; }
              if (pEvent.keyCode == 201) { pEvent.keyCode = 233; }
              if (pEvent.keyCode == 205) { pEvent.keyCode = 237; }
              if (pEvent.keyCode == 211) { pEvent.keyCode = 243; }
              if (pEvent.keyCode == 218) { pEvent.keyCode = 250; }
              if (pEvent.keyCode == 194 ) { pEvent.keyCode = 226; }
              if (pEvent.keyCode == 202 ) { pEvent.keyCode = 234; }
              if (pEvent.keyCode == 206 ) { pEvent.keyCode = 238; }
              if (pEvent.keyCode == 212 ) { pEvent.keyCode = 244; }
              if (pEvent.keyCode == 219 ) { pEvent.keyCode = 251; }

              if (pEvent.keyCode == 195 ) { pEvent.keyCode = 227; }
              if (pEvent.keyCode == 213 ) { pEvent.keyCode = 245; }
           }
           else
           {
			  /* 
              if (pEvent.which >= 65 && pEvent.which <= 90)
              {
                 pThis.value += String.fromCharCode(pEvent.which).toLowerCase();
   	         pEvent.preventDefault();
              }

              if (pEvent.which == 199) { pThis.value += String.fromCharCode(231); pEvent.preventDefault();}

              if (pEvent.which == 193) { pThis.value += String.fromCharCode(225); pEvent.preventDefault();}
              if (pEvent.which == 201) { pThis.value += String.fromCharCode(233); pEvent.preventDefault();}
              if (pEvent.which == 205) { pThis.value += String.fromCharCode(237); pEvent.preventDefault();}
              if (pEvent.which == 211) { pThis.value += String.fromCharCode(243); pEvent.preventDefault();}
              if (pEvent.which == 218) { pThis.value += String.fromCharCode(250); pEvent.preventDefault();}
              if (pEvent.which == 194 ) { pThis.value += String.fromCharCode(226); pEvent.preventDefault();}
              if (pEvent.which == 202 ) { pThis.value += String.fromCharCode(234); pEvent.preventDefault();}
              if (pEvent.which == 206 ) { pThis.value += String.fromCharCode(238); pEvent.preventDefault();}
              if (pEvent.which == 212 ) { pThis.value += String.fromCharCode(244); pEvent.preventDefault();}
              if (pEvent.which == 219 ) { pThis.value += String.fromCharCode(251); pEvent.preventDefault();}

              if (pEvent.which == 195 ) { pThis.value += String.fromCharCode(227); pEvent.preventDefault();}
              if (pEvent.which == 213 ) { pThis.value += String.fromCharCode(245); pEvent.preventDefault();}
			  */
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.onKeyPress");
    }    
}

JsFunctions.prototype.onPaste = function (pThis, pEvent)
{
    try
    {
        var wFormMode = getElement("form_mode");

        if (pThis.getAttribute("subFieldOf") != null && wFormMode != null)
        {
           if (wFormMode.value == "PrepareQuery")
           {
              if (pThis.getAttribute("allowQuery") == "False")
              {
                 alert(MSG_0203); // Field is protected against query
                 this.cancelEvent(pEvent);
                 return;
              }

              var wDBPanel = getElement(pThis.getAttribute("subFieldOf"));

              if (wDBPanel.getAttribute("allowQuery") == "False")
              {
                 alert(MSG_0207); // Panel is protected against query
                 this.cancelEvent(pEvent);
                 return;
              }
           }
           else
           {
              var wRecordStatus = getElement(pThis.getAttribute("subFieldOf") + "_recordStatus");
              if ( wRecordStatus.value == "DELETE" )
              {
                 alert(MSG_0204); // Field is protected against delete
                 this.cancelEvent(pEvent);
                 return;
              }

              // Allow Insert and Allow Update validation
              var wRowId = getElement(pThis.getAttribute("subFieldOf") + "_rowid");
              var wDBPanel = getElement(pThis.getAttribute("subFieldOf"));

              if ( wRowId.value == "" )
              {
                 if (pThis.getAttribute("allowInsert") == "False")
                 {
                    alert(MSG_0201); // Field is protected against insert
                    this.cancelEvent(pEvent);
                    return;
                 }

                 if (wDBPanel.getAttribute("allowInsert") == "False")
                 {
                    alert(MSG_0205); // Panel is protected against insert
                    this.cancelEvent(pEvent);
                    return;
                 }
              }
              else
              {
                 if (pThis.getAttribute("allowUpdate") == "False")
                 {
                    alert(MSG_0202); // Field is protected against update
                    this.cancelEvent(pEvent);
                    return;
                 }

                 if (wDBPanel.getAttribute("allowUpdate") == "False")
                 {
                    alert(MSG_0206); // Panel is protected against update
                    this.cancelEvent(pEvent);
                    return;
                 }
              }
           }
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.onPaste");
    }    
}

JsFunctions.prototype.cancelEvent = function (pEvent)
{
    try
    {
        if (document.all)
        {
           pEvent.returnValue = false;
        }
        else
        {
           pEvent.preventDefault();
        } 
    }
    catch (Err)
    {
       fatalMsg(Err, "js.cancelEvent");
    }    
}

JsFunctions.prototype.resetKeyCode = function (pEvent)
{
    try
    {
        if (document.all)
        {
           pEvent.keyCode = 0;
        }
        else
        {
           pEvent.preventDefault();
        } 
    }
    catch (Err)
    {
       fatalMsg(Err, "js.resetKeyCode");
    }    
}
JsFunctions.prototype.onKeyDown = function (pEvent)
{
    try
    {		
       var wKeyCode;
       var wShiftKey;
       var wAltKey;
       var wCtrlKey;

       if (browser.isIE())
       {
          wKeyCode = pEvent.keyCode;
          wShiftKey = pEvent.shiftKey;
          wAltKey = pEvent.altKey;
          wCtrlKey = pEvent.ctrlKey;
       }
       else
       {
          wKeyCode = pEvent.which;
          wShiftKey = pEvent.shiftKey;
          wAltKey = pEvent.altKey;
          wCtrlKey = pEvent.ctrlKey;
       }

       var wSpecialKey = false;

        var F1  = 112;
        var F2  = 113;
        var F3  = 114;
        var F4  = 115;
        var F5  = 116;
        var F6  = 117;
        var F7  = 118;
        var F8  = 119;
        var F9  = 120;
        var F10 = 121;
        var F11 = 122;
        var F12 = 123;

        var A = 65;
        var B = 66;
        var C = 67;
        var D = 68;
        var E = 69;
        var F = 70;
        var G = 71;
        var H = 72;
        var I = 73;
        var J = 74;
        var K = 75;
        var L = 76;
        var M = 77;
        var N = 78;
        var O = 79;
        var P = 80;
        var Q = 81;
        var R = 82;
        var S = 83;
        var T = 84;
        var U = 85;
        var V = 86;
        var W = 87;
        var X = 88;
        var Y = 89;
        var Z = 90;

        var ESCAPE = 27
        var PAGE_DOWN = 34;
        var END = 35;
        var HOME = 36;
        var ENTER = 13;

        // Save keyCode, shiftKey, altKey and ctrlKey as attributes of form
        form.setAttribute("LastKeyCode", wKeyCode);
        form.setAttribute("LastShiftKey", wShiftKey);
        form.setAttribute("LastAltKey", wAltKey);
        form.setAttribute("LastCtrlKey", wCtrlKey);

       if (wShiftKey)
       {
	  switch(wKeyCode)
	  {
		case F1: 
                     if (form.getAttribute("onShiftF1") != null) { wSpecialKey = true; }
                     break;
		case F2: 
                     if (form.getAttribute("onShiftF2") != null) { wSpecialKey = true; }
                     break;
		case F3: 
                     if (form.getAttribute("onShiftF3") != null) { wSpecialKey = true; }
                     break;
		case F4: 
                     if (form.getAttribute("onShiftF4") != null) { wSpecialKey = true; }
                     break;
		case F5: 
                     if (form.getAttribute("onShiftF5") != null) { wSpecialKey = true; }
                     break;
		case F6: 
                     if (form.getAttribute("onShiftF6") != null) { wSpecialKey = true; }
                     break;
		case F7: 
                     if (form.getAttribute("onShiftF7") != null) { wSpecialKey = true; }
                     break;
		case F8: 
                     if (form.getAttribute("onShiftF8") != null) { wSpecialKey = true; }
                     break;
		case F9: 
                     if (form.getAttribute("onShiftF9") != null) { wSpecialKey = true; }
                     break;
		case F10: 
                     if (form.getAttribute("onShiftF10") != null) { wSpecialKey = true; }
                     break;
		case F11: 
                     if (form.getAttribute("onShiftF11") != null) { wSpecialKey = true; }
                     break;
		case F12: 
                     if (form.getAttribute("onShiftF12") != null) { wSpecialKey = true; }; 
                     break;
		case ESCAPE: 
                     if (form.getAttribute("onShiftEscape") != null) { wSpecialKey = true; }
                     break;
		case PAGE_DOWN: 
                     if (form.getAttribute("onShiftPageDown") != null) { wSpecialKey = true; }
                     break;
		case END: 
                     if (form.getAttribute("onShiftEnd") != null) { wSpecialKey = true; }
                     break;
		case HOME: 
                     if (form.getAttribute("onShiftHome") != null) { wSpecialKey = true; }
                     break;
	 }
       }
       else if (wAltKey)
       {
	  switch(wKeyCode)
	  {
		case F1: 
                     if (form.getAttribute("onAltF1") != null) { wSpecialKey = true; }
                     break;
		case F2: 
                     if (form.getAttribute("onAltF2") != null) { wSpecialKey = true; }
                     break;
		case F3: 
                     if (form.getAttribute("onAltF3") != null) { wSpecialKey = true; }
                     break;
		case F4: 
                     if (form.getAttribute("onAltF4") != null) { wSpecialKey = true; }
                     break;
		case F5: 
                     if (form.getAttribute("onAltF5") != null) { wSpecialKey = true; }
                     break;
		case F6: 
                     if (form.getAttribute("onAltF6") != null) { wSpecialKey = true; }
                     break;
		case F7: 
                     if (form.getAttribute("onAltF7") != null) { wSpecialKey = true; }
                     break;
		case F8: 
                     if (form.getAttribute("onAltF8") != null) { wSpecialKey = true; }
                     break;
		case F9: 
                     if (form.getAttribute("onAltF9") != null) { wSpecialKey = true; }
                     break;
		case F10: 
                     if (form.getAttribute("onAltF10") != null) { wSpecialKey = true; }
                     break;
		case F11: 
                     if (form.getAttribute("onAltF11") != null) { wSpecialKey = true; }
                     break;
		case F12: 
                     if (form.getAttribute("onAltF12") != null) { wSpecialKey = true; }
                     break;
		case ESCAPE: 
                     if (form.getAttribute("onAltEscape") != null) { wSpecialKey = true; }
                     break;
		case PAGE_DOWN: 
                     if (form.getAttribute("onAltPageDown") != null) { wSpecialKey = true; }
                     break;
		case END: 
                     if (form.getAttribute("onAltEnd") != null) { wSpecialKey = true; }
                     break;
		case HOME: 
                     if (form.getAttribute("onAltHome") != null) { wSpecialKey = true; }
                     break;

	 }
       }
       else if (wCtrlKey)
       {
	  switch(wKeyCode)
	  {
		case F1: 
                     if (form.getAttribute("onCtrlF1") != null) { wSpecialKey = true; }
                     break;
		case F2: 
                     if (form.getAttribute("onCtrlF2") != null) { wSpecialKey = true; }
                     break;
		case F3: 
                     if (form.getAttribute("onCtrlF3") != null) { wSpecialKey = true; }
                     break;
		case F4: 
                     if (form.getAttribute("onCtrlF4") != null) { wSpecialKey = true; }
                     break;
		case F5: 
                     if (form.getAttribute("onCtrlF5") != null) { wSpecialKey = true; }
                     break;
		case F6: 
                     if (form.getAttribute("onCtrlF6") != null) { wSpecialKey = true; }
                     break;
		case F7: 
                     if (form.getAttribute("onCtrlF7") != null) { wSpecialKey = true; }
                     break;
		case F8: 
                     if (form.getAttribute("onCtrlF8") != null) { wSpecialKey = true; }
                     break;
		case F9: 
                     if (form.getAttribute("onCtrlF9") != null) { wSpecialKey = true; }
                     break;
		case F10: 
                     if (form.getAttribute("onCtrlF10") != null) { wSpecialKey = true; }
                     break;
		case F11: 
                     if (form.getAttribute("onCtrlF11") != null) { wSpecialKey = true; }
                     break;
		case F12: 
                     if (form.getAttribute("onCtrlF12") != null) { wSpecialKey = true; }
                     break;
		case A: 
                     if (form.getAttribute("onCtrlA") != null) { wSpecialKey = true; }
                     break;
		case B: 
                     if (form.getAttribute("onCtrlB") != null) { wSpecialKey = true; }
                     break;
		case C: 
                     if (form.getAttribute("onCtrlC") != null) { wSpecialKey = true; }
                     break;
		case D: 
                     if (form.getAttribute("onCtrlD") != null) { wSpecialKey = true; }
                     break;
		case E: 
                     if (form.getAttribute("onCtrlE") != null) { wSpecialKey = true; }
                     break;
		case F: 
                     if (form.getAttribute("onCtrlF") != null) { wSpecialKey = true; }
                     break;
		case G: 
                     if (form.getAttribute("onCtrlG") != null) { wSpecialKey = true; }
                     break;
		case H: 
                     if (form.getAttribute("onCtrlH") != null) { wSpecialKey = true; }
                     break;
		case I: 
                     if (form.getAttribute("onCtrlI") != null) { wSpecialKey = true; }
                     break;
		case J: 
                     if (form.getAttribute("onCtrlJ") != null) { wSpecialKey = true; }
                     break;
		case K: 
                     if (form.getAttribute("onCtrlK") != null) { wSpecialKey = true; }
                     break;
		case L: 
                     if (form.getAttribute("onCtrlL") != null) { wSpecialKey = true; }
                     break;
		case M: 
                     if (form.getAttribute("onCtrlM") != null) { wSpecialKey = true; }
                     break;
		case N: 
                     if (form.getAttribute("onCtrlN") != null) { wSpecialKey = true; }
                     break;
		case O: 
                     if (form.getAttribute("onCtrlO") != null) { wSpecialKey = true; }
                     break;
		case P: 
                     if (form.getAttribute("onCtrlP") != null) { wSpecialKey = true; }
                     break;
		case Q: 
                     if (form.getAttribute("onCtrlQ") != null) { wSpecialKey = true; }
                     break;
		case R: 
                     if (form.getAttribute("onCtrlR") != null) { wSpecialKey = true; }
                     break;
		case S: 
                     if (form.getAttribute("onCtrlS") != null) { wSpecialKey = true; }
                     break;
		case T: 
                     if (form.getAttribute("onCtrlT") != null) { wSpecialKey = true; }
                     break;
		case U: 
                     if (form.getAttribute("onCtrlU") != null) { wSpecialKey = true; }
                     break;
		case V: 
                     if (form.getAttribute("onCtrlV") != null) { wSpecialKey = true; }
                     break;
		case W: 
                     if (form.getAttribute("onCtrlW") != null) { wSpecialKey = true; }
                     break;
		case X: 
                     if (form.getAttribute("onCtrlX") != null) { wSpecialKey = true; }
                     break;
		case Y: 
                     if (form.getAttribute("onCtrlY") != null) { wSpecialKey = true; }
                     break;
		case Z: 
                     if (form.getAttribute("onCtrlZ") != null) { wSpecialKey = true; }
                     break;
		case ESCAPE: 
                     if (form.getAttribute("onCtrlEscape") != null) { wSpecialKey = true; }
                     break;
		case PAGE_DOWN: 
                     if (form.getAttribute("onCtrlPageDown") != null) { wSpecialKey = true; }
                     break;
		case END: 
                     if (form.getAttribute("onCtrlEnd") != null) { wSpecialKey = true; }
                     break;
		case HOME: 
                     if (form.getAttribute("onCtrlHome") != null) { wSpecialKey = true; }
                     break;
	 }
       } 
       else
       {
	  switch(wKeyCode)
	  {
		case F1: 
                     if (form.getAttribute("onF1") != null) { wSpecialKey = true; }
                     break;
		case F2: 
                     if (form.getAttribute("onF2") != null) { wSpecialKey = true; }
                     break;
		case F3: 
                     if (form.getAttribute("onF3") != null) { wSpecialKey = true; }
                     break;
		case F4: 
                     if (form.getAttribute("onF4") != null) { wSpecialKey = true; }
                     break;
		case F5: 
                     if (form.getAttribute("onF5") != null) { wSpecialKey = true; }
                     break;
		case F6: 
                     if (form.getAttribute("onF6") != null) { wSpecialKey = true; }
                     break;
		case F7: 
                     if (form.getAttribute("onF7") != null) { wSpecialKey = true; }
                     break;
		case F8: 
                     if (form.getAttribute("onF8") != null) { wSpecialKey = true; }
                     break;
		case F9: 
                     if (form.getAttribute("onF9") != null) { wSpecialKey = true; }
                     break;
		case F10: 
                     if (form.getAttribute("onF10") != null) { wSpecialKey = true; }
                     break;
		case F11: 
                     if (form.getAttribute("onF11") != null) { wSpecialKey = true; }
                     break;
		case F12: 
                     if (form.getAttribute("onF12") != null) { wSpecialKey = true; }
                     break;
		case ESCAPE: 
                     if (form.getAttribute("onEscape") != null) { wSpecialKey = true; }
                     break;
		case PAGE_DOWN: 
                     if (form.getAttribute("onPageDown") != null) { wSpecialKey = true; }
                     break;
		case END: 
                     if (form.getAttribute("onEnd") != null) { wSpecialKey = true; }
                     break;
		case HOME: 
                     if (form.getAttribute("onHome") != null) { wSpecialKey = true; }
                     break;
		case ENTER: 
                     if (form.getAttribute("onEnter") != null) { wSpecialKey = true; }
                     break;
	 }
      }
 
       if ( wSpecialKey == true )
       {	
          if (browser.isIE())
          {
       	     // Cancels the standard behaviour and propagation
	        pEvent.cancelBubble = true;
	        pEvent.returnValue = false;
	        pEvent.keyCode = 0;
          }
          else
          {
             pEvent.preventDefault();
          }
       }

       if ( ! handleDisabledKeys(pEvent) ) {
	   	     return false;
	   }     
    }
    catch (Err)
    {
       alert(MSG_0000);
    }    
}

/*
 * Handle disabled keys correctly for Innovation. The previous handling 
 * set in ULegacy package (LegacyPage.java) only works inside fields
 * of the form.
 */	
function handleDisabledKeys(event) {
   
     // Disabled keys
   
     if (event.keyCode == 122)
     {
        alert(MSG_0325);  // F11 key is disabled
		window.event.keyCode = 0;
        return false;
     }
     if (event.ctrlKey && event.keyCode == 85)
     {
        alert(MSG_0326);  // CTRL-U key is disabled
        return false;
     }
     if (event.ctrlKey && event.keyCode == 78)
     {
        alert(MSG_0327);  // CTRL-N key is disabled
        return false;
     }
     if (event.altKey && event.keyCode == 37)
     {
        alert(MSG_0328);  //  ALT <- key is disabled
        return false;
     }
     if (event.altKey && event.keyCode == 39)
     {
        alert(MSG_0329);  //  ALT -> key is disabled
        return false;
     }
	 
	 return true; // No disabled keys detected
}
   
JsFunctions.prototype.onKeyUp = function (pEvent)
{
    try
    {
       var wKeyCode;
       var wShiftKey;
       var wAltKey;
       var wCtrlKey;

       if (browser.isIE())
       {
          wKeyCode = pEvent.keyCode;
          wShiftKey = pEvent.shiftKey;
          wAltKey = pEvent.altKey;
          wCtrlKey = pEvent.ctrlKey;
       }
       else
       {
          wKeyCode = pEvent.which;
          wShiftKey = pEvent.shiftKey;
          wAltKey = pEvent.altKey;
          wCtrlKey = pEvent.ctrlKey;
       }


        var F1  = 112;
        var F2  = 113;
        var F3  = 114;
        var F4  = 115;
        var F5  = 116;
        var F6  = 117;
        var F7  = 118;
        var F8  = 119;
        var F9  = 120;
        var F10 = 121;
        var F11 = 122;
        var F12 = 123;

        var A = 65;
        var B = 66;
        var C = 67;
        var D = 68;
        var E = 69;
        var F = 70;
        var G = 71;
        var H = 72;
        var I = 73;
        var J = 74;
        var K = 75;
        var L = 76;
        var M = 77;
        var N = 78;
        var O = 79;
        var P = 80;
        var Q = 81;
        var R = 82;
        var S = 83;
        var T = 84;
        var U = 85;
        var V = 86;
        var W = 87;
        var X = 88;
        var Y = 89;
        var Z = 90;

        var ARROW_UP   = 38;
        var ARROW_DOWN = 40;  

        var ESC  = 27
        var ESCAPE  = 27
        var PAGE_DOWN = 34;
        var END = 35;
        var HOME = 36;
        var ENTER = 13;

       if (wShiftKey)
       {
	  switch(wKeyCode)
	  {
		case F1: 
                     if (form.getAttribute("onShiftF1") != null) { this.validateKey(); eval( form.getAttribute("onShiftF1") ); }
                     break;
		case F2: 
                     if (form.getAttribute("onShiftF2") != null) { this.validateKey(); eval( form.getAttribute("onShiftF2") ); }
                     break;
		case F3: 
                     if (form.getAttribute("onShiftF3") != null) { this.validateKey(); eval( form.getAttribute("onShiftF3") ); }
                     break;
		case F4: 
                     if (form.getAttribute("onShiftF4") != null) { this.validateKey(); eval( form.getAttribute("onShiftF4") ); }
                     break;
		case F5: 
                     if (form.getAttribute("onShiftF5") != null) { this.validateKey(); eval( form.getAttribute("onShiftF5") ); }
                     break;
		case F6: 
                     if (form.getAttribute("onShiftF6") != null) { this.validateKey(); eval( form.getAttribute("onShiftF6") ); }
                     break;
		case F7: 
                     if (form.getAttribute("onShiftF7") != null) { this.validateKey(); eval( form.getAttribute("onShiftF7") ); }
                     break;
		case F8: 
                     if (form.getAttribute("onShiftF8") != null) { this.validateKey(); eval( form.getAttribute("onShiftF8") ); }
                     break;
		case F9: 
                     if (form.getAttribute("onShiftF9") != null) { this.validateKey(); eval( form.getAttribute("onShiftF9") ); }
                     break;
		case F10: 
                     if (form.getAttribute("onShiftF10") != null) { this.validateKey(); eval( form.getAttribute("onShiftF10") ); }
                     break;
		case F11: 
                     if (form.getAttribute("onShiftF11") != null) { this.validateKey(); eval( form.getAttribute("onShiftF11") ); }
                     break;
		case F12: 
                     if (form.getAttribute("onShiftF12") != null) 
                     {  
                        this.validateKey(); eval( form.getAttribute("onShiftF12") ); 
                     }
                     else
                     {
                        if (form.getAttribute("exceptionMessage") != null)
                        {
                           alert( form.getAttribute("exceptionMessage") );
                        }
                     } 
                     break;
		case ARROW_UP: 
                     if (form.getAttribute("onShiftArrowUp") != null) { this.validateKey(); eval( form.getAttribute("onShiftArrowUp") ); }
                     break;
		case ARROW_DOWN: 
                     if (form.getAttribute("onShiftArrowDown") != null) { this.validateKey(); eval( form.getAttribute("onShiftArrowDown") ); }
                     break;
		case ESCAPE: 
                     if (form.getAttribute("onShiftEscape") != null) { this.validateKey(); eval( form.getAttribute("onShiftEscape") ); }
                     break;
		case PAGE_DOWN: 
                     if (form.getAttribute("onShiftPageDown") != null) { this.validateKey(); eval( form.getAttribute("onShiftPageDown") ); }
                     break;
		case END: 
                     if (form.getAttribute("onShiftEnd") != null) { this.validateKey(); eval( form.getAttribute("onShiftEnd") ); }
                     break;
		case HOME: 
                     if (form.getAttribute("onShiftHome") != null) { this.validateKey(); eval( form.getAttribute("onShiftHome") ); }
                     break;
	 }
       }
       else if (wAltKey)
       {
	  switch(wKeyCode)
	  {
		case F1: 
                     if (form.getAttribute("onAltF1") != null) { this.validateKey(); eval( form.getAttribute("onAltF1") ); }
                     break;
		case F2: 
                     if (form.getAttribute("onAltF2") != null) { this.validateKey(); eval( form.getAttribute("onAltF2") ); }
                     break;
		case F3: 
                     if (form.getAttribute("onAltF3") != null) { this.validateKey(); eval( form.getAttribute("onAltF3") ); }
                     break;
		case F4: 
                     if (form.getAttribute("onAltF4") != null) { this.validateKey(); eval( form.getAttribute("onAltF4") ); }
                     break;
		case F5: 
                     if (form.getAttribute("onAltF5") != null) { this.validateKey(); eval( form.getAttribute("onAltF5") ); }
                     break;
		case F6: 
                     if (form.getAttribute("onAltF6") != null) { this.validateKey(); eval( form.getAttribute("onAltF6") ); }
                     break;
		case F7: 
                     if (form.getAttribute("onAltF7") != null) { this.validateKey(); eval( form.getAttribute("onAltF7") ); }
                     break;
		case F8: 
                     if (form.getAttribute("onAltF8") != null) { this.validateKey(); eval( form.getAttribute("onAltF8") ); }
                     break;
		case F9: 
                     if (form.getAttribute("onAltF9") != null) { this.validateKey(); eval( form.getAttribute("onAltF9") ); }
                     break;
		case F10: 
                     if (form.getAttribute("onAltF10") != null) { this.validateKey(); eval( form.getAttribute("onAltF10") ); }
                     break;
		case F11: 
                     if (form.getAttribute("onAltF11") != null) { this.validateKey(); eval( form.getAttribute("onAltF11") ); }
                     break;
		case F12: 
                     if (form.getAttribute("onAltF12") != null) { this.validateKey(); eval( form.getAttribute("onAltF12") ); }
                     break;
		case ARROW_UP: 
                     if (form.getAttribute("onAltArrowUp") != null) { this.validateKey(); eval( form.getAttribute("onAltArrowUp") ); }
                     break;
		case ARROW_DOWN: 
                     if (form.getAttribute("onAltArrowDown") != null) { this.validateKey(); eval( form.getAttribute("onAltArrowDown") ); }
                     break;
		case ESCAPE: 
                     if (form.getAttribute("onAltEscape") != null) { this.validateKey(); eval( form.getAttribute("onAltEscape") ); }
                     break;
		case PAGE_DOWN: 
                     if (form.getAttribute("onAltPageDown") != null) { this.validateKey(); eval( form.getAttribute("onAltPageDown") ); }
                     break;
		case END: 
                     if (form.getAttribute("onAltEnd") != null) { this.validateKey(); eval( form.getAttribute("onAltEnd") ); }
                     break;
		case HOME: 
                     if (form.getAttribute("onAltHome") != null) { this.validateKey(); eval( form.getAttribute("onAltHome") ); }
                     break;
	 }
       }
       else if (wCtrlKey)
       {
	  switch(wKeyCode)
	  {
		case F1: 
                     if (form.getAttribute("onCtrlF1") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF1") ); }
                     break;
		case F2: 
                     if (form.getAttribute("onCtrlF2") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF2") ); }
                     break;
		case F3: 
                     if (form.getAttribute("onCtrlF3") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF3") ); }
                     break;
		case F4: 
                     if (form.getAttribute("onCtrlF4") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF4") ); }
                     break;
		case F5: 
                     if (form.getAttribute("onCtrlF5") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF5") ); }
                     break;
		case F6: 
                     if (form.getAttribute("onCtrlF6") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF6") ); }
                     break;
		case F7: 
                     if (form.getAttribute("onCtrlF7") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF7") ); }
                     break;
		case F8: 
                     if (form.getAttribute("onCtrlF8") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF8") ); }
                     break;
		case F9: 
                     if (form.getAttribute("onCtrlF9") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF9") ); }
                     break;
		case F10: 
                     if (form.getAttribute("onCtrlF10") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF10") ); }
                     break;
		case F11: 
                     if (form.getAttribute("onCtrlF11") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF11") ); }
                     break;
		case F12: 
                     if (form.getAttribute("onCtrlF12") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF12") ); }
                     break;
		case A: 
                     if (form.getAttribute("onCtrlA") != null) { this.validateKey(); eval( form.getAttribute("onCtrlA") ); }
                     break;
		case B: 
                     if (form.getAttribute("onCtrlB") != null) { this.validateKey(); eval( form.getAttribute("onCtrlB") ); }
                     break;
		case C: 
                     if (form.getAttribute("onCtrlC") != null) { this.validateKey(); eval( form.getAttribute("onCtrlC") ); }
                     break;
		case D: 
                     if (form.getAttribute("onCtrlD") != null) { this.validateKey(); eval( form.getAttribute("onCtrlD") ); }
                     break;
		case E: 
                     if (form.getAttribute("onCtrlE") != null) { this.validateKey(); eval( form.getAttribute("onCtrlE") ); }
                     break;
		case F: 
                     if (form.getAttribute("onCtrlF") != null) { this.validateKey(); eval( form.getAttribute("onCtrlF") ); }
                     break;
		case G: 
                     if (form.getAttribute("onCtrlG") != null) { this.validateKey(); eval( form.getAttribute("onCtrlG") ); }
                     break;
		case H: 
                     if (form.getAttribute("onCtrlH") != null) { this.validateKey(); eval( form.getAttribute("onCtrlH") ); }
                     break;
		case I: 
                     if (form.getAttribute("onCtrlI") != null) { this.validateKey(); eval( form.getAttribute("onCtrlI") ); }
                     break;
		case J: 
                     if (form.getAttribute("onCtrlJ") != null) { this.validateKey(); eval( form.getAttribute("onCtrlJ") ); }
                     break;
		case K: 
                     if (form.getAttribute("onCtrlK") != null) { this.validateKey(); eval( form.getAttribute("onCtrlK") ); }
                     break;
		case L: 
                     if (form.getAttribute("onCtrlL") != null) { this.validateKey(); eval( form.getAttribute("onCtrlL") ); }
                     break;
		case M: 
                     if (form.getAttribute("onCtrlM") != null) { this.validateKey(); eval( form.getAttribute("onCtrlM") ); }
                     break;
		case N: 
                     if (form.getAttribute("onCtrlN") != null) { this.validateKey(); eval( form.getAttribute("onCtrlN") ); }
                     break;
		case O: 
                     if (form.getAttribute("onCtrlO") != null) { this.validateKey(); eval( form.getAttribute("onCtrlO") ); }
                     break;
		case P: 
                     if (form.getAttribute("onCtrlP") != null) { this.validateKey(); eval( form.getAttribute("onCtrlP") ); }
                     break;
		case Q: 
                     if (form.getAttribute("onCtrlQ") != null) { this.validateKey(); eval( form.getAttribute("onCtrlQ") ); }
                     break;
		case R: 
                     if (form.getAttribute("onCtrlR") != null) { this.validateKey(); eval( form.getAttribute("onCtrlR") ); }
                     break;
		case S: 
                     if (form.getAttribute("onCtrlS") != null) { this.validateKey(); eval( form.getAttribute("onCtrlS") ); }
                     break;
		case T: 
                     if (form.getAttribute("onCtrlT") != null) { this.validateKey(); eval( form.getAttribute("onCtrlT") ); }
                     break;
		case U: 
                     if (form.getAttribute("onCtrlU") != null) { this.validateKey(); eval( form.getAttribute("onCtrlU") ); }
                     break;
		case V: 
                     if (form.getAttribute("onCtrlV") != null) { this.validateKey(); eval( form.getAttribute("onCtrlV") ); }
                     break;
		case W: 
                     if (form.getAttribute("onCtrlW") != null) { this.validateKey(); eval( form.getAttribute("onCtrlW") ); }
                     break;
		case X: 
                     if (form.getAttribute("onCtrlX") != null) { this.validateKey(); eval( form.getAttribute("onCtrlX") ); }
                     break;
		case Y: 
                     if (form.getAttribute("onCtrlY") != null) { this.validateKey(); eval( form.getAttribute("onCtrlY") ); }
                     break;
		case Z: 
                     if (form.getAttribute("onCtrlZ") != null) { this.validateKey(); eval( form.getAttribute("onCtrlZ") ); }
                     break;
		case ARROW_UP: 
                     if (form.getAttribute("onCtrlArrowUp") != null) { this.validateKey(); eval( form.getAttribute("onCtrlArrowUp") ); }
                     break;
		case ARROW_DOWN: 
                     if (form.getAttribute("onCtrlArrowDown") != null) { this.validateKey(); eval( form.getAttribute("onCtrlArrowDown") ); }
                     break;
		case ESCAPE: 
                     if (form.getAttribute("onCtrlEscape") != null) { this.validateKey(); eval( form.getAttribute("onCtrlEscape") ); }
                     break;
		case PAGE_DOWN: 
                     if (form.getAttribute("onCtrlPageDown") != null) { this.validateKey(); eval( form.getAttribute("onCtrlPageDown") ); }
                     break;
		case END: 
                     if (form.getAttribute("onCtrlEnd") != null) { this.validateKey(); eval( form.getAttribute("onCtrlEnd") ); }
                     break;
		case HOME: 
                     if (form.getAttribute("onCtrlHome") != null) { this.validateKey(); eval( form.getAttribute("onCtrlHome") ); }
                     break;
	 }
       } 
       else
       {
	  switch(wKeyCode)
	  {
		case F1: 
                     if (form.getAttribute("onF1") != null) { this.validateKey(); eval( form.getAttribute("onF1") ); }
                     break;
		case F2: 
                     if (form.getAttribute("onF2") != null) { this.validateKey(); eval( form.getAttribute("onF2") ); }
                     break;
		case F3: 
                     if (form.getAttribute("onF3") != null) { this.validateKey(); eval( form.getAttribute("onF3") ); }
                     break;
		case F4: 
                     if (form.getAttribute("onF4") != null) { this.validateKey(); eval( form.getAttribute("onF4") ); }
                     break;
		case F5: 
                     if (form.getAttribute("onF5") != null) { this.validateKey(); eval( form.getAttribute("onF5") ); }
                     break;
		case F6: 
                     if (form.getAttribute("onF6") != null) { this.validateKey(); eval( form.getAttribute("onF6") ); }
                     break;
		case F7: 
                     if (form.getAttribute("onF7") != null) { this.validateKey(); eval( form.getAttribute("onF7") ); }
                     break;
		case F8: 
                     if (form.getAttribute("onF8") != null) { this.validateKey(); eval( form.getAttribute("onF8") ); }
                     break;
		case F9: 
                     if (form.getAttribute("onF9") != null) { this.validateKey(); eval( form.getAttribute("onF9") ); }
                     break;
		case F10: 
                     if (form.getAttribute("onF10") != null) { this.validateKey(); eval( form.getAttribute("onF10") ); }
                     break;
		case F11: 
                     if (form.getAttribute("onF11") != null) { this.validateKey(); eval( form.getAttribute("onF11") ); }
                     break;
		case F12: 
                     if (form.getAttribute("onF12") != null) { this.validateKey(); eval( form.getAttribute("onF12") ); }
                     break;
		case ARROW_UP: 
                     if (form.getAttribute("onArrowUp") != null) { this.validateKey(); eval( form.getAttribute("onArrowUp") ); }
                     break;
		case ARROW_DOWN: 
                     if (form.getAttribute("onArrowDown") != null) { this.validateKey(); eval( form.getAttribute("onArrowDown") ); }
                     break;
		case ESCAPE: 
                     if (form.getAttribute("onEscape") != null) { this.validateKey(); eval( form.getAttribute("onEscape") ); }
                     break;
		case PAGE_DOWN: 
                     if (form.getAttribute("onPageDown") != null) { this.validateKey(); eval( form.getAttribute("onPageDown") ); }
                     break;
		case END: 
                     if (form.getAttribute("onEnd") != null) { this.validateKey(); eval( form.getAttribute("onEnd") ); }
                     break;
		case HOME: 
                     if (form.getAttribute("onHome") != null) { this.validateKey(); eval( form.getAttribute("onHome") ); }
                     break;
		case ENTER: 
                     if (form.getAttribute("onEnter") != null) { this.validateKey(); eval( form.getAttribute("onEnter") ); }
                     break;
	 }
      }
    }
    catch (Err)
    {
       // fatalMsg(Err, "js.onKeyUp");
       alert(MSG_0000);
    }    
}

JsFunctions.prototype.validateCase = function (pThis, pEvent)
{
    try
    {
		// Checking if target, selectionStart and selectionEnd exists
        if (pEvent.target == null)
		{
		   return;
		}
		
        if (pEvent.target.selectionStart == null)
		{
		   return;
		}
			
        if (pEvent.target.selectionEnd == null)
		{
		   return;
		}
		
        // Case Restriction validation
        if (pThis.getAttribute("caseRestriction") == "UpperCase")
        {
		   var ss = pEvent.target.selectionStart;
		   var se = pEvent.target.selectionEnd;
		   pEvent.target.value = pEvent.target.value.toUpperCase();
		   pEvent.target.selectionStart = ss;
		   pEvent.target.selectionEnd = se;
        }
        else if (pThis.getAttribute("caseRestriction") == "LowerCase")
        {
		   var ss = pEvent.target.selectionStart;
		   var se = pEvent.target.selectionEnd;
		   pEvent.target.value = pEvent.target.value.toLowerCase();
		   pEvent.target.selectionStart = ss;
		   pEvent.target.selectionEnd = se;
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.validateCase");
    }    
}

JsFunctions.prototype.hasPendingError = function (pThis, pEvent)
{
    try
    {
		var hasException = this.onFocus(pThis);
   
        if (hasException != null && hasException == "exceptionRaised")
        {
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

            return true;
        }

		return false;
    }
    catch (Err)
    {
       fatalMsg(Err, "js.hasPendingError");
    }    
}

JsFunctions.prototype.validateKey = function ()
{
    try
    {
        if (browser.isIE())
        {
           // Fires the onChange ... 
           if (event.srcElement != null && event.srcElement.getAttribute("subFieldOf") != null)
           {
              if (event.srcElement.value != event.srcElement.getAttribute("OriginalValue"))
              {
                 this.onChange(event.srcElement); 
              }
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.validateKey");
    }    
}

JsFunctions.prototype.showBoundPopup = function ()
{
    try
    {
        var wCurrentObject = browser.srcElement;  // Projeto Sercomtel: var wCurrentObject = event.srcElement;
        var wPopupName = wCurrentObject.getAttribute("boundPopup");
    
        if ( wPopupName == null || wPopupName == "" )
        {
            var wLovArray = document.getElementsByTagName("SPAN");
            var wLov;
            var wId = wCurrentObject.id;
        
            wPopupName = null;
        
            for (var i = 0; i < wLovArray.length;  ++i)
            {
                wLov = wLovArray[i];
            
                if(wLov.getAttribute("originalClass") == "DBPopup")
                {
                    if(wId == wLov.getAttribute("masterField"))
                    {
                        wPopupName = wLov.getAttribute("memberOf");
                        break;
                    }
                }
            }
        }

        if (wPopupName != null && wPopupName != "") 
        {
           js.ignoreValidation = true;
           popup.open(wPopupName);
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.showBoundPopup");
    }    
}

JsFunctions.prototype.rollUp = function ()
{
    try
    {
        var wobj = browser.srcElement;   // Projeto Sercomtel: var wobj = event.srcElement;

        if(wobj == null) return;
    
        var wSubFieldOf = wobj.getAttribute("subFieldOf");
        if((wSubFieldOf || "") == "") return;
    
        var wTagName = wobj.tagName;

        if(wTagName == "SELECT" || wTagName == "SELECT-ONE" || wTagName == "TEXTAREA")
        {
            return;
        }
    
        var wPanel = document.getElementById(wSubFieldOf);
        var wParentPanel = document.getElementById(wPanel.getAttribute("subPanelOf"));
        var wPanelOriginalClass;

        if(wParentPanel == null)
        {
            wPanelOriginalClass = wPanel.getAttribute("originalClass");
        }
        else
        {
            wPanelOriginalClass = wParentPanel.getAttribute("originalClass");
        }

        // Single Record Block
        if(wParentPanel == null && wPanel.getAttribute("originalClass") == "DBPanel")
        {
            form_previousRecord();
        }
        // Multi Record Block
        else if(wPanelOriginalClass == "DBCollection")
        {
            var wRegExp = /(\d+)$/;
            var wIndex = parseInt(wRegExp.exec(wobj.id)[1], 10);
        
            // First Record
            if(wIndex == 0)
            {
                var wRecordRowid = document.getElementById(wPanel.id + "_rowid");
                var wRecordStatus = document.getElementById(wPanel.id + "_recordStatus");
            
                if (wRecordRowid.value != "" || wRecordStatus.value != "")
                {
                   form_navigate("ROLLUP");
                }
            }
            else
            {
                var wPreviousIndex = wIndex - 1;
            
                var wNextItem = document.getElementById(wobj.id.replace(wRegExp, wPreviousIndex));

                if(wNextItem != null)
                {
                    js.ignoreValidation = true;
                    setFocus(wNextItem);
                }
            }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.rollUp");
    }    
}

JsFunctions.prototype.rollDown = function ()
{
    try
    {
        var wobj = browser.srcElement;  // Projeto Sercomtel: var wobj = event.srcElement;

        if(wobj == null) return;
        
        var wSubFieldOf = wobj.getAttribute("subFieldOf");
        if((wSubFieldOf || "") == "") return;
        
        var wTagName = wobj.tagName;

        if (wTagName == "SELECT" || wTagName == "SELECT-ONE" || wTagName == "TEXTAREA")
        {
                return;
        }
        
        var wPanel = document.getElementById(wSubFieldOf);
        var wParentPanel = document.getElementById(wPanel.getAttribute("subPanelOf"));
        var wPanelOriginalClass;

        if (wParentPanel == null)
        {
           wPanelOriginalClass = wPanel.getAttribute("originalClass");
        }
        else
        {
           wPanelOriginalClass = wParentPanel.getAttribute("originalClass");
        }

        // Single Record Block
        if (wPanelOriginalClass == "DBPanel")
        {
           form_nextRecord();
        }
        // Multi Record Block
        else if(wPanelOriginalClass == "DBCollection")
        {
           var wRegExp = /(\d+)$/;
           var wIndex = parseInt(wRegExp.exec(wobj.id)[1], 10);
           var wOccurs = parseInt(get(wParentPanel.id + "_occurs"), 10);
           var wNextIndex = wIndex + 1;
                
           // Last Record
           if (wIndex == (wOccurs - 1))
           {
              var wRecordRowid = document.getElementById(wPanel.id + "_rowid");
              var wRecordStatus = document.getElementById(wPanel.id + "_recordStatus");
                        
              if (wRecordRowid.value != "" || wRecordStatus.value != "")
              {
                 form_navigate("ROLLDOWN");
              }
           }
           else
           {
              var wNextItem = document.getElementById(wobj.id.replace(wRegExp, wNextIndex));
              if (wNextItem != null)
              {
                 js.ignoreValidation = true;
                 setFocus(wNextItem);
              }
           }
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.rollDown");
    }    
}

JsFunctions.prototype.onclickForCheckBox = function (pObject)
{
    try
    {
        var wField = getElement( pObject.getAttribute("memberOf") );

        if ( pObject.checked == true )
        {
           wField.value = wField.getAttribute("checkedValue");
        }
        else
        {
           wField.value = wField.getAttribute("uncheckedValue");
        }

        if ( wField.getAttribute("subFieldOf") != null && wField.getAttribute("subFieldOf") != "")
        {
           this.onChange(pObject); 
        }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.onclickForCheckBox");
    }    
}

JsFunctions.prototype.validateRequired = function ()
{
    try
    {
       if (browser.srcElement.getAttribute("required") != "True")
       {
          return;
       }

       if (rTrim(browser.srcElement.value) == "")
       {
          raise(MSG_0001);
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.validateRequired");
    }    
}

JsFunctions.prototype.validateDecimalKeyed = function ()
{
    try
    {
         var wDecimalSeparator; 

       if (browser.srcElement.value == "" || browser.srcElement.value == "0" || (browser.srcElement.readOnly != undefined && browser.srcElement.readOnly == true))
       {
          return;
       }

       if (browser.srcElement.getAttribute("decimalKeyed") == "True")
       {
          wDecimalSeparator = form.getAttribute("decimalSeparator"); // The default decimal separator is dot

         if (wDecimalSeparator == null)
         {
            wDecimalSeparator = ".";
         }     

         if (browser.srcElement.value.indexOf(wDecimalSeparator) == -1)
         {
            raise(MSG_0320); // Decimal separator must be informed
            return;
         }

         var wMaxLength = parseInt( browser.srcElement.getAttribute("maxLength") , 10) - 1;
         var wDecimals = parseInt( browser.srcElement.getAttribute("decimals") , 10);

         var wWord = browser.srcElement.value;
         var wIsValid = false;
         var wIsInt = true;
         var wIsDec = false;
         var wICount = 0;
         var wDCount = 0;

         for (i = 0; i < wWord.length; i++)
         { 
             if ( wWord.charAt(i) == wDecimalSeparator)
             { 
                wIsInt = false;
                wIsDec = true;
                wIsValid = true;
             } 
             
             if ( wWord.charAt(i) >= "0" && wWord.charAt(i) <= "9")
             { 
                if ( wIsInt == true && wWord.charAt(i) > "0")
                {
                   wIsValid = true;
                }

                if (wIsValid == true)
                {
                   if (wIsInt == true)
                   {
                      wICount++;
                   }

                   if (wIsDec == true)
                   {
                      wDCount++;
                   }
                }
             } 
         }

         if ( wICount > (wMaxLength - wDecimals) )
         {
            raise("Numero invalido. Parte inteira maior que o permitido (" + (wMaxLength - wDecimals) + ")");
            return; 
         }   
         if (wDCount > wDecimals)
         {
            raise("Numero invalido. Parte decimal maior que o permitido (" + wDecimals + ")"); 
            return; 
         }   
       }
       else if (browser.srcElement.getAttribute("decimalKeyed") == "False")
       {
          wDecimalSeparator = form.getAttribute("decimalSeparator"); // The default decimal separator is dot

         if (wDecimalSeparator == null)
         {
            wDecimalSeparator = ".";
         }     

         if (browser.srcElement.value.indexOf(wDecimalSeparator) != -1)
         {
            raise(MSG_0321); // Decimal separator must not be informed
         }
       }

    }
    catch (Err)
    {
       fatalMsg(Err, "js.validateDecimalKeyed");
    }    
}


JsFunctions.prototype.validateHighest = function ()
{
    try
    {
       var wHighestValue = browser.srcElement.getAttribute("highestValue");

       if (wHighestValue == null || wHighestValue == "")
       {
          return;
       }

       if ( parseFloat(browser.srcElement.value) > parseFloat(wHighestValue) )
       {
          raise(MSG_0010  + " " + wHighestValue);
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.validateHighest");
    }    
}

JsFunctions.prototype.validateLowest = function ()
{
    try
    {
       var wLowestValue = browser.srcElement.getAttribute("lowestValue");

       if (wLowestValue == null || wLowestValue == "")
       {
          return;
       }

       if ( parseFloat(browser.srcElement.value) < parseFloat(wLowestValue) )
       {
          raise(MSG_0011  + " " + wLowestValue);
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.validateLowest");
    }    
}

JsFunctions.prototype.executeOnValidate = function ()
{
    try
    {
       var wOnValidate = browser.srcElement.getAttribute("onvalidate");

       if (wOnValidate == null || wOnValidate == "")
       {
          return;
       }
      
       var wExpr = /\bthis\b/g;

       eval(wOnValidate.replace(wExpr, "browser.srcElement"));   // Projeto Sercomtel eval(wOnValidate.replace(wExpr, "event.srcElement"));
    }
    catch (Err)
    {
       fatalMsg(Err, "js.executeOnValidate");
    }    
}

JsFunctions.prototype.resetPropagation = function ()
{
    try
    {
		if (event.preventDefault)
		{
			event.preventDefault();
		}
		else
		{
			event.returnValue = false;
		}
		
		if (event.stopPropagation)
		{
			event.stopPropagation();
		}
		else
		{
			event.cancelBubble = true;
		}
    }
    catch (Err)
    {
       fatalMsg(Err, "js.resetPropagation");
    }    
}

JsFunctions.prototype.resetValidate = function ()
{
    try
    {
		if (browser.ignoreValidation == true)
		{
	        browser.ignoreValidation = false;
		    raise_error = false;
		    raise_element = null;
			
			if (event.preventDefault)
			{
				event.preventDefault();
			}
			else
			{
				event.returnValue = false;
			}
			
			if (event.stopPropagation)
			{
				event.stopPropagation();
			}
			else
			{
				event.cancelBubble = true;
			}
			
		    alert("Set validate");
		}
		else
		{
	        browser.ignoreValidation = true;
		    raise_error = false;
		    raise_element = null;
			
			if (event.preventDefault)
			{
				event.preventDefault();
			}
			else
			{
				event.returnValue = false;
			}
			
			if (event.stopPropagation)
			{
				event.stopPropagation();
			}
			else
			{
				event.cancelBubble = true;
			}

		    alert("Reset validate");
		}
		
    }
    catch (Err)
    {
       fatalMsg(Err, "js.executeOnValidate");
    }    
}

JsFunctions.prototype.autoValidate = function (pSrcElement, pToElement)
{
    try
    {
        if ( browser.movingFocus == true )
        {
            return true;
        } 
		
        if ( browser.ignoreValidation == true )
        {
            return true;
        } 

        // if ( browser.isIE() )
        if ( browser.isMSIE )
        {
           browser.srcElement = event.srcElement;
           browser.toElement = event.toElement;
        }

        if ( pToElement != null)
        {
           browser.toElement = pToElement;
        }

		// Begin Miranda 2019_14_02
		if (browser.toElement == null)
		{
		   return;	
		}
		
		if ( pSrcElement != null)
        {
           browser.srcElement = pSrcElement;
        }
		
		// End Miranda 2019_14_02
				
        js_exceptionRaised = false;
		
		// Removido por Miranda em 2019_02_12
		// var wElement;
        // if (this.ignoreValidation == true)
        // {
        //   this.ignoreValidation = false;
        //   return true;
        // }

        if ( browser.isIE() && document.hasFocus() == false )
        {
           return true;
        }

        if (browser.isIE() && browser.toElement == null)
        {   
           return true;
        }

        if ( get("form_mode") == "PrepareQuery" )
        {
           return true;
        }

        if (browser.toElement != null && browser.toElement.getAttribute("validateMode") != null)
        {
           var wValidateMode = browser.toElement.getAttribute("validateMode");

           if (wValidateMode == "Ignore")
           {
              return true;
           }  
           else if (wValidateMode == "Customize")
           {
              return true;
           }  
           else if (wValidateMode == "CheckMaster")
           {
              if (browser.toElement.getAttribute("masterField") != null)
              {
                 if (browser.toElement.getAttribute("masterField") == browser.srcElement.id)
                 {
                    return true;
                 }
              } 
           }  
        } 

        // Validating Required Attribute ...
        this.validateRequired(); 

        if (js_exceptionRaised == true)
        {
           return true;
        }

        // Validating DecimalKeyed Attribute ...
        this.validateDecimalKeyed(); 

        if (js_exceptionRaised == true)
        {
           return true;
        }

        // Validating Highest Attribute ...
        this.validateHighest();

        if (js_exceptionRaised == true)
        {
           return true;
        }

        // Validating Lowest Attribute ...
        this.validateLowest();

        if (js_exceptionRaised == true)
        {
           return true;
        }
			
		// Validating field over sizing ...
		
        this.validateOverSize();

        if (js_exceptionRaised == true)
        {
           return true;
        }

        // Executing onValidate ...
        this.executeOnValidate();

        if (js_exceptionRaised == true)
        {
           return true;
        }

        return false;
    }
    catch (Err)
    {
       fatalMsg(Err, "js.autoValidate");
    }    
}

JsFunctions.prototype.onFocus = function (pControl)
{
    try 
    {
       js_clearElements();

	   if (raise_error == true)
       {
			 if (raise_element != null)
			 {
			    var wControl = document.getElementById(raise_element.id);
				
				if (pControl.id == wControl.id)
				{
		          raise_error = false;
				  raise_element = null;
				  return;
				}
				else
				{
				    var onBlurEvent = pControl.onblur;
				    pControl.onblur = "";
				    setTimeout(function(){
							   wControl.focus();
						       pControl.onblur = onBlurEvent;
						      },0);
							  
				    if(event.preventDefault)
					{
						event.preventDefault();
					}
					else
					{
						event.returnValue = false;
					}
					if(event.stopPropagation)
					{
						event.stopPropagation();
					}
					else
					{
						event.cancelBubble = true;
					}
							
		            raise_error = false;
				    raise_element = null;
							
                    return;
				}
			 }
       }
	   
       // Validating for Chrome and Firefox
       if ( browser.isIE()      == false   &&
            browser.srcElement  != null     && 
            browser.srcElement  != pControl && 
            browser.movingFocus == false   )
       {
          browser.toElement = pControl;

          this.autoValidate(browser.srcElement, browser.toElement);

          if (js_exceptionRaised == true)
          {
             browser.movingFocus = true;

			 var wControl = document.getElementById(browser.srcElement.id);
			 this.resetPropagation();				  
			 wControl.select();
			 this.resetPropagation();				  
			 
			 //var onBlurEvent = pControl.onblur;
			 //pControl.onblur = "";
			 //setTimeout(function(){
			 //		    wControl.focus();
		     //				pControl.onblur = onBlurEvent;
			 // 			},0);
							  
             return "exceptionRaised";
          }
       }

       browser.srcElement = pControl;
       browser.toElement = null;
       browser.movingFocus = false;

       var wActiveControl = getElement("form_activeControl");

       if (wActiveControl == null)
       {
          return; 
       }

       wActiveControl.value = pControl.id;

       var wPanelName = pControl.getAttribute("subFieldOf");
	   
	   if (wPanelName == null && pControl.getAttribute("memberOf") != null)
	   {
	      var wElement = getElement( pControl.getAttribute("memberOf") );
	   	  wPanelName = wElement.getAttribute("subFieldOf");
	   }

       if (wPanelName != null && wPanelName != "")
       {
          js_selectLine(pControl, wPanelName);
       }
    }
    catch (Err)
    {
       fatalMsg(Err, "js.onFocus");
    }    
}

JsFunctions.prototype.focusHandler = function ()
{
    try 
    {
	   /*	
       js_clearElements();

	   if (raise_error == true)
       {
		     browser.movingFocus = true;

 			 if (raise_element != null)
			 {
			    var wControl = document.getElementById(raise_element.id);
				
				setTimeout ( function(){
					    	 wControl.focus();
						     },0);
							  
				if(event.preventDefault)
				{
					event.preventDefault();
				}
				else
				{
					event.returnValue = false;
				}
				
				if(event.stopPropagation)
				{
					event.stopPropagation();
				}
				else
				{
					event.cancelBubble = true;
				}
						
				// raise_error = false;
				// raise_element = null;
						
				return;
			 }
       }
	   */
    }
    catch (Err)
    {
       fatalMsg(Err, "js.focusHandler");
    }  
}

JsFunctions.prototype.onClick = function ()
{
    return false;
}

/* 
 * Stores raised messages associated with a control that failed in
 * 'validateOverSize' check.
 */
JsFunctions.prototype.putOverSizeField = function (pControl, pMsg)
{
	if (pControl == null) return;
	if (!this.overSizeFields) this.overSizeFields = [];
	
	if(pMsg != null 
			&& typeof pMsg != "undefined" 
			&& typeof pMsg.valueOf() == "string" 
			&& pMsg.length > 0)
	{
		this.overSizeFields[pControl] = pMsg;
	}
	else
	{
		delete this.overSizeFields[pControl];
	}
}

/* 
 * If previous raised messages was not handled by user (correcting the field 
 * input), then calling this function will raise them again. 
 */
JsFunctions.prototype.revalidateOverSize = function ()
{
	if (Object.prototype.toString.call( this.overSizeFields ) === '[object Array]') { // this is ECMAScript standard to find the class of an Object
//		if (typeof this.overSizeFields == "array") {                                  // typeof consider arrays as just 'object'
		
		// concatenate raised messages
		var allMsgs;
		for (var iField in this.overSizeFields) {
			if (this.overSizeFields.hasOwnProperty(iField)) {
				var wMsg = this.overSizeFields[iField];
				if (typeof wMsg != "undefined"
						&& typeof wMsg.valueOf() == "string"
						&& wMsg.length > 0) {
					//raise(wMsg);
					allMsgs = (allMsgs || "") + wMsg + "\n";
				}
			}
		}
		
		// raise them again
		if (allMsgs) {
			raise(allMsgs);
			return;
		}
	}
}

JsFunctions.prototype.validateOverSize = function ()
{
    try
    {
		if (browser == null || browser.srcElement == null) {
		    return;	
		}
		
		if ( browser.srcElement.value == "" || 
			 browser.srcElement.value == "0" || 
			 ( browser.srcElement.readOnly != undefined && 
			   browser.srcElement.readOnly == true ) ) 
		{
           return;
        }
		
		var wWord = browser.srcElement.value;
		
		var srcName = browser.srcElement.getAttribute("shortDescription");		
		if (srcName == null || srcName == '') {
			srcName = browser.srcElement.name;
		}
        
		if (browser.srcElement.getAttribute("datatype") && 
			browser.srcElement.getAttribute("datatype") == "Number" && 
			browser.srcElement.value != null) 
		{
	        for (i = 0; i < wWord.length; i++)
	        {
	        	// validate numeric field content
	        	if ( ( wWord.charAt(i) < "0" || "9" < wWord.charAt(i) ) && 
				     ( wWord.charAt(i) != "." && 
					   wWord.charAt(i) != "," && 
					   wWord.charAt(i) != "" ) )
	        	{
	                browser.srcElement.value = "0";
	                raise( wWord + " " + MSG_0200 + " " + srcName );
	    	        return;
	        	}
	        }
		}
		else
		{
			return; // not numeric
		}
		
		// Initialize with 0 if numeric blank field		
//		if (browser.srcElement.getAttribute("datatype") &&
//		    browser.srcElement.getAttribute("datatype")  == "Number" &&
//		    browser.srcElement.value != null && 
//			browser.srcElement.value == "")
//        {	
//	        browser.srcElement.value="0";
//	    }

    	var wDecimalSeparator = form.getAttribute("decimalSeparator"); 
		if (wDecimalSeparator == null) {
            wDecimalSeparator = "."; // The default decimal separator is dot
        }
		
        var wIsDec = false;
        var wIntCount = 0;
        var wDecCount = 0;
		var wPosDecimalPlace = -1;
		var wMaxLength = parseInt( browser.srcElement.getAttribute("maxLength") , 10);
        var wDecimals = parseInt( browser.srcElement.getAttribute("decimals") , 10) || 0; // avoiding 'NaN' case 'decimal' is undefined
		
		// Count only digits, count integer and decimal places entered
        for (i = 0; i < wWord.length; i++) { 
             if ( wWord.charAt(i) == wDecimalSeparator ) { 
                wIsDec = true;
				// Save first decimal place
				if (wPosDecimalPlace == -1) {
				    wPosDecimalPlace = i;
			    }
             } else if ( "0" <= wWord.charAt(i) && wWord.charAt(i) <= "9") {
			     if ( wIsDec ) {
				     wDecCount++;
				 } else { 
  				     wIntCount++;
				 } //if
			 } // if 
        } // for
		
		// Mask handling
		var wMask = browser.srcElement.getAttribute("mask");
		var hasMask = false;
		var wMaskIntCount = 0;
		var wMaskDecCount = 0;
		
		if(typeof wMask != "undefined" &&
           typeof wMask.valueOf() == "string" &&
           wMask.length > 0)
		{
			hasMask = true;
			wIsDec = false;
			for (i = 0; i < wMask.length; i++) { 
				if (!wIsDec && wMask.charAt(i) == ".") { // not parameterized, cause masks are 'hard coded', ex. '###,##9.99'
					wIsDec = true;
				} else if (wMask.charAt(i) == "9" 
						|| wMask.charAt(i) == "#"
						|| wMask.charAt(i) == "0") {
					if (wIsDec) 
						wMaskDecCount++;
					else 
						wMaskIntCount++;
				}
			}
		}
		
		// Limit integer part
		// * if mask is given, it needs to be tested first, as 'maxLength' may count other characters
		if ( (hasMask && wMaskIntCount < wIntCount) || 
			 (wMaxLength - wDecimals) < wIntCount ) {
			var wMsg = wWord + " " + MSG_0322 + " " + srcName;
			this.putOverSizeField(srcName, wMsg);
            raise( wMsg );
            return; 
        } else {
			this.putOverSizeField(srcName, null);
		}
        
		// Limit decimals places
		// * if mask is given, it needs to be tested first, as 'decimals' may count other characters
		if ( (hasMask && wMaskDecCount < wDecCount ) || 
			  wDecimals < wDecCount ) {	
			var wMsg = wWord + " " + MSG_0323 + " " + srcName;
			this.putOverSizeField(srcName, wMsg);
            raise(wMsg);
	        return; 
	    } else {
			this.putOverSizeField(srcName, null);
		}
	}
    catch (Err)
    {
       fatalMsg(Err, "js.validateOverSize");
    }    
}

js = new JsFunctions();   // var js was created inside the InnovationBrowser.js
