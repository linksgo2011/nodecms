<?php $this->load->view('admin_head.php');?>
<div id="main_head" class="main_head">
<form name="formview" id="formview" action="<?=site_aurl($tablefunc.'/generate')?>" method="post">
<table class="menu">
<tr><td>
<a href="<?=site_aurl($tablefunc)?>" class="current"><?=lang('func_'.$tablefunc)?></a>
<?php foreach($langarr as $key=>$item):?>
<input type="checkbox" checked class="btn" name="generate[]"  value="<?=$key?>"/> <span><?=$item['title']?></span>
<?php endforeach;?>
<?=$btngenerate?>
</td></tr>
</table>
</form>
<table cellSpacing=0 width="100%" class="content_list"><thead>
<tr>
<th width=30  align="left"><input type="checkbox" onclick="checkAll(this)"></th>
<th align=left><?=lang('filename')?></th>
<th width=100  align="left"><?=lang('filesize')?></th>
<th width=150  align="left"><?=lang('backuptime')?></th>
<th width=50  align="left"><?=lang('operate')?></th>
</tr>
</thead>
</table>
</div>
<form name="formlist" id="formlist" action="<?=site_aurl($tablefunc)?>" method="post">
<input type="hidden" name="action" id="action" value="<?=site_aurl($tablefunc)?>">
<div id="main" class="main">
<table cellSpacing=0 width="100%" class="content_list">
<tbody id="content_list">
<?php if (isset($list)): ?>
<?php foreach ($list as $item): ?>
<tr id="tid_<?=base64_encode($item['name'])?>">
<td width=30><input type=checkbox name="optid[]" value="<?=base64_encode($item['name'])?>"></td>
<td><?=$item['name']?></td>
<td width="100"><?=byte_format($item['size']);?></td>
<td width="150"><?=date('Y-m-d H:i:s',$item['date'])?></td>
<td width="50">
<?=$isdownload?'<a href="'.site_aurl('sitemap/download/'.substr($item['name'],0,strlen($item['name'])-4)).'" title="'.lang('download').'" class="down"></a>':''?>
<?php if ($isdel): ?>
<?=$this->Purview_model->getSingleFunc(site_aurl($this->tablefunc.'/del'),'sdel',base64_encode($item['name']))?>
<?php endif; ?>
</td>
</tr>
<?php endforeach; ?>
<?php endif; ?>
</tbody>
</table>
</div>
</form>
<div id="main_foot" class="main_foot">
<table>
<tr><td height="40" style="background:#f6f6f6;">
<tr><td></td><td><?php if (isset($func)): ?><?=$func?><?php endif; ?></td></tr>
</td></tr>
</table>
</div>
<?php $this->load->view('admin_foot.php');?>