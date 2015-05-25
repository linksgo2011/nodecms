<?php if($tpl=='list'):?>
	<?php $this->load->view('admin_head.php');?>
	<div id="main_head" class="main_head">
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
	</td></tr>
	</table>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width=30  align="left"><input type="checkbox" onclick="checkAll(this)"></th>
	<th width=40  align="left"><?=lang('id')?></th>
	<th width=200  align=left><?=lang('title')?></th>
	<th width=120  align="left"><?=lang('class')?></th>
	<th align="left"><?=lang('method')?></th>
	<th width=50 align="left"><?=lang('status')?></th>
	<th width=50  align="left"><?=lang('operate')?></th>
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
	<tr><td width="100"><?=lang('parent')?></td><td>
	<select name="parent"><option value="0" <?php if (isset($view['parent'])&&$view['parent'] ==0): ?>selected<?php endif; ?>><?=lang('toppurview')?></option>
	<?php if (isset($parent)): ?>
	<?php foreach ($parent as $item): ?>
	<option value="<?=$item['id']?>" <?php if (isset($view['parent'])&&$view['parent'] ==$item['id']): ?>selected<?php endif; ?>><?=lang('func_'.$item['class'])?></option>
	<?php endforeach; ?>
	<?php endif; ?>
	</select></td></tr>
	<tr><td><?=lang('class')?></td><td><input type="text" name="class" id="class" class="validate input-text" validtip="required"  value="<?=isset($view['class'])?$view['class']:'';?>"></td></tr>
	<tr><td><?=lang('method')?></td><td><textarea rows="3" cols="40" name="method" id="method" class="txtarea"><?=isset($view['method'])?$view['method']:'';?></textarea></td></tr>
	<tr><td><?=lang('status')?></td><td><?=lang('status1')?><input type="radio" name="status" value="1" <?php if(!isset($view['status'])||$view['status']==1){echo 'checked';} ?> /><?=lang('status0')?><input type="radio" name="status" value="0" <?php if(isset($view['status'])&&$view['status']==0){echo 'checked';} ?>  /></td></tr>
	<tr><td><?=lang('order')?></td><td><input type="text" name="listorder" id="listorder" value="<?php if(isset($view['listorder'])){echo $view['listorder'];}else{echo '99';} ?>" class="input-text" value=""></td></tr>
	</table>
	</div>
	</form>
<?php endif;?>