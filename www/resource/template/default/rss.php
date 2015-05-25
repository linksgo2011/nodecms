<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"	xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
<channel>
	<title><?=$config['seo_title']?> - <?=$config['site_name']?></title>
	<link><?=$current_url?></link>
	<description><?=$config['site_name']?><?=$config['seo_title']?></description>
	<language>zh-cn</language>
	<ttl>1440</ttl>
	<copyright>© 2012 <?=$config['site_name']?>  Inc. Powered by <?=lang('system_name')?> <?=lang('system_version')?></copyright>
	<pubDate><?=$list[0]['puttime']?></pubDate>
	<?php foreach ($list as $key => $item): ?>
	<item>
		<title><?=$item['title']?></title>
		<link><?=$item['url']?></link>
		<category><?=$item['categoryname']?></category>
		<pubDate><?=$item['puttime']?></pubDate>
		<description><?=$item['description']?></description>
	</item>
	<?php endforeach; ?>
</channel>
</rss>