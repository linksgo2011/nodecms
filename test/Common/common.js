describe("Common.js", function() {
	it("多语言支持测试", function() {
		expect("toEqual").toEqual(__("toEqual"));
	});


	it("获取网站根URL", function() {
		expect("").toEqual(base_url());
	});
});