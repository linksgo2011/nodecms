<?php $this->load->view($config['site_template'].'/head');?>
<div class="main">
	<div class="mainleft">
		<div class="lefttop">
			<h3><?=lang('tags')?></h3>
		</div>
		<div class="leftmiddle">
			<div class="contact">
			<?=x6cms_fragment('contact')?>
			</div>
		</div>
		<div class="leftbottom"></div>
	</div>
	<div class="mainright">
		<div class="righttop">
			<?=lang('current_location')?><a href="<?=base_url($langurl);?>"><?=lang('home')?></a> > <?=$tags['title']?>
		</div>
		<div class="rightmiddle">
			<ul class="centerlist">
				<?php $tmpData = x6cms_tagsData('article',$tags,5);?>
				<?php foreach($tmpData as $item):?>
				<li>[<a href="<?=$item['categoryurl']?>"><?=$item['categoryname']?></a>] <a href="<?=$item['url']?>" target="_blank"><?=$item['title']?></a><span><?=$item['puttime']?></span></li>
				<?php endforeach;?>
				<?php unset($tmpData,$item);?>
				
				<?php $tmpData = x6cms_tagsData('product',$tags,5);?>
				<?php foreach($tmpData as $item):?>
				<li>[<a href="<?=$item['categoryurl']?>"><?=$item['categoryname']?></a>] <a href="<?=$item['url']?>" target="_blank"><?=$item['title']?></a><span><?=$item['puttime']?></span></li>
				<?php endforeach;?>
				<?php unset($tmpData,$item);?>
				
				<?php $tmpData = x6cms_tagsData('ask',$tags,5);?>
				<?php foreach($tmpData as $item):?>
				<li>[<a href="<?=$item['categoryurl']?>"><?=$item['categoryname']?></a>] <a href="<?=$item['url']?>" target="_blank"><?=$item['title']?></a><span><?=$item['puttime']?></span></li>
				<?php endforeach;?>
				<?php unset($tmpData,$item);?>
				
				<?php $tmpData = x6cms_tagsData('down',$tags,5);?>
				<?php foreach($tmpData as $item):?>
				<li>[<a href="<?=$item['categoryurl']?>"><?=$item['categoryname']?></a>] <a href="<?=$item['url']?>" target="_blank"><?=$item['title']?></a><span><?=$item['puttime']?></span></li>
				<?php endforeach;?>
				<?php unset($tmpData,$item);?>
				
				<?php $tmpData = x6cms_tagsData('hr',$tags,5);?>
				<?php foreach($tmpData as $item):?>
				<li>[<a href="<?=$item['categoryurl']?>"><?=$item['categoryname']?></a>] <a href="<?=$item['url']?>" target="_blank"><?=$item['title']?></a><span><?=$item['puttime']?></span></li>
				<?php endforeach;?>
				<?php unset($tmpData,$item);?>
			</ul>
		</div>
		<div class="rightbottom"></div>
	</div>
</div>
<?php $this->load->view($config['site_template'].'/foot');?>