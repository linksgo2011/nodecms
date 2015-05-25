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
			<ul class="zhaopinlist">
			<?php foreach ($list as $item): ?>
            <li><div class="view_title" style="text-align:left;"><h5>[<a href="<?=$item['categoryurl']?>"><?=$item['categoryname']?></a>] <a href="<?=$item['url']?>" target="_blank"><?=$item['title']?></a></h5></div>
			<div class="view_con">
				<table class="zhaopin" border="0" width="100%">
					<tr>
						<td width="100"><?=lang('hr_city')?></td>
						<td width="200"><?=$item['city']?></td>
						<td width="100"><?=lang('hr_num')?></td>
						<td width="200"><?=$item['num']?></td>
					</tr>
					<tr>
						<td width="100"><?=lang('hr_year')?></td>
						<td width="200" colspan="3"><?=$item['year']?></td>
					</tr>
				</table>
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