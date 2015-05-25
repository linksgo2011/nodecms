<?php if($tpl=='list'):?>
	<?php $this->load->view('admin_head.php');?>
	<div id="main_head" class="main_head">
	<form name="formsearch" id="formsearch" action="<?=site_aurl($tablefunc)?>" method="post">
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
	<span><?=lang('filter')?></span><input type="text" name="keyword" value="<?=$search['keyword']?>" class="input-text">
	<select name="searchtype">
	<option value="username" <?php if ($search['searchtype'] == 'username'): ?>selected<?php endif; ?>><?=lang('user_name')?></option>
	<option value="email" <?php if ($search['searchtype'] == 'email'): ?>selected<?php endif; ?>><?=lang('email')?></option>
	<option value="id" <?php if ($search['searchtype'] == 'id'): ?>selected<?php endif; ?>><?=lang('id')?></option>
	</select>
	<select name="usergroup"><option><?=lang('func_usergroup')?></option>
	<?php foreach ($usergroup as $item): ?>
	<option value="<?=$item['id']?>" <?php if ($item['id'] == $search['usergroup']): ?>selected<?php endif; ?>><?=lang($item['varname'])?></option>
	<?php endforeach; ?>
	</select>
	<input type="submit" class="btn" value="<?=lang('search')?>"></td></tr>
	</table>
	</form>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width=30  align="left"><input type="checkbox" onclick="checkAll(this)"></th>
	<th width=40  align="left"><?=lang('id')?></th>
	<th width=80  align=left><?=lang('user_name')?></th>
	<th width=120  align=left><?=lang('email')?></th>
	<th width=80  align=left><?=lang('realname')?></th>
	<th align="left"><?=lang('mobile')?></th>
	<th width=120  align=left><?=lang('regtime')?></th>
	<th width=120  align=left><?=lang('lasttime')?></th>
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
	<tr><td width="100"><?=lang('func_usergroup')?></td>
	<td><select name="usergroup" id="usergroup" class="validate" validtip="required"><option value=""><?=lang('func_usergroup')?></option>
	<?php if (isset($usergroup)): ?>
	<?php foreach ($usergroup as $item): ?>
	<option value="<?=$item['id']?>" <?php if (isset($view['usergroup'])&&$item['id'] == $view['usergroup']): ?>selected<?php endif; ?> <?php if (isset($view['id'])&&$view['id']==1&&$item['id']!=1): ?>disabled<?php endif; ?> ><?=lang($item['varname'])?></option>
	<?php endforeach; ?>
	<?php endif; ?>
	</select></td></tr>
	<tr><td><?=lang('user_name')?></td><td><input type="text" name="username" id="username" class="validate input-text" validtip="required" value="<?=isset($view['username'])?$view['username']:''?>"></td></tr>
	<tr><td><?=lang('password')?></td><td><input type="password" name="password" id="password" class="validate input-text" validtip="<? if(!isset($view['id'])){echo 'required,';}?>minsize:6" value=""></td></tr>
	<tr><td><?=lang('email')?></td><td><input type="text" name="email" id="email" class="validate input-text" validtip="email" value="<?=isset($view['email'])?$view['email']:''?>"></td></tr>
	<tr><td><?=lang('realname')?></td><td><input type="text" name="realname" id="realname" class="input-text" value="<?=isset($view['realname'])?$view['realname']:''?>"></td></tr>
	<tr><td><?=lang('sex')?></td><td>
	<input type="radio" name="sex" value="1" <?php if (isset($view['sex'])&&$view['sex'] == '1'): ?>checked<?php endif; ?>> <?=lang('male')?>
	<input type="radio" name="sex" value="2" <?php if (isset($view['sex'])&&$view['sex'] == '2'): ?>checked<?php endif; ?>> <?=lang('female')?>
	<input type="radio" name="sex" value="0" <?php if (!isset($view['sex'])||(isset($view['sex'])&&$view['sex'] == '0')): ?>checked<?php endif; ?>> <?=lang('secrecy')?>
	</td></tr>
	<tr><td><?=lang('tel')?></td><td><input type="text" name="tel" id="tel" class="input-text" value="<?=isset($view['tel'])?$view['tel']:''?>"></td></tr>
	<tr><td><?=lang('mobile')?></td><td><input type="text" name="mobile" id="mobile" class="input-text" value="<?=isset($view['mobile'])?$view['mobile']:''?>"></td></tr>
	<tr><td><?=lang('fax')?></td><td><input type="text" name="fax" id="fax" class="input-text" value="<?=isset($view['fax'])?$view['fax']:''?>"></td></tr>
	<tr><td><?=lang('address')?></td><td><input type="text" name="address" id="address" size=60 class="input-text" value="<?=isset($view['address'])?$view['address']:''?>"></td></tr>
	<tr><td><?=lang('status')?></td><td><?=lang('status1')?><input type="radio" name="status" value="1" <?php if(!isset($view['status'])||$view['status']==1){echo 'checked';} ?> /><?=lang('status0')?><input type="radio" name="status" value="0" <?php if(isset($view['status'])&&$view['status']==0){echo 'checked';} ?>  /></td></tr>
	</table>
	</div>
	</form>
<?php endif;?>