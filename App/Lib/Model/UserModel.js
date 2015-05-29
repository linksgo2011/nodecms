module.exports = Model(function() {
	return {
		trueTableName: 'user',
		login: function(input) {
			return this.where({username:input.username}).field('username,password').find().then(function(data){
				var password = input.password;
				var crypto = require('crypto');
				var md5sum = crypto.createHash('md5');
				md5sum.update(password);
				password = md5sum.digest('hex');

				return new Promise(function(resolve, reject){
					if(password === data.password){
						resolve(data);
					}else{
						reject("用户名或者密码错误");
					}
				});
			});
		}
	}
});
