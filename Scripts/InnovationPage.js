// *******************************************************
function Page () 
{
}

Page.prototype.submit = function ()
{
   try
   {
      var wActiveControl = getElement( get("form_activeControl") );

      if ( wActiveControl != null && wActiveControl.getAttribute("onbeforedeactivate") != null)
      {       
         js.autoValidate(wActiveControl, wActiveControl); 
         browser.ignoreValidation = false;
      }
      
      if (js_exceptionRaised == false)
      {
         form_submit();
      }

   }
   catch (Err)
   {
      fatalMsg(Err, "page.submit");
   }    
}

var page = new Page();

