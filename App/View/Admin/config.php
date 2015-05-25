<?php $this->load->view('admin_head.php');?>
<div id="main_head" class="main_head" style="height:35px;">
<table class="menu">
<tr><td>
<a href="<?=site_aurl('config')?>" <?php if($tpl=='base'):?> class="current"<?php endif;?>><?=lang('config_base')?></a>
<a href="<?=site_aurl('config/mail')?>" <?php if($tpl=='mail'):?> class="current"<?php endif;?>><?=lang('config_mail')?></a>
<a href="<?=site_aurl('config/lang')?>" <?php if($tpl=='lang'):?> class="current"<?php endif;?>><?=lang('config_lang')?></a>
<a href="<?=site_aurl('config/attr')?>" <?php if($tpl=='attr'):?> class="current"<?php endif;?>><?=lang('config_attr')?></a>
<a href="<?=site_aurl('config/add')?>" <?php if($tpl=='add'):?> class="current"<?php endif;?>><?=lang('config_add')?></a>
</td></tr>
</table>
</div>
<?php if($tpl=='base'):?>
	<form name="formview" id="formview" action="" method="post">
		<input type="hidden" name="action" id="action" value="<?=site_aurl('config')?>">
		<div id="main" class="main" style="padding-top:35px;padding-bottom:0;">
		<table cellSpacing=0 width="100%" class="content_view">
		<tr><td width="100" align="right"><?=lang('site_name')?></td><td><input type="text" name="config[site_name]" id="" size="50" class="input-text" value="<?php if (isset($view['site_name'])): ?><?=$view['site_name']?><?php endif; ?>">site_name</td></tr>
		<tr><td width="100" align="right"><?=lang('site_title')?></td><td><input type="text" name="config[site_title]" id="site_title" size="50" class="input-text" value="<?php if (isset($view['site_title'])): ?><?=$view['site_title']?><?php endif; ?>">site_title</td></tr>
		<tr><td width="100" align="right"><?=lang('site_keywords')?></td><td><input type="text" name="config[site_keywords]" id="site_keywords" size="50" class="input-text" value="<?php if (isset($view['site_keywords'])): ?><?=$view['site_keywords']?><?php endif; ?>">site_keywords</td></tr>
		<tr><td width="100" align="right"><?=lang('site_description')?></td><td><textarea cols="60" rows="4" class="txtarea" name="config[site_description]" id="site_description"><?php if (isset($view['site_description'])): ?><?=$view['site_description']?><?php endif; ?></textarea> site_description</td></tr>
		<tr><td width="100" align="right"><?=lang('site_code')?></td><td><textarea cols="60" rows="4" class="txtarea" name="config[site_code]" id="site_code"><?php if (isset($view['site_code'])): ?><?=$view['site_code']?><?php endif; ?></textarea> site_code</td></tr>
		<tr><td width="100" align="right"><?=lang('site_logo')?></td><td><input type="text" name="config[site_logo]" id="site_logo" size="50" class="input-text" value="<?php if (isset($view['site_logo'])): ?><?=$view['site_logo']?><?php endif; ?>">site_logo</td></tr>
		<tr><td width="100" align="right"><?=lang('site_home')?></td><td><input type="text" name="config[site_home]" id="site_home" size="50" class="input-text" value="<?php if (isset($view['site_home'])): ?><?=$view['site_home']?><?php endif; ?>">site_home</td></tr>
		<tr><td width="100" align="right"><?=lang('site_template')?></td><td><input type="text" name="config[site_template]" id="site_template" size="50" class="input-text" value="<?php if (isset($view['site_template'])): ?><?=$view['site_template']?><?php endif; ?>">site_template</td></tr>
		<?php if (isset($liststr)): ?><?=$liststr?><?php endif; ?>
		<tr><td></td><td><?php if (isset($func)): ?><?=$func?><?php endif; ?></td></tr>
		</table>
		</div>
	</form>
<?php elseif($tpl=='mail'):?>
	<form name="formview" id="formview" action="" method="post">
		<input type="hidden" name="action" id="action" value="<?=site_aurl('config/mail')?>">
		<div id="main" class="main" style="padding-top:35px;padding-bottom:0;">
		<table cellSpacing=0 width="100%" class="content_view">
		<tr><td width="100" align="right"><?=lang('config_mail_type')?></td><td>
		<?=lang('config_smtp')?><input type="radio" name="config[mail_type]" value="smtp" <?php if(!isset($view['mail_type'])||$view['mail_type']=='smtp'){echo 'checked';} ?> />
		<?=lang('config_sendmail')?><input type="radio" name="config[mail_type]" value="sendmail" <?php if(isset($view['mail_type'])&&$view['mail_type']=='sendmail'){echo 'checked';} ?>  />
		</td></tr>
		<tr><td width="100" align="right"><?=lang('smtp_host')?></td><td><input type="text" name="config[smtp_host]" id="" size="50" class="input-text" value="<?php if (isset($view['smtp_host'])): ?><?=$view['smtp_host']?><?php endif; ?>"></td></tr>
		<tr><td width="100" align="right"><?=lang('smtp_user')?></td><td><input type="text" name="config[smtp_user]" id="" size="50" class="input-text" value="<?php if (isset($view['smtp_user'])): ?><?=$view['smtp_user']?><?php endif; ?>"></td></tr>
		<tr><td width="100" align="right"><?=lang('smtp_pass')?></td><td><input type="password" name="config[smtp_pass]" id="" size="50" class="input-text" value="<?php if (isset($view['smtp_pass'])): ?><?=$view['smtp_pass']?><?php endif; ?>"></td></tr>
		<tr><td width="100" align="right"><?=lang('smtp_port')?></td><td><input type="text" name="config[smtp_port]" id="" size="50" class="input-text" value="<?php if (isset($view['smtp_port'])): ?><?=$view['smtp_port']?><?php endif; ?>"></td></tr>
		<tr><td width="100" align="right"><?=lang('smtp_sendmail')?></td><td><input type="text" name="config[smtp_sendmail]" id="" size="50" class="input-text" value="<?php if (isset($view['smtp_sendmail'])): ?><?=$view['smtp_sendmail']?><?php endif; ?>"></td></tr>
		<tr><td></td><td><?php if (isset($func)): ?><?=$func?><?php endif; ?></td></tr>
		</table>
		</div>
	</form>
<?php elseif($tpl=='lang'):?>
	<form name="formview" id="formview" action="" method="post">
		<input type="hidden" name="action" id="action" value="<?=site_aurl('config/lang')?>">
		<div id="main" class="main" style="padding-top:35px;padding-bottom:0;">
		<table cellSpacing=0 width="100%" class="content_view">
			<tr><td width="100" align="right"><?=lang('site_adminlang')?></td><td>
			<select name="config[site_adminlang]" id="site_adminlang">
			<?php foreach($langarr as $key=>$item):?>
			<option value="<?=$key?>" <?php if (isset($view['site_adminlang'])&&$view['site_adminlang']==$key): ?>selected<?php endif; ?>><?=$item['title']?></option>
			<?php endforeach;?>
			</select> </td></tr>
			<tr><td width="100" align="right"><?=lang('site_frontlang')?></td><td>
			<select name="config[site_frontlang]" id="site_frontlang">
			<?php foreach($langarr as $key=>$item):?>
			<option value="<?=$key?>" <?php if (isset($view['site_frontlang'])&&$view['site_frontlang']==$key): ?>selected<?php endif; ?>><?=$item['title']?></option>
			<?php endforeach;?>
			</select> </td></tr>
		<tr><td></td><td><?php if (isset($func)): ?><?=$func?><?php endif; ?></td></tr>
		</table>
		</div>
	</form>
<?php elseif($tpl=='attr'):?>
	<form name="formview" id="formview" action="" method="post">
		<input type="hidden" name="action" id="action" value="<?=site_aurl('config/attr')?>">
		<div id="main" class="main" style="padding-top:35px;padding-bottom:0;">
		<table cellSpacing=0 width="100%" class="content_view">
			<tr><td width="100" align="right"><?=lang('config_attr_maxsize')?></td><td><input type="text" name="config[attr_maxsize]" class="input-text" value="<?php if (isset($view['attr_maxsize'])): ?><?=$view['attr_maxsize']?><?php endif; ?>"> K (1M=1024K)</td></tr>
			<tr><td width="100" align="right"><?=lang('config_attr_watertype')?></td><td>
		<input type="radio" name="config[water_type]" value="1" <?php if(isset($view['water_type'])&&$view['water_type']=='1'){echo 'checked';} ?> /> <?=lang('water_image')?>
		<input type="radio" name="config[water_type]" value="2" <?php if(isset($view['water_type'])&&$view['water_type']=='2'){echo 'checked';} ?>  /> <?=lang('water_text')?>
		<input type="radio" name="config[water_type]" value="0" <?php if(!isset($view['water_type'])||$view['water_type']=='0'){echo 'checked';} ?>  /> <?=lang('water_close')?>
		</td></tr>
		<tr><td width="100" align="right"><?=lang('water_padding')?></td><td><input type="text" name="config[water_padding]" size="5" class="input-text" value="<?php if (isset($view['water_padding'])): ?><?=$view['water_padding']?><?php endif; ?>">PX</td></tr>
		<tr><td width="100" align="right"><?=lang('water_opacity')?></td><td><input type="text" name="config[water_opacity]" size="5" class="input-text" value="<?php if (isset($view['water_opacity'])): ?><?=$view['water_opacity']?><?php endif; ?>">(1-100)</td></tr>
		<tr><td width="100" align="right"><?=lang('water_quality')?></td><td><input type="text" name="config[water_quality]" size="5" class="input-text" value="<?php if (isset($view['water_quality'])): ?><?=$view['water_quality']?><?php endif; ?>">(1-100)</td></tr>
		<tr><td width="100" align="right"><?=lang('water_position')?></td><td >
		<table class="waterposition">
			<tr>
				<td><input type="radio" name="config[water_position]" value="topleft" <?php if(isset($view['water_position'])&&$view['water_position']=='topleft'){echo 'checked';} ?> /><?=lang('topleft');?></td>
				<td><input type="radio" name="config[water_position]" value="topcenter" <?php if(isset($view['water_position'])&&$view['water_position']=='topcenter'){echo 'checked';} ?> /><?=lang('topcenter');?></td>
				<td><input type="radio" name="config[water_position]" value="topright" <?php if(isset($view['water_position'])&&$view['water_position']=='topright'){echo 'checked';} ?> /><?=lang('topright');?></td>
			</tr>
			<tr>
				<td><input type="radio" name="config[water_position]" value="middleleft" <?php if(isset($view['water_position'])&&$view['water_position']=='middleleft'){echo 'checked';} ?> /><?=lang('middleleft');?></td>
				<td><input type="radio" name="config[water_position]" value="middlecenter" <?php if(isset($view['water_position'])&&$view['water_position']=='middlecenter'){echo 'checked';} ?> /><?=lang('middlecenter');?></td>
				<td><input type="radio" name="config[water_position]" value="middleright"  <?php if(isset($view['water_position'])&&$view['water_position']=='middleright'){echo 'checked';} ?> /><?=lang('middleright');?></td>
			</tr>
			<tr>
				<td><input type="radio" name="config[water_position]" value="bottomleft" <?php if(isset($view['water_position'])&&$view['water_position']=='bottomleft'){echo 'checked';} ?> /><?=lang('bottomleft');?></td>
				<td><input type="radio" name="config[water_position]" value="bottomcenter" <?php if(isset($view['water_position'])&&$view['water_position']=='bottomcenter'){echo 'checked';} ?> /><?=lang('bottomcenter');?></td>
				<td><input type="radio" name="config[water_position]" value="bottomright" <?php if(!isset($view['water_position'])||$view['water_position']=='bottomright'){echo 'checked';} ?> /><?=lang('bottomright');?></td>
			</tr>
		</table>
		</td></tr>
		<tr><td></td><td><b><?=lang('water_image')?></b></td></tr>
		<tr><td width="100" align="right"><?=lang('water_image_path')?></td><td><input type="text" name="config[water_image_path]" id="water_image_path" class="input-text" value="<?php if (isset($view['water_image_path'])): ?><?=$view['water_image_path']?><?php endif; ?>"><input type="button" value="<?=lang('btn_upload')?>" class="btn"  onclick="uploadpic('','water_image_path')"></td></tr>
		<tr><td></td><td><b><?=lang('water_text')?></b></td></tr>
		<tr><td width="100" align="right"><?=lang('water_text_value')?></td><td><input type="text" name="config[water_text_value]" class="input-text" value="<?php if (isset($view['water_text_value'])): ?><?=$view['water_text_value']?><?php endif; ?>"></td></tr>
		<tr><td width="100" align="right"><?=lang('water_text_size')?></td><td><input type="text" name="config[water_text_size]" size="5" class="input-text" value="<?php if (isset($view['water_text_size'])): ?><?=$view['water_text_size']?><?php endif; ?>">PX</td></tr>
		<tr><td width="100" align="right"><?=lang('water_text_color')?></td><td><input type="text" name="config[water_text_color]" id="water_text_color" size="10" class="input-text" value="<?php if (isset($view['water_text_color'])): ?><?=$view['water_text_color']?><?php endif; ?>"><a  class="selectcolor colorpicker" onclick="colorpicker(this,'water_text_color','')">&nbsp;</a></td></tr>
		<tr><td width="100" align="right"><?=lang('water_text_font')?></td><td><input type="text" name="config[water_text_font]" id="water_text_font" class="input-text" value="<?php if (isset($view['water_text_font'])): ?><?=$view['water_text_font']?><?php endif; ?>"><input type="button" value="<?=lang('btn_upload')?>" class="btn"  onclick="uploadfile('water_text_font','')"></td></tr>
		
		<tr><td></td><td><?php if (isset($func)): ?><?=$func?><?php endif; ?></td></tr>
		</table>
		</div>
	</form>
<?php elseif($tpl=='add'):?>
	<form name="formview" id="formview" action="" method="post">
		<input type="hidden" name="action" id="action" value="<?=site_aurl('config/add')?>">
		<div id="main" class="main" style="padding-top:35px;padding-bottom:0;">
		<table cellSpacing=0 width="100%" class="content_view">
			<tr><td width="100" align="right"><?=lang('varname')?></td><td><input type="text" name="varname" id="varname" size="50"  class="validate input-text" validtip="required"  value=""></td></tr>
			<tr><td width="100" align="right"><?=lang('title')?></td><td><input type="text" name="title" id="title" size="50"  class="validate input-text" validtip="required"  value=""></td></tr>	
			<tr><td width="100" align="right"><?=lang('value')?></td><td><input type="text" name="value" id="value"  size="50" class="input-text" value=""></td></tr>
		<tr><td></td><td><?php if (isset($func)): ?><?=$func?><?php endif; ?></td></tr>
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