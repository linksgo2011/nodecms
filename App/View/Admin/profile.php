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
<tr><td width="100"><?=lang('email')?></td><td><input type="text" name="email" id="email" class="validate input-text" validtip="required,email" value="<?=$view['email']?>"></td></tr>
<tr><td width="100"><?=lang('realname')?></td><td><input type="text" name="realname" id="realname" class="input-text" value="<?=$view['realname']?>"></td></tr>
<tr><td width="100"><?=lang('sex')?></td><td>
<input type="radio" name="sex" value="1" <?php if ($view['sex'] == '1'): ?>checked<?php endif; ?>> <?=lang('male')?>
<input type="radio" name="sex" value="2" <?php if ($view['sex'] == '2'): ?>checked<?php endif; ?>> <?=lang('female')?>
<input type="radio" name="sex" value="0" <?php if ($view['sex'] == '0'||!isset($view['sex'])): ?>checked<?php endif; ?>> <?=lang('secrecy')?>
</td></tr>
<tr><td width="100"><?=lang('tel')?></td><td><input type="text" name="tel" id="tel" class="input-text" value="<?=$view['tel']?>"></td></tr>
<tr><td width="100"><?=lang('mobile')?></td><td><input type="text" name="mobile" id="mobile" class="input-text" value="<?=$view['mobile']?>"></td></tr>
<tr><td width="100"><?=lang('fax')?></td><td><input type="text" name="fax" id="fax" class="input-text" value="<?=$view['fax']?>"></td></tr>
<tr><td width="100"><?=lang('address')?></td><td><input type="text" name="address" id="address" size=60 class="input-text" value="<?=$view['address']?>"></td></tr>
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