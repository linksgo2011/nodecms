var isdebugging = false;//是否调试JS
var dataType = isdebugging?'text':'json';
function setLang(t){
	var lang = $(t).val();
	var win = $.dialog.top;
	var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
	$.ajax({type: "POST",dataType:dataType,url: win.siteaurl+'/main/setlang',data: 'lang='+lang,
		success: function(data){
			if(data.status==200){
				parent.main.location.reload();
				myDialog.close();
			}else{
				showmsg(myDialog,data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'setLang');
		}
	});
}

function setUrl(t,urlid){
	var val = $(t).val();
	if(val){
		$("#"+urlid).val(val);
	}
}

function submitTo(url,func,extra){
	switch(func){
		case 'add':
			add(url);
			break;
		case 'edit':
			edit(url);
			break;
		case 'del':
			del(url,true);
			break;
		case 'sdel':
			del(url,false,extra);
			break;
		case 'order':
			order(url);
			break;
		case 'grant':
			grant(url);
			break;
		case 'save':
			save(url);
			break;
		case 'backup':
			backup(url);
			break;
		case 'optimize':
			optimize(url);
			break;
		case 'upgrade':
			upgrade(url);
			break;
		case 'restore':
			restore(url);
			break;
		case 'generate':
			generate(url);
			break;
		default:
			break;
	}
}

function setClass(t){
	if($(t).val()==0){
		$("#tclass").show();
	}else{
		$("#tclass").hide();
	}
}

function setTid(t){
	var obj = $(t).children("td").children("input");
	if(obj.attr('checked')=='checked'){
		obj.prop('checked',false);
		$(t).children("td").removeClass('listhover');
	}else{
		obj.prop('checked',true);
		$(t).children("td").addClass('listhover');
	}
}
function checkAll(t,tname){
	tname = tname?tname:'optid[]';
	var tcheck = $(t).is(':checked');
	$("input[name='"+tname+"']").attr('checked',tcheck);
}

function checkAllMethod(t){
	var tcheck = $(t).is(':checked');
	$("input[name*='_method']").attr('checked',tcheck);
}

function gotopage(num){
	$("#currentpage").val(num);
	$('#formpage').attr('action',$("#action").val());
	$('#formpage').submit();
}

function nTabs(t,tid,listid,hover,listclass){
	$(t).parent().children().removeClass(hover);
	$(t).addClass(hover);
	$("."+listclass).hide();
	$("#"+listid+tid).show();
}

function add(url){
	var throughBox = $.dialog.through;
	var myDialog = throughBox({title:lang.add,lock:true});
	$.ajax({type: "POST",url:url,dataType:'json',
	    success: function (data) {
	    	if(data.status==200){
	    		var win = $.dialog.top;
	    		myDialog.content(data.remsg);
	    		win.$("#formview").validform();
	    		var editors = setEditer(win);
	    		setSubBtn(win,myDialog,'add',editors);
	    	}else{
	    		showmsg(myDialog,data);
	    	}
	    },
	    error:function(XMLHttpRequest, textStatus, errorThrown){
	    	debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'add');
		}
	});
}

function edit(url){
	var throughBox = $.dialog.through;
	var myDialog = throughBox({title:lang.edit,lock:true});
	$.ajax({type: "POST",url:url,dataType: 'json',
	    success: function (data) {
	    	if(data.status==200){
	    		var win = $.dialog.top;
	    		myDialog.content(data.remsg);
	    		win.$("#formview").validform();
	    		var editors = setEditer(win);
	    		setSubBtn(win,myDialog,'edit',editors);
	    	}else{
	    		showmsg(myDialog,data);
	    	}
	    },
	    error:function(XMLHttpRequest, textStatus, errorThrown){
	    	debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'edit');
		}
	});
}

function del(url,ismultiple,tid){
	var data;
	$.dialog.confirm(lang.delnotice, function(){
		if(ismultiple){
			data = $("#formlist").find("input:checked").serialize();
		}else{
			data = "optid="+tid;	
		}
		if(data==""){
				 $.dialog.tips(lang.pselect);
				 return;
		}
		this.close();
		var win = $.dialog.top;
		var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
		$.ajax({type: "POST",dataType:"json",url: url,data: data,
			success: function(data){
				if(data.status==200){
					myDialog.close();
					$("#content_list").children().each(function(){
						if($.isArray(data.ids)){
							if($.inArray(this.id.substr(4),data.ids)>=0){
								$(this).remove();	
							}
						}else{
							if(this.id.substr(4)==data.ids){
								$(this).remove();	
							}
						}
					});
					$.dialog.tips(lang.opersuccess);
				}else{
					showmsg(myDialog,data);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'del');
			}
		});
	}, function(){
	    $.dialog.tips(lang.unnotice);
	});
}

function order(url){
	var win = $.dialog.top;
	var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
	var data = $("#formlist").serialize();
	$.ajax({type: "POST",dataType:dataType,url: url,data: data,
		success: function(data){
			if(data.status==200){
				myDialog.close();
				$("#content_list").html(data.remsg);
				$.dialog.tips(lang.opersuccess);
			}else{
				showmsg(myDialog,data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'order');
		}
	});
}

function grant(url){
	var throughBox = $.dialog.through;
	var myDialog = throughBox({title:lang.grant,lock:true});
	$.ajax({type: "POST",url:url,dataType: dataType,
	    success: function (data) {
	    	if(data.status==200){
	    		var win = $.dialog.top;
	    		myDialog.content(data.remsg);
	    		setSubBtn(win,myDialog,'grant',false);
	    	}else{
	    		showmsg(myDialog,data);
	    	}
	    },
	    error:function(XMLHttpRequest, textStatus, errorThrown){
	    	debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'grant');
		}
	});
}


function debugging(tobj,url,XMLHttpRequest,textStatus,errorThrown,jsfunc){
	var msg = '<table class="content_view"><tr><td width="110">Js Function:</td><td>function '+jsfunc+'(){}</td></tr>';
	msg += '<tr><td width="110">URL:</td><td>'+url+'</td></tr>';
	msg += '<tr><td>HTTP Status:</td><td>'+XMLHttpRequest.status+'</td></tr>';
	msg += '<tr><td>readyStatus:</td><td>'+XMLHttpRequest.readyState+'</td></tr>';
	msg += '<tr><td>textStatus:</td><td>'+textStatus+'</td></tr>';
	msg += '<tr><td>errorThrown:</td><td>'+errorThrown+'</td></tr>';
	msg += '<tr><td>help:</td><td>http://bbs.x6cms.com</td></tr>';
	tobj.title('error');
	tobj.content(msg);
}

function setEditer(win){
	if(win.$(".editor").length>0){
		var editors = new Array();
		win.$(".editor").each(function(){
			var idname = this.id;
			var editor=win.KindEditor.create('#'+idname,{
				fileManagerJson:siteaurl+"/main/attrlist",
				uploadJson:siteaurl+"/main/attrupload"	,
				allowFileManager:true
			});
			editors.push(editor);
		});
		return editors;
	}else{
		return false;
	}
}

function setSubBtn(win,tobj,func,editors){
	tobj.button({name:lang.submit,
		callback:function(){
			if(win.$("#formview").validform('validall')){
				if(editors){
	        		var len = editors.length;
	        		for(var i=0;i<len;i++){
	        			editors[i].sync();
	        		}
				}
            	subOK(win,tobj,func);
            }else{
            	
            }
            return false;
		},
		focus: true
	});
}
function subOK(win,tobj,type){
	var data = win.$("#formview").serialize();
	var url = win.$("#formview").find("#action").val()+'/'+type;
	var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
	$.ajax({type: "POST",dataType:dataType,url: url,data: data,
		success: function(data){
			if(data.status==200){
				if(type=='add'){
					$("#content_list").prepend(data.remsg);
					$('html,body').animate({scrollTop: 0}, 300);
				}else if(type=='edit'){
					var thisline = $("#content_list").find("#tid_"+data.id);
					thisline.before(data.remsg);
					thisline.remove();
				}
				myDialog.close();
				tobj.close();
				$.dialog.tips(lang.opersuccess);
			}else{
				showmsg(myDialog,data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'subOK');
		}
	});
}

function backup(url){
	var win = $.dialog.top;
	var data = $("#formlist").serialize();
	var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
	$.ajax({type: "POST",dataType:dataType,url: url,data: data,
		success: function(data){
			if(data.status==200){
				myDialog.close();
				$.dialog.tips(lang.opersuccess);
			}else{
				showmsg(myDialog,data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'backup');
		}
	});
}

function optimize(url){
	var win = $.dialog.top;
	var data = $("#formlist").serialize();
	var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
	$.ajax({type: "POST",dataType:dataType,url: url,data: data,
		success: function(data){
			if(data.status==200){
				myDialog.close();
				$.dialog.tips(lang.opersuccess);
			}else{
				showmsg(myDialog,data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'optimize');
		}
	});
}

function upgrade(url){
	if($("#formview").validform('validall')){
		var win = $.dialog.top;
		var data = $("#formview").serialize();
		var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
		$.ajax({type: "POST",dataType:dataType,url: url,data: data,
			success: function(data){
				if(data.status==200){
					myDialog.close();
					$.dialog.tips(lang.opersuccess);
				}else{
					showmsg(myDialog,data);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'upgrade');
			}
		});
	}
}

function restore(url){
	if($("#formview").validform('validall')){
		var win = $.dialog.top;
		var data = $("#formview").serialize();
		var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
		$.ajax({type: "POST",dataType:dataType,url: url,data: data,
			success: function(data){
				if(data.status==200){
					myDialog.close();
					$.dialog.tips(lang.opersuccess);
				}else{
					showmsg(myDialog,data);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'restore');
			}
		});
	}
}

function generate(url){
	if($("#formview").validform('validall')){
		var win = $.dialog.top;
		var data = $("#formview").serialize();
		var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
		$.ajax({type: "POST",dataType:dataType,url: url,data: data,
			success: function(data){
				if(data.status==200){
					myDialog.close();
					$.dialog.tips(lang.opersuccess);
				}else{
					showmsg(myDialog,data);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'generate');
			}
		});
	}
}

function save(url){
	if($("#formview").validform('validall')){
		var win = $.dialog.top;
		var data = $("#formview").serialize();
		var myDialog = win.$.dialog({fixed:true,lock:true,drag:false});
		$.ajax({type: "POST",dataType:dataType,url: url,data: data,
			success: function(data){
				if(data.status==200){
					myDialog.close();
					$.dialog.tips(lang.opersuccess);
				}else{
					showmsg(myDialog,data);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'save');
			}
		});
	}
}

function shouquan(url){
	$.dialog({title:lang.edit,lock:true,
		content:lang.loading,
		init:function(){
			var thisobj = this;
			$.ajax({type: "POST",url: url,dataType:'json',
				success: function(data){
					if(data.status==200){
						thisobj.content(data.remsg);
				        thisobj.button({
				        	name:lang.submit,
					        callback: function () {
					            	subOK(thisobj,'shouquan');
					            return false;
					        },
					        focus: true
					    });
			      	}else{
			      		thisobj.close();
			      		showmsg(data);
			      	}
				}
			});
		}
	});
}



function audit(url,ismultiple,tid){
	var data;
	$.dialog.confirm(lang.auditnotice, function(){
		if(ismultiple){
			data = $("#formlist").find("input:checked").serialize();
		}else{
			data = "optid="+tid;	
		}
		if(data==""){
				 $.dialog.tips(lang.pselect);
				 return;
		}
		$.dialog({title:lang.audit,lock:true,
		content:lang.loading,
		init:function(){
			var thisobj = this;
			$.ajax({
				type: "POST",
				url: url,
				dataType: dataType,
				data: data,
				success: function(data){
					if(data.status==200){
				       thisobj.close();
				       	$("#content_list").children().each(function(){
							if(this.id.substr(4)==data.id){
								$(this).before(data.remsg);
								$(this).remove();
							}
						});
				    	$.dialog.tips(lang.opersuccess);
			      	}else{
			      		thisobj.close();
			      		showmsg(data);
			      	}
				}
			});
		}
	});
	}, function(){
	    $.dialog.tips(lang.unnotice);
	});
}

function editfile(url,page){
	var win = $.dialog.top;
	win.$.dialog({title:lang.edit,lock:true,
		content:lang.loading,
		init:function(){
			var thisobj = this;
			$.ajax({
				type: "POST",
				url: url,
				data:"actiontype=0&page="+page,
				dataType: dataType,
				success: function(data){
					if(data.status==200){
						thisobj.content(data.remsg);
				        thisobj.button({
				        	name:lang.submit,
					        callback: function () {
					        	subOK(win,thisobj,'editfile');
					            return false;
					        },
					        focus: true
					    });
			      	}else{
			      		thisobj.close();
			      		showmsg(data);
			      	}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(errorThrown);
				}
			});
		}
	});
}

function unsetThumb(objid,imgobjid){
	var win = $.dialog.top;
	win.$("#"+objid).val('');
	win.$("#"+imgobjid).attr('src',win.baseurl+'data/nopic8080.gif');
}
/*
 * status
 * 200	正常
 * 201:(登录失效)
 * 202:(无权限)
 * 203:(请选择记录)
 * 204:(用户名或密码错误)
 * 205:(提交成功，需刷新本页面)
 * 206:(记录重复)
 * 207:(提交成功，但是验证失败，弹出错误消息)
 * 301:提交成功，需要跳转页面
 * 404:该页不存在;
 */
function showmsg(tobj,data){
	if(isdebugging){
		alert(data);return;
	}
	if(data.status==201){
		tobj.close();
		showajaxlogin();
	}else if(data.status==202){
		tobj.close();
		$.dialog.tips(lang.nopurivew);
	}else if(data.status==203){
		tobj.close();
		$.dialog.tips(lang.pselect);
	}else if(data.status==204){
		tobj.close();
		$.dialog.tips(lang.userorpasserror);
	}else if(data.status==205){
		tobj.close();
		location.reload();
	}else if(data.status==206){
		tobj.close();
		$.dialog.tips(lang.duplicate);
	}else if(data.status==207){
		tobj.close();
		$.dialog.tips(data.remsg);
	}else if(data.status==301){
		tobj.close();
		location.href=data.reurl;
	}else if(data.status==404){
		tobj.close();
		$.dialog.tips(lang.notfound);
	}else{
		tobj.close();
		$.dialog.tips(data.remsg);
	}
}
function showajaxlogin(){
	$.dialog({title:lang.login,lock:true,
		content:lang.loading,
		init:function(){
			var thisobj = this;
			$.ajax({
				type: "GET",
				url: siteaurl+'/login/ajaxlogin',
				dataType: dataType,
				cache:false,
				success: function(data){
					if(data.status==200){
						thisobj.content(data.remsg);
						thisobj.button({
					        	name:lang.login,
						        callback: function () {
						        	var postdata = $("#ajaxlogin").serialize();
						        	$.ajax({
						        		type: "POST",
											url: siteaurl+'/main/ajaxlogin',
											dataType: dataType,
											data:postdata,
											cache:false,
											success:function(data){
												if(data.status==200){
													thisobj.close();
													$.dialog.tips(lang.opersuccess);
												}else{
														showmsg(data);
												}
											}
						        	});
						            return false;
						        },
						        focus: true
						    });
			      	}else{
			      		thisobj.close();
			      		showmsg(data);
			      	}
				}
			});
		}
	});
}

function uploadpic(t,picid){
	var editor = KindEditor.editor({
		fileManagerJson:siteaurl+"/main/attrlist",
		uploadJson:siteaurl+"/main/attrupload",
		allowFileManager : true
	});
	editor.loadPlugin('image', function() {
		editor.plugin.imageDialog({
			imageUrl : KindEditor('#'+picid).val(),
				clickFn : function(url, title, width, height, border, align) {
					newurl = url.substr(url.indexOf("data"));
					$('#'+picid).val(newurl);
					if(t){
						$(t).attr('src',url);
					}
					editor.hideDialog();
				}
			});
	});
}
function uploadfile(fileid,filename){
	var editor = KindEditor.editor({
		fileManagerJson:siteaurl+"/main/attrlist",
		uploadJson:siteaurl+"/main/attrupload",
		allowFileManager : true
	});
	editor.loadPlugin('insertfile', function() {
		editor.plugin.fileDialog({
			fileUrl : KindEditor('#'+fileid).val(),
			clickFn : function(url,title) {
				if($.trim(title)==url){
					title='';
				}
				newurl = url.substr(url.indexOf("data"));
				$('#'+fileid).val(newurl);
				if(filename!=''){
					$('#'+filename).val(title);
				}
				editor.hideDialog();
			}
		});
	});
}

function colorpicker(t,colorid,textid){
	var colorarr = new Array("#000000","#000000","#000000","#000000","#003300","#006600","#009900","#00cc00","#00ff00","#330000","#333300","#336600","#339900","#33cc00","#33ff00","#660000","#663300","#666600","#669900","#66cc00","#66ff00","#000000","#333333","#000000","#000033","#003333","#006633","#009933","#00cc33","#00ff33","#330033","#333333","#336633","#339933","#33cc33","#33ff33","#660033","#663333","#666633","#669933","#66cc33","#66ff33","#000000","#666666","#000000","#000066","#003366","#006666","#009966","#00cc66","#00ff66","#330066","#333366","#336666","#339966","#33cc66","#33ff66","#660066","#663366","#666666","#669966","#66cc66","#66ff66","#000000","#999999","#000000","#000099","#003399","#006699","#009999","#00cc99","#00ff99","#330099","#333399","#336699","#339999","#33cc99","#33ff99","#660099","#663399","#666699","#669999","#66cc99","#66ff99","#000000","#cccccc","#000000","#0000cc","#0033cc","#0066cc","#0099cc","#00cccc","#00ffcc","#3300cc","#3333cc","#3366cc","#3399cc","#33cccc","#33ffcc","#6600cc","#6633cc","#6666cc","#6699cc","#66cccc","#66ffcc","#000000","#ffffff","#000000","#0000ff","#0033ff","#0066ff","#0099ff","#00ccff","#00ffff","#3300ff","#3333ff","#3366ff","#3399ff","#33ccff","#33ffff","#6600ff","#6633ff","#6666ff","#6699ff","#66ccff","#66ffff","#000000","#ff0000","#000000","#990000","#993300","#996600","#999900","#99cc00","#99ff00","#cc0000","#cc3300","#cc6600","#cc9900","#cccc00","#ccff00","#ff0000","#ff3300","#ff6600","#ff9900","#ffcc00","#ffff00","#000000","#00ff00","#000000","#990033","#993333","#996633","#999933","#99cc33","#99ff33","#cc0033","#cc3333","#cc6633","#cc9933","#cccc33","#ccff33","#ff0033","#ff3333","#ff6633","#ff9933","#ffcc33","#ffff33","#000000","#0000ff","#000000","#990066","#993366","#996666","#999966","#99cc66","#99ff66","#cc0066","#cc3366","#cc6666","#cc9966","#cccc66","#ccff66","#ff0066","#ff3366","#ff6666","#ff9966","#ffcc66","#ffff66","#000000","#ffff00","#000000","#990099","#993399","#996699","#999999","#99cc99","#99ff99","#cc0099","#cc3399","#cc6699","#cc9999","#cccc99","#ccff99","#ff0099","#ff3399","#ff6699","#ff9999","#ffcc99","#ffff99","#000000","#00ffff","#000000","#9900cc","#9933cc","#9966cc","#9999cc","#99cccc","#99ffcc","#cc00cc","#cc33cc","#cc66cc","#cc99cc","#cccccc","#ccffcc","#ff00cc","#ff33cc","#ff66cc","#ff99cc","#ffcccc","#ffffcc","#000000","#ff00ff","#000000","#9900ff","#9933ff","#9966ff","#9999ff","#99ccff","#99ffff","#cc00ff","#cc33ff","#cc66ff","#cc99ff","#ccccff","#ccffff","#ff00ff","#ff33ff","#ff66ff","#ff99ff","#ffccff","#ffffff");
	var len = colorarr.length;
	var colorstr = '<table class="colorpicker" border="0"><tr><td colspan="21" height="22" class="currentColor"></td></tr><tr>';
	for(var i=0;i<len;i++){
		if(i==21||i==42||i==63||i==84||i==105||i==126||i==147||i==168||i==189||i==210||i==231){
			colorstr+="</tr><tr>"
		}
		colorstr+='<td style="background-color: '+colorarr[i]+';" width="11" height="11" rel="'+colorarr[i]+'" onMouseOver="colorover(this)" onclick="colorclick(this,\''+colorid+'\',\''+textid+'\')"></td>';
	}
	colorstr +='</tr></table>'
	$.dialog({id:'colorpicker',follow:t,title:lang.colorpicker,drag: false,resize: false,padding:'0 0',lock: true,opacity: 0,content: colorstr,button: [{name:lang.clearcolor,callback: function () {$("#"+colorid).val('');$("#"+textid).css('color','');}}]});
}

function colorover(t){
	var color=$(t).attr('rel');
	$(t).parent().parent().find(".currentColor").css('background-color',color);
}

function colorclick(t,colorid,textid){
	var color=$(t).attr('rel');
	$(t).parent().parent().find(".currentColor").css('background-color',color);
	$("#"+colorid).val(color);
	if(textid){
		$("#"+textid).css('color',color);
	}
	$.dialog({id:'colorpicker'}).close();
}

function enterdir(folder){
	if(folder==''){
		var folder = $("#folder").val();
		var s = folder.lastIndexOf("/");
		var folder = folder.substr(0,s);
	}
	$("#folder").val(folder);
	$("#formlist").submit();
}



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
