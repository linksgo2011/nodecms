<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3c.org/TR/1999/REC-html401-19991224/loose.dtd">
<html>
<head>
<meta content="text/html; charset=utf-8" http-equiv=Content-Type>
<title><?=lang('system_adminname')?> - Powered by <?=lang('system_name')?> <?=lang('system_version')?></title>
<script type="text/javascript" src="<?=base_url('js/jquery.min.js')?>"></script>
<script type="text/javascript">
function login(){
	var user_name=$.trim($("#user_name").val());
	var user_pass=$.trim($("#user_pass").val());
	$.ajax({
		type: "POST",
		url: "<?=site_aurl('main/login')?>",
		data: "opt=ajax&user_name="+user_name+"&user_pass="+user_pass,
		success: function(msg){
			if(msg=='ok'){
				<?php if (isset($lose)&&$lose==1): ?>
				location.href=document.referrer
				<?php else: ?>
				location.href="<?=site_aurl('main')?>";
				<?php endif; ?>
			}else{
				$("#msgtip").html("<?=lang('name_or_pass_error')?>");
				flashing();
			}
		},
		beforeSend:function(){
			$("#msgtip").html("<?=lang('user_logining')?>");
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			$("#msgtip").html(errorThrown);
			flashing();
		}
	});
}
function flashing(){
	$("#msgtip").hide(200);
	$("#msgtip").show(200);
	$("#msgtip").hide(200);
	$("#msgtip").show(200);
	$("#msgtip").hide(200);
	$("#msgtip").show(200);
}
$(document).keypress(function(e) {
if (e.which == 13)  
	login(); 
});
</script>
<style type="text/css">
*{padding:0;margin:0;}
div{margin:0;padding:0;}
body{background:#efeff1;color:#135891;font-size:14px;font-weight:800;}
#body{width:449px;height:268px;overflow:hidden;background:url(<?=base_url('images/loginbody.gif')?>) no-repeat;margin:150px auto;}
table{margin-top:80px;margin-left:100px;line-height:24px;}
#user_name,#user_pass{width:212px;height:24px;line-height:24px;}
#msgtip{width:200px;height:30px;line-height:30px;color:red;float:left;}
#loginbtn{width:62px;height:28px;float:right;margin-right:15px;text-align:center;line-height:28px;color:#fff;text-decoration:none;background:url(<?=base_url('images/loginbg.gif')?>) no-repeat;}
.footer{color:#9F9F9F;text-align: right;font-size: 11px;line-height: 20px;}
.footer a{color:#7EB4FE;}
</style>
</head>
<body>
<div id="body">
<table border="0">
<tr><td height="60" valign="top" align="right"><?=lang('user_name')?></td><td valign="top" align="left"><input type="text" name="user_name" id="user_name" ></td></tr>
<tr><td height="40" valign="top" align="right"><?=lang('user_pass')?></td><td valign="top" align="left"><input type="password" name="user_pass" id="user_pass" ></td></tr>
<tr><td colspan="2" height="50" valign="top"><span id="msgtip"></span><a href="javascript:void(0)" onclick="login()" id="loginbtn"><?=lang('btn_login')?></a></td></tr>
<tr><td colspan="2" height="20" class="footer"><?=lang('system_copy')?>  Powered by <a href="<?=lang('system_link')?>" target="_blank"><?=lang('system_name')?></a></td></tr>
</table>
</div>
</body>
</html>