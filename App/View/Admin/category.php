<?php if($tpl=='list'):?>
	<?php $this->load->view('admin_head.php');?>
	<div id="main_head" class="main_head" style="height:70px;">
	<table class="menu">
	<tr><td>
	<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
	</td></tr>
	</table>
	<table cellSpacing=0 width="100%" class="content_list"><thead>
	<tr>
	<th width=40  align="left"><?=lang('id')?></th>
	<th  align=left><?=lang('title')?></th>
	<th width=150  align="left"><?=lang('category_model')?></th>
	<th width=150 align="left"><?=lang('category_dir')?></th>
	<th width=80 align="left"><?=lang('category_isnavigation')?></th>
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
	<div class="main_foot">
	<table><tr><td><div class="func"><?php if (isset($funcstr)): ?><?=$funcstr?><?php endif; ?></div></td></tr></table>
	</div>
	</form>
	<?php $this->load->view('admin_foot.php');?>
<?php elseif($tpl=='view'):?>
	<link rel="stylesheet" href="<?=base_url('js/kindeditor/themes/default/default.css')?>" />
	<form name="formview" id="formview" action="" method="post">
	<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
	<input type="hidden" name="id" value="<?=isset($view['id'])?$view['id']:'';?>">
	<div id="main_view" class="main_view" >
	<table cellSpacing=0 width="100%" class="content_view">
	<tr>
		<td><?=lang('category_name')?></td>
		<td><input type="text" name="name" id="name" class="validate input-text"  style="color:<?=isset($view['color'])?$view['color']:'';?>;" validtip="required" value="<?=isset($view['name'])?$view['name']:'';?>">
				<a class="selectcolor colorpicker" onclick="colorpicker(this,'color','name')">&nbsp;</a>
				<input type="hidden" name="color" id="color"  value="<?=isset($view['color'])?$view['color']:'';?>">
		</td>
		<td><?=lang('category_isexternal')?></td>
		<td><?=lang('yes')?><input type="radio" name="isexternal" value="1" <?php if(isset($view['isexternal'])&&$view['isexternal']==1){echo 'checked';} ?> onclick="$('#externalurltr').show();" /><?=lang('no')?><input type="radio" name="isexternal" value="0" <?php if(!isset($view['isexternal'])||$view['isexternal']==0){echo 'checked';} ?>  onclick="$('#externalurltr').hide();"  /></td>
		<td rowspan="6" class="upic" valign="top">
		<img src="<?=isset($view['thumb'])&&$view['thumb']!=''?get_image_url($view['thumb']):get_image_url('data/nopic8080.gif')?>" onclick="uploadpic(this,'thumb')" width="150" id="imgthumb"><input type="hidden" name="thumb" id="thumb" value="<?=isset($view['thumb'])?$view['thumb']:'';?>"><br><input type="button" class="btn" onclick="unsetThumb('thumb','imgthumb')" value="<?=lang('unsetpic')?>">	
		</td>
	</tr>
	<tr <?php if(!isset($view['isexternal'])||$view['isexternal']==0):?>style="display:none;"<?php endif;?> id="externalurltr"><td><?=lang('category_externalurl')?></td><td colspan="3"><input type="text" name="externalurl" id="externalurl" size="80" class="input-text" value="<?=isset($view['externalurl'])?$view['externalurl']:'';?>"></td>
	<tr>
		<td><?=lang('category_dir')?></td>
		<td><input type="text" name="dir" id="dir" class="validate input-text" validtip="required" value="<?=isset($view['dir'])?$view['dir']:'';?>"></td>
		<td><?=lang('category_target')?></td>
		<td><?=lang('category_self')?><input type="radio" name="target" value="_self" <?php if(!isset($view['target'])||$view['target']=='_self'){echo 'checked';} ?> /><?=lang('category_blank')?><input type="radio" name="target" value="_blank" <?php if(isset($view['target'])&&$view['target']==1){echo 'checked';} ?>  /></td>
	</tr>
	<tr><td><?=lang('category_model')?></td>
		<td><select name="model" id="model" class="validate" validtip="required">
				<?php foreach($modelarr as $key=>$model):?>
				<option value="<?=$key?>" <?php if(isset($view['model'])&&$key==$view['model']):?>selected<?php endif;?>><?=lang('model_'.$key)?></option>
				<?php endforeach;?>
				</select>
		</td>
		<td><?=lang('category_parent')?></td><td>
			<select name="parent" onchange="setClass(this)">
			<?=$parentstr?>
			</select></td>
	</tr>
	<tr>
		<td><?=lang('category_isnavigation')?></td>
		<td><?=lang('yes')?><input type="radio" name="isnavigation" value="1" <?php if(!isset($view['isnavigation'])||$view['isnavigation']==1){echo 'checked';} ?> /><?=lang('no')?><input type="radio" name="isnavigation" value="0" <?php if(isset($view['isnavigation'])&&$view['isnavigation']==0){echo 'checked';} ?>  /></td>
		<td><?=lang('category_isdisabled')?></td>
		<td><?=lang('yes')?><input type="radio" name="isdisabled" value="0" <?php if(!isset($view['isdisabled'])||$view['isdisabled']==0){echo 'checked';} ?> /><?=lang('no')?><input type="radio" name="isdisabled" value="1" <?php if(isset($view['isdisabled'])&&$view['isdisabled']==1){echo 'checked';} ?>  /></td>
	</tr>
	<tr><td><?=lang('category_title')?></td><td colspan="3"><input type="text" name="title" id="title" size="80" class="input-text" value="<?=isset($view['title'])?$view['title']:'';?>"></td>
	<tr><td><?=lang('category_keywords')?></td><td colspan="3"><input type="text" name="keywords" id="keywords" size="80" class="input-text" value="<?=isset($view['keywords'])?$view['keywords']:'';?>"></td>
	<tr><td><?=lang('category_description')?></td><td colspan="3"><textarea rows="3" cols="79" name="description" id="description" class="txtarea"><?=isset($view['description'])?$view['description']:'';?></textarea></td></tr>
	<tr>
		<td><?=lang('content')?></td>
		<td colspan="4"><textarea style="width:668px;height:300px;" name="content" id="content" class="editor"><?=isset($view['content'])?htmlspecialchars($view['content']):'';?></textarea></td></tr>
	<tr>
	<tr>
		<td><?=lang('category_pagesize')?></td>
		<td ><input type="text" name="pagesize" id="pagesize" size="5" class="input-text" value="<?=isset($view['pagesize'])?$view['pagesize']:'';?>"></td>
		<td><?=lang('category_tpllist')?></td>
		<td colspan="2"><input type="text" name="tpllist" id="tpllist" class="input-text" value="<?=isset($view['tpllist'])?$view['tpllist']:'';?>"></td>
	</tr>
	<tr>
		<td><?=lang('category_tpldetail')?></td>
		<td><input type="text" name="tpldetail" id="tpldetail" class="input-text" value="<?=isset($view['tpldetail'])?$view['tpldetail']:'';?>"></td>
		<td><?=lang('order')?></td>
		<td colspan="2"><input type="text" name="listorder" id="listorder" value="<?php if(isset($view['listorder'])){echo $view['listorder'];}else{echo '99';} ?>" class="input-text" ></td>
	</tr>
	</table>
	</div>
	</form>
<?php endif;?>