<?php $this->load->view('admin_head.php');?>
<div id="main_head" class="main_head" style="height:35px;">
<table class="menu">
<tr><td>
<a href="<?=site_aurl('adminindex')?>" class="current"><?=lang('func_adminindex')?></a><?php if (is_dir('./install')): ?><font color="red"><?=lang('installnotice')?></font><?php endif; ?>
</td></tr>
</table>
</div>
<div id="main_head" style="padding-top:35px;">
<table cellSpacing=0 width="100%" class="content_list">
<tr><th width="50%" align="left" colspan="2"><?=lang('userinfo')?></th><th align="left" colspan="2" width="50%"><?=lang('systeminfo')?></th></tr>
<tr><td width="15%"><?=lang('user_name')?></td><td width="35%"><?=$user['username']?></td><td width="15%"><?=lang('x6cmsversion')?></td><td width="35%"><?=lang('system_version')?></td></tr>
<tr><td width="15%"><?=lang('func_usergroup')?></td><td width="35%"><?=$user['usergroup']?></td><td width="15%"><?=lang('runsetting')?></td><td width="35%"><?=$_SERVER['SERVER_SOFTWARE']?></td></tr>
<tr><td width="15%"><?=lang('lasttimelogin')?></td><td width="35%"><?=date('Y-m-d H:i:s',$user['lasttime'])?></td><td width="15%"><?=lang('uploadlicense')?></td><td width="35%"><?=ini_get('upload_max_filesize')?></td></tr>
<tr><td width="15%"><?=lang('lastiplogin')?></td><td width="35%"><?=$user['lastip']?></td><td width="15%"><?=lang('mysqlversion')?></td><td width="35%"><?=mysql_get_server_info()?></td></tr>
<tr><td width="15%"><?=lang('allcountlogin')?></td><td width="35%"><?=$user['logincount']?></td><td width="15%"><?=lang('overspace')?></td><td width="35%"><?=round((@disk_free_space(".")/(1024*1024)),2).'M'?></td></tr>
<tr><th width="50%" align="left" colspan="2"><?=lang('sitetongji')?></th>
	<th  width="15%" align="left"><?=lang('dynamic')?></th>
	<th width="35%" align="right"><a href="http://bbs.x6cms.com" target="_blank"><?=lang('bugsubmit')?></a>&nbsp;&nbsp;&nbsp;<a href="http://www.x6cms.com" target="_blank"><?=lang('moredynamic')?></a></th></tr>

<tr><td width="15%"><?=lang('func_down')?></td><td width="35%"><?=$this->db->count_all('down')?></td><td width="50%"  style="padding:0;" colspan="2" rowspan="6"><iframe width="100%" style="margin: 0;" height="150" src="http://www.x6cms.com/help" frameBorder="0" width="295" scrolling="no"></iframe></td></tr>
<tr><td width="15%"><?=lang('func_article')?></td><td width="35%"><?=$this->db->count_all('article')?></td></tr>
<tr><td width="15%"><?=lang('func_product')?></td><td width="35%"><?=$this->db->count_all('product')?></td></tr>
<tr><td width="15%"><?=lang('func_ask')?></td><td width="35%"><?=$this->db->count_all('ask')?></td></tr>
<tr><td width="15%"><?=lang('func_hr')?></td><td width="35%"><?=$this->db->count_all('hr')?></td></tr>
<tr><td width="15%"><?=lang('sessioncout')?></td><td width="35%"><?=$this->Data_model->getDataNum(array('last_activity >'=>time()-900),'sessions')?></td></tr>
</table>
</div>
<?php $this->load->view('admin_foot.php');?>