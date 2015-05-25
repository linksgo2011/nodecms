<?php $this->load->view($config['site_template'].'/head');?>
<div class="main">
	<div class="mainleft">
		<div class="lefttop">
			<h3><?=lang('search')?></h3>
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
			<?=lang('current_location')?><a href="<?=base_url($langurl);?>"><?=lang('home')?></a> > <?=lang('search')?>
		</div>
		<div class="rightmiddle">
			<ul class="centerlist">
				<?php foreach ($list as $item): ?>
				<li>[<a href="<?=$item['categoryurl']?>"><?=$item['categoryname']?></a>] <a href="<?=$item['url']?>" target="_blank"><?=$item['title']?></a><span><?=$item['puttime']?></span></li>
				<?php endforeach; ?>
			</ul>
			<div class="page"><?=isset($pagestr)?$pagestr:''?></div>
		</div>
		<div class="rightbottom"></div>
	</div>
</div>
<?php $this->load->view($config['site_template'].'/foot');?>