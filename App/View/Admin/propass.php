<?php $this->load->view('admin_head.php');?>
<div id="main_head" class="main_head" style="height:35px;">
<table class="menu">
<tr><td>
<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
</td></tr>
</table>
</div>
<form name="formview" id="formview" action="" method="post">
<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
<div id="main" class="main" style="padding-top:35px;">
<table cellSpacing=0 width="100%" class="content_view">
<tr><td width="100"><?=lang('user_name')?></td><td><?=$view['username']?></td></tr>
<tr><td><?=lang('user_oldpass')?></td><td><input type="password" name="oldpassword" id="oldpassword" class="validate input-text" validtip="required" value=""></td></tr>
<tr><td><?=lang('user_newpass')?></td><td><input type="password" name="password" id="password" class="validate input-text" validtip="required,minsize:6" value=""></td></tr>
<tr><td><?=lang('user_confirmpass')?></td><td><input type="password" name="password1" id="password1" class="validate input-text" validtip="equals:password" value=""></td></tr>
<tr><td></td><td><?php if (isset($func)): ?><?=$func?><?php endif; ?></td></tr>
</table>
</div>
</form>
<script type="text/javascript">           
$(document).ready(function(){
	$("#formview").validform();
});  
</script>
<?php $this->load->view('admin_foot.php');?>