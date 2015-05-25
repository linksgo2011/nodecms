<?php $this->load->view('admin_head.php');?>
<?php if($tpl=='list'):?>
	<div id="main_head" class="main_head">
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
	<?php if ($this->Purview_model->checkPurviewFunc($tablefunc,'download')): ?><a href="<?=site_aurl($tablefunc.'/download')?>"><?=lang('database_download')?></a><?php endif; ?>
	<?php if ($this->Purview_model->checkPurviewFunc($tablefunc,'upgrade')): ?><a href="<?=site_aurl($tablefunc.'/upgrade')?>"><?=lang('database_upgrade')?></a><?php endif; ?>
	</td></tr>
	</table>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width=30  align="left"><input type="checkbox" onclick="checkAll(this)"></th>
	<th align=left><?=lang('database_table')?></th>
	<th width=100  align=left><?=lang('database_type')?></th>
	<th width=100   align="left"><?=lang('database_rows')?></th>
	<th width=100   align="left"><?=lang('database_data')?></th>
	<th width=100 align="left"><?=lang('database_index')?></th>
	<th width=100  align="left"><?=lang('database_free')?></th>
	</tr>
	</thead>
	</table>
	</div>
	<form name="formlist" id="formlist" action="<?=site_aurl($tablefunc)?>" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
	<div id="main" class="main">
	<table cellSpacing=0 width="100%" class="content_list">
	<tbody id="content_list">
	<?php if (isset($list)): ?>
	<?php $totlesize=0?>
	<?php foreach ($list as $item): ?>
	<tr>
	<td width=30><input type=checkbox name="optid[]" value="<?=$item['Name']?>"></td>
	<td><?=$item['Name']?></td>
	<td width=100><?=$item['Engine']?></td>
	<td width=100><?=$item['Rows']?></td>
	<td width=100><?=byte_format($item['Data_length']);?></td>
	<td width=100><?=byte_format($item['Index_length']);?></td>
	<td width=100><?=byte_format($item['Data_free']);?></td>
	</tr>
	<?php $totlesize+=$item['Data_length']+$item['Index_length'];?>
	<?php endforeach; ?>
	<?php endif; ?>
	</tbody>
	</table>
	</div>
	</form>
	<div class="main_foot">
	<table><tr><td>
	<div class="func"><?php if (isset($funcstr)): ?><?=$funcstr?><?php endif; ?></div>
	</td><td align="right">
	<div class="page"><?php if (isset($pagestr)): ?><?=$pagestr?><?php endif; ?></div>
	</td></tr></table>
	</div>
<?php elseif($tpl=='download'):?>
	<div id="main_head" class="main_head" >
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>"><?=lang('func_'.$tablefunc)?></a>
	<a href="<?=site_aurl($tablefunc.'/download')?>" class="current"><?=lang('database_download')?></a>
	<?php if ($this->Purview_model->checkPurviewFunc($tablefunc,'upgrade')): ?><a href="<?=site_aurl($tablefunc.'/upgrade')?>"><?=lang('database_upgrade')?></a><?php endif; ?>
	</td></tr>
	</table>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width=30  align="left"><input type="checkbox" onclick="checkAll(this)"></th>
	<th align=left><?=lang('filename')?></th>
	<th width=100  align="left"><?=lang('filesize')?></th>
	<th width=150  align="left"><?=lang('backuptime')?></th>
	<th width=50  align="left"><?=lang('operate')?></th>
	</tr>
	</thead>
	</table>
	</div>
	<form name="formlist" id="formlist" action="<?=site_aurl($tablefunc)?>" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
	<div id="main" class="main">
	<table cellSpacing=0 width="100%" class="content_list">
	<tbody id="content_list">
	<?php if (isset($list)): ?>
	<?php foreach ($list as $item): ?>
	<tr id="tid_<?=base64_encode($item['name'])?>">
	<td width=30><input type=checkbox name="optid[]" value="<?=base64_encode($item['name'])?>"></td>
	<td><?=$item['name']?></td>
	<td width="100"><?=byte_format($item['size']);?></td>
	<td width="150"><?=date('Y-m-d H:i:s',$item['date'])?></td>
	<td width="50">
	<a href="<?=site_aurl($tablefunc.'/download/'.base64_encode($item['name']))?>" title='<?=lang('download')?>' class='down'></a>
	<?php if ($isdel): ?>
	<?=$this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del'),'sdel',base64_encode($item['name']))?>
	<?php endif; ?>
	</td>
	</tr>
	<?php endforeach; ?>
	<?php endif; ?>
	</tbody>
	</table>
	</div>
	</form>
	<div id="main_foot" class="main_foot">
	<table>
	<tr><td>
	<div class="func"><?php if (isset($funcstr)): ?><?=$funcstr?><?php endif; ?></div>
	</td></tr>
	</table>
	</div>
<?php elseif($tpl=='upgrade'):?>
	<div id="main_head" class="main_head" style="height:35px;">
	<table>
	<tr><td height="30" class="menu">
	<a href="<?=site_aurl($tablefunc)?>"><?=lang('func_'.$tablefunc)?></a>
	<?php if ($this->Purview_model->checkPurviewFunc($tablefunc,'download')): ?><a href="<?=site_aurl($tablefunc.'/download')?>"><?=lang('database_download')?></a><?php endif; ?>
	<a href="<?=site_aurl($tablefunc.'/upgrade')?>" class="current"><?=lang('database_upgrade')?></a>
	</td></tr>
	</table>
	</div>
	<form name="formview" id="formview" action="" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc.'/upgrade')?>">
	<div id="main" class="main"  style="padding-top:40px;">
	<table cellSpacing=0 width="100%" class="content_view">
	<tr><td width="100"><?=lang('database_sql')?></td>
	<td><textarea name="upgradesql" id="upgradesql"  style="width:600px;height:400px;" class="txtarea validate"  validtip="required"></textarea></td></tr>
	<tr><td width="100"></td><td><div class="func"><?php if (isset($funcstr)): ?><?=$funcstr?><?php endif; ?></div></td></tr>
	</table>
	</div>
	</form>
	<script type="text/javascript">           
	$(document).ready(function(){
		$("#formview").validform();
	});  
	</script>
<?php endif;?>
<?php $this->load->view('admin_foot.php');?>