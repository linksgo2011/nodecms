<?php $this->load->view('admin_head.php');?>
<style>
body{background:#F7FBFC;overflow-x:hidden;overflow-y:auto;}
</style>
<?php foreach($purview[2] as $key=>$item):?>
	<?php if($key>0):?>
	<table  class="left_menu" cellpadding=0 cellspacing=0 id="purview_<?=$key?>">
	<tr><td><b class="mtop"><?=lang('func_'.$purview[3][$key]['class'])?></b></td></tr>
	<?php foreach ($item as $puritem): ?>
	<tr><td onclick="seton(this,'<?=site_aurl($puritem['class'])?>');"><span><a href="javascript:void(0)"><?=lang('func_'.$puritem['class'])?></a></span></td></tr>
	<?php endforeach; ?>
	</table>
	<?php endif;?>
<?php endforeach;?>
<script type="text/javascript">
function setTab(tid){
	$("#purview_"+tid).find('td').each(function(){
		$(this).removeClass("on");
	});
	$("table").hide();
	$("#purview_"+tid).show();
}
function seton(t,url) {
	$(t).parent().parent().find('td').each(function(){
		$(this).removeClass("on");
	});
	$(t).addClass("on");
	parent.main.location.href=url;
}

<?php if(isset($parent)&&$parent>0):?>
setTab(<?=$parent?>);
<?php endif;?>
</script>
<?php $this->load->view('admin_foot.php');?>