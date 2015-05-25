<?php $this->load->view('admin_head.php');?>
<?php if (count($actionurl)>0): ?>
<script language="javascript" type="text/javascript">
var second = 3;
setInterval("redirect()", 1000); //每1秒钟调用redirect()方法一次
function redirect(){
	if (second < 0){
		location.target="<?=$target?>"
		location.href = '<?=$actionurl[0]['url']?>';
	}else{
		$("#totalSecond").text(second--);
	}
}
</script>
<?php endif; ?>
<div class="message">
<div class="title"><?=$message?></div>
<?php if (count($actionurl)>0): ?>
<div class="content">
<?=lang('message1')?><span id="totalSecond" style="color:red;">3</span><?=lang('message2')?>
<ul>
<?php foreach ($actionurl as $key=>$val): ?>
<li><a href="<?=$val['url']?>"><?=$val['name']?></a></li>
<?php endforeach; ?>
</ul>
<?php endif; ?>
</div>
</div>
<?php $this->load->view('admin_foot.php');?>