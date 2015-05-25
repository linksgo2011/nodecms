<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?=lang('system_name')?><?=lang('system_version')?> - <?=lang('system_author')?></title>
<style>
body {margin: 0;padding: 0;background:#E2E9EA ;cursor: E-resize;}
</style>
<script type="text/javascript" language="JavaScript">
<!--
function toggleMenu()
{
  frmBody = parent.document.getElementById('frame-body');
  imgArrow = document.getElementById('img');

  if (frmBody.cols == "0, 12, *,12")
  {
    frmBody.cols="150, 12, *,12";
    imgArrow.src = "<?=base_url()?>images/admin_barclose.gif";
  }
  else
  {
    frmBody.cols="0, 12, *,12";
    imgArrow.src = "<?=base_url()?>images/admin_baropen.gif";
  }
}

var orgX = 0;
document.onmousedown = function(e)
{
  var evt = Utils.fixEvent(e);
  orgX = evt.clientX;

  if (Browser.isIE) document.getElementById('tbl').setCapture();
}

document.onmouseup = function(e)
{
  var evt = Utils.fixEvent(e);

  frmBody = parent.document.getElementById('frame-body');
  frmWidth = frmBody.cols.substr(0, frmBody.cols.indexOf(','));
  frmWidth = (parseInt(frmWidth) + (evt.clientX - orgX));

  frmBody.cols = frmWidth + ", 12, *,12";

  if (Browser.isIE) document.releaseCapture();
}

var Browser = new Object();
Browser.isMozilla = (typeof document.implementation != 'undefined') && (typeof document.implementation.createDocument != 'undefined') && (typeof HTMLDocument != 'undefined');
Browser.isIE = window.ActiveXObject ? true : false;
Browser.isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") != - 1);
Browser.isSafari = (navigator.userAgent.toLowerCase().indexOf("safari") != - 1);
Browser.isOpera = (navigator.userAgent.toLowerCase().indexOf("opera") != - 1);

var Utils = new Object();

Utils.fixEvent = function(e)
{
  var evt = (typeof e == "undefined") ? window.event : e;
  return evt;
}
//-->
</script>
</head>
<body onselect="return false;">
<table height="100%" cellspacing="0" cellpadding="0" id="tbl">
  <tr><td style="padding-left:1px;"><a href="javascript:toggleMenu();"><img src="<?=base_url()?>images/admin_barclose.gif" width="11" height="60" id="img" border="0"  /></a></td></tr>
</table>
</body></html>