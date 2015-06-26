/**
 * Admin/CategoryController
 */
module.exports = {
	index: function(req, res, next) {
		res.locals.config = {};
		res.locals.headers = {
			'breadcrumb': [{
				name: "后台首页",
				link: "/admin/main"
			}],
			'title': '栏目管理',
			'description': "目前暂时支持2级栏目",
			'parent_purview': "content",
			'purview': "category"
		};

		res.locals.data = [];
		Category.getTree({}).then(function(data) {
			res.locals.data = data;
			return res.view();
		});
	},	

	add: function(req, resm, next) {
		res.locals.headers = {
			'breadcrumb': [{
				name: "后台首页",
				link: "/admin/main"
			}, {
				name: "栏目管理",
				link: "/admin/category"
			}],
			'title': '添加栏目',
			'description': "",
			'parent_purview': "content",
			'purview': "category"
		};
		res.locals.category = {};
		return res.view();
	}
};