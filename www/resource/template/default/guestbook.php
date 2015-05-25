<?php $this->load->view($config['site_template'].'/head');?>
<div class="main">
	<div class="mainleft">
		<div class="lefttop">
			<h3><?=$category['top']['name']?></h3>
		</div>
		<div class="leftmiddle">
			<ul class="aboutnav">
				<?php $tmpData = x6cms_thiscategory($category);?>
				<?php foreach ($tmpData as $item): ?>
				<li class="level<?=$item['level']?><?php if($item['id']==$category['id']):?> active<?php endif;?>"><a href="<?=$item['url']?>"><?=$item['name']?></a></li>
				<?php endforeach; ?>
			</ul>
			<div class="contact">
			<?=x6cms_fragment('contact')?>
			</div>
		</div>
		<div class="leftbottom"></div>
	</div>
	<div class="mainright">
		<div class="righttop"><?=x6cms_location($category,' > ');?></div>
		<div class="rightmiddle">
			<div class="aboutcontent">
				<form name="guestbook" id="guestbook" action="" onsubmit="return subGuestBook('<?=site_url('post/guestbook'.$langurl)?>')" method="post">
				<input type="hidden" name="category" id="category" value="<?=$category['id']?>">
				<table class="guestbook">
					<tr><td width="100"><?=lang('title')?><font color="red"> *</font></td><td><input type="text" name="title" id="title" size="40" class="txt validate" validtip="required"></td></tr>
					<tr><td><?=lang('author')?><font color="red"> *</font></td><td><input type="text" name="author" id="author" class="txt validate" validtip="required"></td></tr>
					<tr><td><?=lang('email')?><font color="red"> *</font></td><td><input type="text" name="email" id="email" class="txt validate" validtip="required,email"></td></tr>
					<tr><td><?=lang('phone')?></td><td><input type="text" name="phone" id="phone" class="txt"></td></tr>
					<tr><td><?=lang('content')?><font color="red"> *</font></td><td height="100"><textarea class="txtarea validate" cols="40" rows="5" name="content" id="content" validtip="required"></textarea></td></tr>
					<tr><td></td><td height="40"><input type="submit" value="<?=lang('submit')?>" class="btn"><input type="reset" value="<?=lang('reset')?>" class="btn"></td></tr>
				</table>
				</form>
			</div>
		</div>
		<div class="rightbottom"></div>
	</div>
</div>
<script type="text/javascript">
$("#guestbook").validform();
</script>
<?php $this->load->view($config['site_template'].'/foot');?>