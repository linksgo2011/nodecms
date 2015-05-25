<?php $this->load->view($config['site_template'].'/head');?>
<div class="main">
	<div class="mainleft">
		<div class="lefttop">
			<h3><?=lang('sitemap')?></h3>
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
			<?=lang('current_location')?><a href="<?=base_url($langurl);?>"><?=lang('home')?></a> > <?=lang('rss')?>
		</div>
		<div class="rightmiddle">
			
		
			<div class="view_title" style="text-align:left;"><h2><?=lang('rss')?></h2></div>
			<div class="view_con">
				<ul class="sitemap">
				<?php $tmpData = x6cms_allcategory();?>
				<?php foreach ($tmpData as $item): ?>
				<li class="level<?=$item['level']?>"><a href="<?=$item['rssurl']?>"><?=$item['name']?></a></li>
				<?php endforeach;?>
				</ul>
			</div>
		</div>
		<div class="rightbottom"></div>
	</div>
</div>
<?php $this->load->view($config['site_template'].'/foot');?>