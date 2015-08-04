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

	add: function(req, res, next) {
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
		// 获取模型列表
		Models
		.find({status: 1})
		.sort("listorder ASC")
		.then(function(data) {
			res.locals.models = data;
			return Category.getTree({});
		})
		.then(function(categorys) {
			res.locals.categorys = categorys;

			if(req.method == "POST"){

				req.body.lang = "zh_cn";
				Category.create(req.body).then(function(records){
					req.session.flash = {
						succ: "添加成功!"
					};
					return res.redirect("/admin/category/index");
				},function(err){
					res.locals.flash = {
						error: "添加失败!"
					};
					res.locals.category = req.body;
					return res.view();
				});
			}else{
				return res.view();
			}
		}, function(err) {
			return next(err);
		});
	}
};