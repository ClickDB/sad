// *******************************************************
// Logica para garantir que o HTML esteja 100% carregado antes de executar as logicas javascript.
// Não funciona em algumas versões de Microsoft InternetExplorer
try
{
   document.addEventListener("DOMContentLoaded", function(event) 
   {
       // console.log("DOM fully loaded and parsed");
   });
}
catch (Err)
{
   // Versoes mais antigas de browser não implementa DOMContentLoaded
}
   
// *******************************************************

function Browser () 
{
   try
   {

      this.srcElement = null;
      this.toElement = null;
      this.movingFocus = false;
      this.ignoreValidation = false;
	
	  var wUserAgent = window.navigator.userAgent.toLowerCase();

	  this.isChrome = /\bchrome\b/.test(wUserAgent);
	  this.isFirefox = /\bfirefox\b/.test(wUserAgent);
	  this.isSafari = !this.isChrome && /\bsafari\b/.test(wUserAgent);
	  this.isOpera = /\bopera\b/.test(wUserAgent);
      this.isMSIE = !this.isOpera && /\bmsie\b/.test(wUserAgent);

	  if (this.isChrome == false && this.isFirefox == false && this.isSafari == false && this.isOpera == false)
	  {
          this.isMSIE = true; // 	this.isMSIE = !this.isOpera && /\bmsie\b/.test(wUserAgent);
	  }
   }
   catch (Err)
   {
	  this.isChrome = false;
	  this.isFirefox = false;
	  this.isSafari = false;
	  this.isOpera = false;
      this.isMSIE = true;
   }    
}

Browser.prototype.isIE = function ()
{
   try
   {
        if (document.all)
        {
           return true;
        }
        else
        {
           return false;
        } 
   }
   catch (Err)
   {
      fatalMsg(Err, "browser.isIE");
   }    
}

var browser = new Browser();





// *******************************************************
function LoadingRts () 
{
}

LoadingRts.prototype.goHome = function () { this.preventAll(); }
LoadingRts.prototype.onLoad = function () { this.preventAll(); } 
LoadingRts.prototype.onChange = function (pControl) { this.preventAll(); }
LoadingRts.prototype.onKeyPress = function (pThis, pEvent) { this.preventAll(pEvent); }
LoadingRts.prototype.onPaste = function (pThis, pEvent) { this.preventAll(pEvent); }
LoadingRts.prototype.cancelEvent = function (pEvent) { this.preventAll(pEvent); }
LoadingRts.prototype.resetKeyCode = function (pEvent) { this.preventAll(pEvent); }
LoadingRts.prototype.onKeyDown = function (pEvent) { this.preventAll(pEvent); }
LoadingRts.prototype.onKeyUp = function (pEvent) { this.preventAll(pEvent); }
LoadingRts.prototype.validateKey = function () { this.preventAll(); }
LoadingRts.prototype.showBoundPopup = function () { this.preventAll(); }
LoadingRts.prototype.rollUp = function () { this.preventAll(); }
LoadingRts.prototype.rollDown = function () { this.preventAll(); }
LoadingRts.prototype.onclickForCheckBox = function (pObject) { this.preventAll(); }
LoadingRts.prototype.validateRequired = function () { this.preventAll(); }
LoadingRts.prototype.validateHighest = function () { this.preventAll(); }
LoadingRts.prototype.validateLowest = function () { this.preventAll(); }
LoadingRts.prototype.executeOnValidate = function () { this.preventAll(); }
LoadingRts.prototype.autoValidate = function () { this.preventAll(); }
LoadingRts.prototype.onFocus = function (pControl) { this.preventAll(); }
LoadingRts.prototype.onClick = function (pControl) { this.preventAll(); return true;}

LoadingRts.prototype.preventAll = function (pEvent)
{
   try
   {
       if (pEvent != null)
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

       alert(MSG_0000);
   }
   catch (Err)
   {
      fatalMsg(Err, "browser.isIE");
   }    

}

var js = new LoadingRts();

