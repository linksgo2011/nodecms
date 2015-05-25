<?php if($tpl=='list'):?>
	<?php $this->load->view('admin_head.php');?>
	<div id="main_head" class="main_head">
	<form name="formsearch" id="formsearch" action="<?=site_aurl($tablefunc)?>" method="post">
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
	<span><?=lang('filter')?></span><input type="text" name="keyword" value="<?=$search['keyword']?>" class="input-text">
	<select name="searchtype">
	<option value="title" <?php if ($search['searchtype'] == 'title'): ?>selected<?php endif; ?>><?=lang('title')?></option>
	<option value="id" <?php if ($search['searchtype'] == 'id'): ?>selected<?php endif; ?>><?=lang('id')?></option>
	</select>
	<select name="category"><option value="0"><?=lang('category_pselect')?></option>
	<?php foreach($categoryarr as $category):?>
	<option value="<?=$category['id']?>"<?php if ($search['category']==$category['id']): ?>selected<?php endif; ?>><?=$category['name']?></option>
	<?php endforeach;?>
	</select>
	<input type="submit" class="btn" value="<?=lang('search')?>"></td></tr>
	</table>
	</form>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width=30  align="left"><input type="checkbox" onclick="checkAll(this)"></th>
	<th width=50  align="left"><?=lang('order')?></th>
	<th width=40  align="left"><?=lang('id')?></th>
	<th align=left><?=lang('title')?></th>
	<th width=80  align=left><?=lang('category')?></th>
	<th width=80   align="left"><?=lang('guestbook_author')?></th>
	<th width=120   align="left"><?=lang('guestbook_email')?></th>
	<th width=90   align="left"><?=lang('guestbook_phone')?></th>
	<th width=120   align="left"><?=lang('guestbook_createtime')?></th>
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
	<tr>
		<td><?=lang('title')?></td>
		<td colspan="3"><input type="text" name="title" id="title" size="85" class="validate input-text" validtip="required"  value="<?=isset($view['title'])?$view['title']:'';?>"></td>
	</tr>
	<tr>
		<td width="100"><?=lang('category_pselect')?></td>
		<td><select name="category" id="category" class="validate" validtip="required">
		<?php foreach($categoryarr as $category):?>
		<option value="<?=$category['id']?>"<?php if (isset($view['category'])&&$view['category']==$category['id']): ?>selected<?php endif; ?>><?=$category['name']?></option>
		<?php endforeach;?>
		</select></td>
		<td><?=lang('guestbook_author')?></td>
		<td><input type="text" name="author" id="author" class="validate input-text" validtip="required"  value="<?=isset($view['author'])?$view['author']:'';?>"></td>
	</tr>
	<tr>
		<td><?=lang('guestbook_email')?></td>
		<td><input type="text" name="email" id="email" class="validate input-text" validtip="email"  value="<?=isset($view['email'])?$view['email']:'';?>"></td>
		<td><?=lang('guestbook_phone')?></td>
		<td><input type="text" name="phone" id="phone" class="input-text"  value="<?=isset($view['phone'])?$view['phone']:'';?>"></td>
	</tr>
	<tr>
		<td><?=lang('guestbook_description')?></td>
		<td colspan="3"><textarea rows="5" cols="83" class="txtarea" name="description" id="description"><?=isset($view['description'])?$view['description']:'';?></textarea></td></tr>
	<tr>
		<td><?=lang('guestbook_reply')?></td>
		<td colspan="5"><textarea style="width:668px;height:200px;" name="content" id="content" class="editor"><?=isset($view['content'])?htmlspecialchars($view['content']):'';?></textarea></td></tr>
	<tr>
		<td><?=lang('guestbook_createtime')?></td>
		<td><input type="text" name="createtime" id="createtime" readOnly onClick="WdatePicker({doubleCalendar:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})"  class="input-text Wdate" value="<?=isset($view['createtime'])?date('Y-m-d H:i:s',$view['createtime']):date('Y-m-d H:i:s')?>"></td>
		<td><?=lang('guestbook_replytime')?></td>
		<td><input type="text" name="replytime" id="replytime" readOnly onClick="WdatePicker({doubleCalendar:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})"  class="input-text Wdate" value="<?=isset($view['replytime'])&&$view['replytime']>0?date('Y-m-d H:i:s',$view['replytime']):date('Y-m-d H:i:s')?>"></td>
	</tr>
	<tr>
		<td><?=lang('order')?></td>
		<td><input type="text" name="listorder" id="listorder" value="<?php if(isset($view['listorder'])){echo $view['listorder'];}else{echo '999';} ?>" class="input-text"></td>
		<td><?=lang('status')?></td>
		<td colspan="3"><?=lang('guestbook_status1')?><input type="radio" name="status" value="1" <?php if(!isset($view['status'])||$view['status']==1){echo 'checked';} ?> /><?=lang('guestbook_status0')?><input type="radio" name="status" value="0" <?php if(isset($view['status'])&&$view['status']==0){echo 'checked';} ?>  /></td>
	</tr>
	</table>
	</div>
	</form>
<?php endif;?>