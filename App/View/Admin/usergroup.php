<?php if($tpl=='list'):?>
	<?php $this->load->view('admin_head.php');?>
	<div id="main_head" class="main_head" >
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
	</td></tr>
	</table>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width=30  align="left"><input type="checkbox" onclick="checkAll(this)"></th>
	<th width=50  align="left"><?=lang('order')?></th>
	<th width=40  align="left"><?=lang('id')?></th>
	<th width=100  align=left><?=lang('title')?></th>
	<th align=left><?=lang('varname')?></th>
	<th width=50 align="left"><?=lang('status')?></th>
	<th width=80  align="left"><?=lang('operate')?></th>
	</tr>
	</thead>
	</table>
	</div>
	<form name="formlist" id="formlist" action="<?=site_aurl($tablefunc)?>" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
	<div id="main" class="main">
	<table cellSpacing=0 width="100%" class="content_list">
	<tbody id="content_list"><?php if (isset($liststr)): ?><?=$liststr?><?php endif; ?></tbody>
	</table>
	</div>
	</form>
	<div class="main_foot">
	<table><tr><td>
	<div class="func"><?php if (isset($funcstr)): ?><?=$funcstr?><?php endif; ?></div>
	</td></tr></table>
	</div>
	<?php $this->load->view('admin_foot.php');?>
<?php elseif($tpl=='view'):?>
	<form name="formview" id="formview" action="" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
	<input type="hidden" name="id" value="<?=isset($view['id'])?$view['id']:'';?>">
	<div id="main_view" class="main_view">
	<table cellSpacing=0 width="100%" class="content_view">
	<tr><td><?=lang('varname')?></td>
	<td><input type="text" name="varname" id="varname" class="validate input-text" validtip="required" value="<?=isset($view['varname'])?$view['varname']:'';?>"></td></tr>
	<tr><td><?=lang('status')?></td><td><?=lang('status1')?><input type="radio" name="status" value="1" <?php if(!isset($view['status'])||$view['status']==1){echo 'checked';} ?> /><?=lang('status0')?><input type="radio" name="status" value="0" <?php if(isset($view['status'])&&$view['status']==0){echo 'checked';} ?>  /></td></tr>
	<tr><td><?=lang('order')?></td><td><input type="text" name="listorder" id="listorder" value="<?php if(isset($view['listorder'])){echo $view['listorder'];}else{echo '99';} ?>" class="input-text" value=""></td></tr>
	</table>
	</div>
	</form>
<?php elseif($tpl=='grant'):?>
	<form name="formview" id="formview" action="" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>"">
	<input type="hidden" name="id" value="<?=isset($view['id'])?$view['id']:'';?>">
	<div id="main_view" class="main_view">
	<table cellSpacing=0 width="100%" class="content_view">
	<thead>
	<tr>
	<th align="left"><input type="checkbox" onclick="checkAll(this,'purviewid[]')"></th>
	<th align=left><?=lang('class')?></th>
	<th align=left><input type="checkbox" onclick="checkAllMethod(this)"><?=lang('method')?></th>
	</tr>
	</thead>
	<tbody><?php if (isset($liststr)): ?><?=$liststr?><?php endif; ?></tbody>
	</table>
	</div>
	</form>
<?php endif;?>