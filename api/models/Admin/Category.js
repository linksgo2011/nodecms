
var util = require('util');

/**
 * 递归获取子树
 * @param  {int} parent_id 父ID
 * @param  {array} records   需要寻找的数组
 * @return {数组}           
 */
function getsubTree(parent_id, records) {
    var rs = [];
    records.forEach(function(one, key) {
        if (one.parent === parent_id) {
            rs.push(one);
            delete records[key];
        }
    });
    for (var i = rs.length - 1; i >= 0; i--) {
        rs[i].children = getsubTree(parent_id + 1, records);
    }
    return rs;
}

module.exports = {
    tableName:"category",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    attributes:{
      id:{
            type: 'integer',
            unique: true,
            primaryKey: true,
            columnName: 'id'
      },
      color:{
        type:"string",
        columnName:"color"
      },
      content:{
        type:"text",
        columnName:"content"
      },
      description:{
        type:"string",
        columnName:"description"
      },
      dir:{
        type:"string",
        columnName:"dir"
      },
      externalurl:{
        type:"string",
        columnName:"externalurl"
      },
      isdisabled:{
        type:"integer",
        columnName:"isdisabled"
      },
      isexternal:{
        type:"integer",
        columnName:"isexternal"
      },
      isnavigation:{
        type:"integer",
        columnName:"isnavigation"
      },
      keywords:{
        type:"string",
        columnName:"keywords"
      },
      lang:{
        type:"string",
        columnName:"lang"
      },
      lft:{
        type:"integer",
        columnName:"lft"
      },
      listorder:{
        type:"integer",
        columnName:"listorder"
      },
      model:{
        type:"string",
        columnName:"model"
      },
      name:{
        type:"string",
        columnName:"name"
      },
      pagesize:{
        type:"integer",
        columnName:"pagesize"
      },
      parent:{
        type:"integer",
        columnName:"parent"
      },
      rht:{
        type:"integer",
        columnName:"rht"
      },
      target:{
        type:"string",
        columnName:"target"
      },
      thumb:{
        type:"string",
        columnName:"thumb"
      },
      title:{
        type:"string",
        columnName:"title"
      },
      tpldetail:{
        type:"string",
        columnName:"tpldetail"
      },
      tpllist:{
        type:"string",
        columnName:"tpllist"
      }
    },

    /**
     * 获取tree结构的数据
     */
    getTree: function() {
        return this.find().then(function(data) {
            if (data && util.isArray(data)) {
                var rs = [];
                data.forEach(function(one, key) {
                    if (one.parent === 0) {
                        rs.push(one);
                        delete data[key];
                    }
                });
                for (var i = rs.length - 1; i >= 0; i--) {
                    rs[i].children = getsubTree(rs[i].id, data);
                }
                return rs;
            }
        });
    }

  };
