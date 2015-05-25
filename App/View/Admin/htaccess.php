<?php $this->load->view('admin_head.php');?>
<div id="main_head" class="main_head" style="height:30px;">
<table class="menu">
<tr><td>
<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
<font color="red"><?=lang('htaccess_tip')?></font>
</td></tr>
</table>
</div>
<form name="formview" id="formview" action="" method="post">
<input type="hidden" name="action" id="action" value="<?=site_aurl('htaccess')?>">
<div id="main" class="main" style="padding-top:35px;">
<table cellSpacing=0 width="100%" class="content_view">
<tr><td width="100"><?=lang('content')?></td><td>
<textarea cols="90" rows="20" name="content" id="content" class="txtarea"><?=isset($content)?$content:'';?></textarea></td></tr>
<tr><td></td><td><?php if (isset($func)): ?><?=$func?><?php endif; ?></td></tr>
</table>
</div>
</form>
<?php $this->load->view('admin_foot.php');?>