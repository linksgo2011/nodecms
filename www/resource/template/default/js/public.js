$(document).ready(function(){
	$(".keful").mouseover(function(){
		$(".keful").hide();
		$(".kefur").show();
	});
	$(".kefucolose").click(function(){
		$(".kefur").hide();
		$(".keful").show();
	});
});

function subGuestBook(url){
	if($("#guestbook").validform('validall')){
		$("#guestbook").attr('action',url);
		$("#guestbook").submit();
	}else{
		return false;
	}
}
/*validform*/
(function($) {
	$.fn.validform = function(type){
		var options = new Array();
		var methods = {
			init:function(){
				var validfields = form.find(".validate").each(function(){
					options.push(this);
					$(this).bind('blur',function(){
						methods.testing(this);
					});
				});
			},
			back:function(form){
				var isvalidok = true;
				var firstobj;
				form.find(".validate").each(function(){
					if(!methods.testing(this)){
						if(isvalidok){
							firstobj = this;
						}
						isvalidok = false;
					}
				});
				if(!isvalidok){
					$('html,body').animate({scrollTop: $(firstobj).prev().offset().top}, 300);
					$(firstobj).focus();
				}
				return isvalidok;
			},
			testing:function(obj){
				var rules = $(obj).attr('validtip');
				var val = $(obj).val();
				var rulearr = rules.split(",");
				var len = rulearr.length;
				var msg = '';
				var isrequire = rules.indexOf("required")>=0?true:false;
				for(var i=0;i<len;i++){
					var rule = rulearr[i].split(":");
					switch(rule[0]){
						case "required":
							msg+=methods.required(obj,val);
							break;
						case "minsize":
							msg+=methods.minsize(val,rule[1],isrequire);
							break;
						case "maxsize":
							msg+=methods.maxsize(val,rule[1],isrequire);
							break;
						case "email":
							msg+=methods.email(val,isrequire);
							break;
						case "equals":
							msg+=methods.equals(val,rule[1]);
						default:
							break;
					}
				}
				if($(obj).prev().hasClass("parentFormformID")){
					$(obj).prev().remove();
				}
				if(msg!=''){
					methods.showmsg(obj,msg);
					return false;
				}else{
					return true;
				}
			},
			required:function(obj,val){
				if(val==''){
					if($(obj).is("input")){
						return lang.validform.required.text+"<br>";
					}else if($(obj).is("select")){
						return lang.validform.required.select+"<br>";
					}else{
						return lang.validform.required.text+"<br>";
					}
				}
				return '';
			},
			minsize:function(val,dlen,isrequire){
				if(val==""&&!isrequire){
					return '';
				}
				var len = val.length;
				if(len<dlen){
					return lang.validform.min.text+dlen+lang.validform.min.text1+"<br>";
				}
				return '';
			},
			maxsize:function(val,dlen,isrequire){
				if(val==""&&!isrequire){
					return '';
				}
				var len = val.length;
				if(len>dlen){
					return lang.validform.max.text+dlen+lang.validform.max.text1+"<br>";
				}
				return '';
			},
			email:function(val,isrequire){
				if(val==""&&!isrequire){
					return '';
				}
				var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
				if(!regex.test(val)){
					return lang.validform.email.text+"<br>";
				}
				return '';
			},
			equals:function(val,equalsid){
				if(val!=$("#"+equalsid).val()){
					return lang.validform.equals.text+"<br>";
				}
				return '';
			},
			showmsg:function(obj,msg){
				var msgcontent = '<div  class="reqformError parentFormformID formError"><div class="formErrorContent">'+msg+'<br /></div><div class="formErrorArrow"><div class="line10"></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div>	<div class="line2"><!-- --></div><div class="line1"><!-- --></div></div></div>';
				$(obj).before(msgcontent);
				var objprev = $(obj).prev();
				objprev.css('margin-top','-'+objprev.height()+'px');
				objprev.css('margin-left',($(obj).width()-20)+'px');
				objprev.bind('click',function(){
					$(this).remove();
				});
			}
		};
		if(!this.is("form")){
			alert(validform.onlyform);
			return false;
		}
		form = this;
		if(type=='validall'){
			return methods.back(form);
		}else{
			methods.init(form);
		}
	};
})(jQuery);

stuHover = function() {
	var cssRule;
	var newSelector;
	for (var i = 0; i < document.styleSheets.length; i++)
		for (var x = 0; x < document.styleSheets[i].rules.length ; x++)
			{
			cssRule = document.styleSheets[i].rules[x];
			if (cssRule.selectorText.indexOf("LI:hover") != -1)
			{
				 newSelector = cssRule.selectorText.replace(/LI:hover/gi, "LI.iehover");
				document.styleSheets[i].addRule(newSelector , cssRule.style.cssText);
			}
		}
	var getElm = document.getElementById("nav").getElementsByTagName("LI");
	for (var i=0; i<getElm.length; i++) {
		getElm[i].onmouseover=function() {
			this.className+=" iehover";
		}
		getElm[i].onmouseout=function() {
			this.className=this.className.replace(new RegExp(" iehover\\b"), "");
		}
	}
}
if (window.attachEvent) window.attachEvent("onload", stuHover);