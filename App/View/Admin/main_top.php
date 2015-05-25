<?php $this->load->view('admin_head.php');?>
<style>body{height:100%;background:#E2E9EA;}</style>
<div id="main_top">
<div id="header" class="header" >
<table width="100%" height="80" border="0" cellpadding="0" cellspacing="1">
	<tr><td rowspan="2" width="150"><div class="logo"><a href="<?=base_url()?>" target="_blank"><img src="<?=base_url()?>images/x6cms.gif" width=150></a></div></td>
	<td height="40"><div class="nav">&nbsp;&nbsp;&nbsp;&nbsp;<?=lang('welcome')?><?=$username?><i>|</i> [<?=lang($varname)?>]  <i>|</i> [<a href="<?=site_aurl('main/logout')?>" target="_top"><?=lang('logout')?></a>]</div></td>
	<td align="right"><div class="nav">
<a href="<?=base_url()?>" target="_blank"><?=lang('browse_site')?></a>
<i>|</i>
<a href="http://bbs.x6cms.com" target="_blank"><?=lang('x6cms_bbs')?></a>
<i>|</i>
<a href="http://www.x6cms.com/shouce" target="_blank"><?=lang('x6cms_manual')?></a>
 &nbsp;&nbsp;</div></td>
	</tr>
	<tr>
		<td valign="bottom"><div class="topmenu"><ul>
<?php foreach ($list as $key => $item): ?>
<li onClick="setLeft(<?=$item['id']?>);return false;"><span class="topmenufunc" id="topmenufunc_<?=$item['id']?>"><b><?=lang('func_'.$item['class'])?></b></span></li>
<?php endforeach; ?>
</ul></div></td>
		<td align="right"><div class="nav"><?=lang('lang_editing')?>:<select name="editlang" id="editlang" onchange="setLang(this)">
		<?php foreach($langlist as $item):?>
		<option value="<?=$item['varname']?>" <?php if($item['varname']==$editlang):?>selected<?php endif;?>><?=$item['title']?></option>
		<?php endforeach;?>
		</select>&nbsp;&nbsp;</div></td>
	</tr>
</table>
</div>
</div>
<script type="text/javascript">
function setLeft(tid){
	parent.menu.setTab(tid);
	$(".topmenufunc").removeClass('current');
	$("#topmenufunc_"+tid).addClass('current');
}
<?php if(isset($list[0]['id'])):?>
$("#topmenufunc_<?=$list[0]['id']?>").addClass('current');
<?php endif;?>
</script>
<?php $this->load->view('admin_foot.php');?>