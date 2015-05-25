module.exports = {
	//配置项: 配置值
	port: 8360, //监听的端口
	db_type: 'mysql', // 数据库类型
	db_host: '127.0.0.1', // 服务器地址
	db_port: '', // 端口
	db_name: 'jcms', // 数据库名
	db_user: 'root', // 用户名
	db_pwd: '', // 密码
	db_prefix: 'jcms', // 数据库表前缀


	//日志部分
	log_console: false, //是否记录日志，开启后会重写console.error等系列方法
	log_console_path: LOG_PATH + '/console', //日志文件存放路径
	log_console_type: ['error'], //默认只接管console.error日志
	log_memory: false, //记录内存使用和负载
	log_memory_path: LOG_PATH + '/memory', //日志文件存放路径
	log_memory_interval: 60 * 1000, //一分钟记录一次
};