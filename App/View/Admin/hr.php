<?php if($tpl=='list'):?>
	<?php $this->load->view('admin_head.php');?>
	<div id="main_head" class="main_head">
	<form name="formsearch" id="formsearch" action="<?=site_aurl($tablefunc)?>" method="post">
	<table class="menu">
	<tr><td><a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
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
	<select name="recommend"><option value="0"><?=lang('recommend')?></option>
	<?php foreach($recommendarr as $recommend):?>
	<option value="<?=$recommend['id']?>"<?php if ($search['recommend']==$recommend['id']): ?>selected<?php endif; ?>><?=$recommend['title']?></option>
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
	<th width=80   align="left"><?=lang('hits')?></th>
	<th width=80   align="left"><?=lang('realhits')?></th>
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
	<tr><td><?=lang('category_pselect')?></td>
	<td colspan="4"><select name="category" id="category" class="validate" validtip="required">
	<?php foreach($categoryarr as $category):?>
	<option value="<?=$category['id']?>"<?php if (isset($view['category'])&&$view['category']==$category['id']): ?>selected<?php endif; ?>><?=$category['name']?></option>
	<?php endforeach;?>
	</select></td>
	<td rowspan="4" class="upic">
	<img src="<?=isset($view['thumb'])&&$view['thumb']!=''?get_image_url($view['thumb']):get_image_url('data/nopic8080.gif')?>" onclick="uploadpic(this,'thumb')" width="150" id="imgthumb"><input type="hidden" name="thumb" id="thumb" value="<?=isset($view['thumb'])?$view['thumb']:'';?>"><br><input type="button" class="btn" onclick="unsetThumb('thumb','imgthumb')" value="<?=lang('unsetpic')?>">	
	</td>
	</tr>
	<tr><td><?=lang('title')?></td>
		<td colspan="4"><input type="text" name="title" id="title" size="60" style="color:<?=isset($view['color'])?$view['color']:'';?>" class="validate input-text" validtip="required"  value="<?=isset($view['title'])?$view['title']:'';?>">
			<a  class="selectcolor colorpicker" onclick="colorpicker(this,'color','title')">&nbsp;</a>
			<input type="hidden" name="color" id="color"  value="<?=isset($view['color'])?$view['color']:'';?>">
			<input type="checkbox" id="isbold" name="isbold" <?=isset($view['isbold'])&&$view['isbold']==1?'checked':'';?> value="1"><?=lang('isbold')?>
		</td>
	</tr>
	<tr><td><?=lang('keywords')?></td><td colspan="4"><input type="text" name="keywords" id="keywords" class="input-text" size="60"  value="<?=isset($view['keywords'])?$view['keywords']:'';?>"></td></tr>
	<tr><td><?=lang('description')?></td><td colspan="4"><textarea rows="5" cols="80" class="txtarea" name="description" id="description"><?=isset($view['description'])?$view['description']:'';?></textarea></td></tr>
	<tr><td><?=lang('hr_content')?></td><td colspan="5"><textarea style="width:668px;height:200px;" name="content" id="content" class="editor"><?=isset($view['content'])?htmlspecialchars($view['content']):'';?></textarea></td></tr>
	<tr><td><?=lang('tag')?></td><td colspan="5"><input type="text" name="tags" id="tags" size="80" class="input-text" value="<?=isset($tags)?$tags:'';?>"><?=lang('tagtip')?></td></tr>
	<tr><td><?=lang('recommend')?></td><td colspan="5">
	<?php foreach($recommendarr as $recommend):?>
	<?=$recommend['title']?><input type="checkbox" name="recommends[]" <?php if(in_array($recommend['id'],$recommends)):?>checked<?php endif;?> value="<?=$recommend['id']?>">
	<?php endforeach;?>
	</td>
	
	</tr>
	<tr>
	<td><?=lang('hr_num')?></td>
	<td><input type="text" name="num" id="num" class="input-text" value="<?=isset($view['num'])?$view['num']:'';?>"></td>
	<td><?=lang('hr_city')?></td>
	<td><input type="text" name="city" id="city" class="input-text" value="<?=isset($view['city'])?$view['city']:'';?>"></td>
	<td><?=lang('hr_year')?></td>
	<td><input type="text" name="year" id="year" class="input-text" value="<?=isset($view['year'])?$view['year']:'';?>"></td>
	</tr>
	<tr>
		<td><?=lang('hits')?></td>
		<td><input type="text" name="hits" id="hits"  class="input-text" value="<?=isset($view['hits'])?$view['hits']:0?>"></td>
		<td><?=lang('puttime')?></td>
		<td><input type="text" name="puttime" id="puttime" readOnly onClick="WdatePicker({doubleCalendar:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})"  class="input-text Wdate" value="<?=isset($view['puttime'])?date('Y-m-d H:i:s',$view['puttime']):date('Y-m-d H:i:s')?>"></td>
		<td><?=lang('tpl')?></td>
		<td><input type="text" name="tpl" id="tpl" class="input-text" value="<?=isset($view['tpl'])?$view['tpl']:'';?>"></td>
	</tr>
	<tr>
		<td><?=lang('order')?></td>
		<td><input type="text" name="listorder" id="listorder" value="<?php if(isset($view['listorder'])){echo $view['listorder'];}else{echo '999';} ?>" class="input-text"></td>
		<td><?=lang('status')?></td>
		<td colspan="3"><?=lang('status1')?><input type="radio" name="status" value="1" <?php if(!isset($view['status'])||$view['status']==1){echo 'checked';} ?> /><?=lang('status0')?><input type="radio" name="status" value="0" <?php if(isset($view['status'])&&$view['status']==0){echo 'checked';} ?>  /></td>
	</tr>
	</table>
	</div>
	</form>
<?php endif;?>