<?php if($tpl=='list'):?>
	<?php $this->load->view('admin_head.php');?>
	<div id="main_head" class="main_head" style="height:70px;">
	<form name="formsearch" id="formsearch" action="<?=site_aurl($tablefunc)?>" method="post">
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
	</td></tr>
	</table>
	</form>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width=30  align="left"><input type="checkbox" onclick="checkAll(this)"></th>
	<th width=50  align="left"><?=lang('order')?></th>
	<th width=40  align="left"><?=lang('id')?></th>
	<th width=120  align=left><?=lang('title')?></th>
	<th  align=left><?=lang('lang_varname')?></th>
	<th width=80  align=left><?=lang('lang_icon')?></th>
	<th width=50 align="left"><?=lang('status')?></th>
	<th width=50  align="left"><?=lang('operate')?></th>
	</tr>
	</thead>
	</table>
	</div>
	<form name="formlist" id="formlist" action="<?=site_aurl($tablefunc)?>" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
	<div id="main" class="main" style="padding-top:70px;">
	<table cellSpacing=0 width="100%" class="content_list">
	<tbody id="content_list"><?php if (isset($liststr)): ?><?=$liststr?><?php endif; ?></tbody>
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
	<?php $this->load->view('admin_foot.php');?>
<?php elseif($tpl=='view'):?>
	<form name="formview" id="formview" action="" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
	<input type="hidden" name="id" value="<?=isset($view['id'])?$view['id']:'';?>">
	<div id="main_view" class="main_view">
	<table cellSpacing=0 width="100%" class="content_view">
	<tr><td><?=lang('title')?></td><td><input type="text" name="title" id="title" class="validate input-text" validtip="required" value="<?=isset($view['title'])?$view['title']:''?>"></td></tr>
	<tr><td><?=lang('lang_varname')?></td><td><input type="text" name="varname" id="varname" class="validate input-text" validtip="required" value="<?=isset($view['varname'])?$view['varname']:''?>"></td></tr>
	<tr><td><?=lang('lang_icon')?></td><td><input type="text" name="icon" id="icon"  size="40" class="input-text" value="<?=isset($view['icon'])?$view['icon']:''?>"></td></tr>
	<tr><td><?=lang('status')?></td><td><?=lang('status1')?><input type="radio" name="status" value="1" <?php if(!isset($view['status'])||$view['status']==1){echo 'checked';} ?> /><?=lang('status0')?><input type="radio" name="status" value="0" <?php if(isset($view['status'])&&$view['status']==0){echo 'checked';} ?>  /></td></tr>
	<tr><td><?=lang('order')?></td><td><input type="text" name="listorder" id="listorder" value="<?php if(isset($view['listorder'])){echo $view['listorder'];}else{echo '99';} ?>" class="input-text" ></td></tr>
	</table>
	</div>
	</form>
<?php endif;?>