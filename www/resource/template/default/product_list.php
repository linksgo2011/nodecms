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
			<ul class="newsa">
				<?php foreach ($list as $item): ?>
				<li>
					<div class=centerimg><a href="<?=$item['url']?>"><img src="<?=$item['thumb']?>" width="85" height="68"></a></div>
					<div class=centercontent><b>[<a href="<?=$item['categoryurl']?>"><?=$item['categoryname']?></a>] <a href="<?=$item['url']?>" target="_blank"><?=$item['title']?></a></b>
					<p><?=$item['description']?> [<a style="color: #747474" href="<?=$item['url']?>">全文</a>]</p>
					</div>
				</li>
				<?php endforeach; ?>
			</ul>
			<div class="page"><?=isset($pagestr)?$pagestr:''?></div>
		</div>
		<div class="rightbottom"></div>
	</div>
</div>
<?php $this->load->view($config['site_template'].'/foot');?>