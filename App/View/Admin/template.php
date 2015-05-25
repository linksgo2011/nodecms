<?php if($tpl=='list'):?>
	<?php $this->load->view('admin_head.php');?>
	<div id="main_head" class="main_head">
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
	<font color="red"><?=lang('template_notice')?></font>
	</td></tr>
	</table>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width="200" align="left"><?=lang('name')?>  <?php if(strlen($folder)>strlen($defaultfolder)):?><a href="javascript:enterdir('')"><font color="green"><?=lang('higherlevel')?></font></a><?php endif;?></th>
	<th align="left"><?=lang('serverpath')?></th>
	<th width=80  align=left><?=lang('filesize')?></th>
	<th width=150   align="left"><?=lang('updated')?></th>
	<th width=60 align="left"><?=lang('permissions')?></th>
	</tr>
	</thead>
	</table>
	</div>
	<form name="formlist" id="formlist" action="<?=site_aurl($tablefunc)?>" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>" />
	<input type="hidden" name="folder" id="folder" value="<?=$folder;?>" />
	<input type="hidden" name="defaultfolder" id="defaultfolder" value="<?=$defaultfolder;?>" />
	<div id="main" class="main">
	<table cellSpacing=0 width="100%" class="content_list">
	<tbody id="content_list">
	<?php foreach($folderlist as $list):?>
	<tr>
	<td width="200"><a href="javascript:enterdir('<?=$list['server_path']?>')" class="folder" ><?=$list['name']?></a></td>
	<td><a href="javascript:enterdir('<?=$list['server_path']?>')"><?=$list['server_path']?></a></td>
	<td width="80">0</td>
	<td width="150"><?=date('Y-m-d H:i:s',$list['date'])?></td>
	<td width="60"><?=$list['permissions']?></td>
	</tr>
	<?php endforeach;?>
	<?php foreach($phplist as $list):?>
	<tr>
	<td width="200"><a href="javascript:editfile('<?=site_aurl('template/editfile')?>','<?=$list['server_path']?>')" class="file" ><?=$list['name']?></a></td>
	<td><a href="javascript:editfile('<?=site_aurl('template/editfile')?>','<?=$list['server_path']?>')"><?=$list['server_path']?></a></td>
	<td width="80"><?=$list['size']?></td>
	<td width="150"><?=date('Y-m-d H:i:s',$list['date'])?></td>
	<td width="60"><?=$list['permissions']?></td>
	</tr>
	<?php endforeach;?>
	<?php foreach($csslist as $list):?>
	<tr>
	<td width="200"><a href="javascript:editfile('<?=site_aurl('template/editfile')?>','<?=$list['server_path']?>')" class="file" ><?=$list['name']?></a></td>
	<td><a href="javascript:editfile('<?=site_aurl('template/editfile')?>','<?=$list['server_path']?>')"><?=$list['server_path']?></a></td>
	<td width="80"><?=$list['size']?></td>
	<td width="150"><?=date('Y-m-d H:i:s',$list['date'])?></td>
	<td width="60"><?=$list['permissions']?></td>
	</tr>
	<?php endforeach;?>
	<?php foreach($jslist as $list):?>
	<tr>
	<td width="200"><a href="javascript:editfile('<?=site_aurl('template/editfile')?>','<?=$list['server_path']?>')" class="file" ><?=$list['name']?></a></td>
	<td><a href="javascript:editfile('<?=site_aurl('template/editfile')?>','<?=$list['server_path']?>')"><?=$list['server_path']?></a></td>
	<td width="80"><?=$list['size']?></td>
	<td width="150"><?=date('Y-m-d H:i:s',$list['date'])?></td>
	<td width="60"><?=$list['permissions']?></td>
	</tr>
	<?php endforeach;?>
	</tbody>
	</table>
	</div>
	</form>
	<?php $this->load->view('admin_foot.php');?>
<?php elseif($tpl=='view'):?>
	<form name="formview" id="formview" action="" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
	<input type="hidden" name="actiontype" value="1">
	<div id="main_view" class="main_view">
	<table cellSpacing=0 width="100%" class="content_view">
	<tr><td width="50"><?=lang('name')?></td><td><input type="text" name="page" id="page" class="input-text" size="80" value="<?=$page?>" readOnly></td></tr>
	<tr><td width="50"><?=lang('content')?></td><td><textarea rows="25" cols="100" name="content" id="content" class="txtarea"><?=isset($content)?htmlspecialchars($content):'';?></textarea></td></tr>
	</table>
	</div>
	</form>
<?php endif;?>