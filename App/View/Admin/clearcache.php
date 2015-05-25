<?php $this->load->view('admin_head.php');?>
<div id="main_head" class="main_head" style="height:35px;">
<table class="menu">
<tr><td><a href="<?=site_aurl($tablefunc.'/clear')?>" class="current"><?=lang('func_clearcache')?></a>
<font color="red"><?php if (isset($message)): ?><?=$message?><?php endif; ?></font></td></tr>
</table>
</div>
<?php $this->load->view('admin_foot.php');?>
