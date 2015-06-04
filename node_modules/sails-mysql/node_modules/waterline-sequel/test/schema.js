module.exports = {
  bar: {
    connection: ["mysqlServer"],
    identity  : "bar",
    tableName : "bar",
    migrate   : "safe",
    attributes: {
      color_a  : "string",
      color_b  : "string",
      color_c  : "string",
      id       : {
        type         : "integer",
        autoIncrement: true,
        primaryKey   : true,
        unique       : true
      },
      createdAt: {
        type   : "datetime",
        default: "NOW"
      },
      updatedAt: {
        type   : "datetime",
        default: "NOW"
      }
    }
  },
  bat: {
    connection: ["mysqlServer"],
    identity  : "bat",
    tableName : "bat",
    migrate   : "safe",
    attributes: {
      color_g  : "string",
      color_h  : "string",
      color_i  : "string",
      id       : {
        type         : "integer",
        autoIncrement: true,
        primaryKey   : true,
        unique       : true
      },
      createdAt: {
        type   : "datetime",
        default: "NOW"
      },
      updatedAt: {
        type   : "datetime",
        default: "NOW"
      }
    }
  },
  baz: {
    connection: ["mysqlServer"],
    identity  : "baz",
    tableName : "baz",
    migrate   : "safe",
    attributes: {
      color_d  : "string",
      color_e  : "string",
      color_f  : "string",
      id       : {
        type         : "integer",
        autoIncrement: true,
        primaryKey   : true,
        unique       : true
      },
      createdAt: {
        type   : "datetime",
        default: "NOW"
      },
      updatedAt: {
        type   : "datetime",
        default: "NOW"
      }
    }
  },
  foo: {
    connection: ["mysqlServer"],
    identity  : "foo",
    tableName : "foo",
    migrate   : "safe",
    attributes: {
      color    : "string",
      id       : {
        type         : "integer",
        autoIncrement: true,
        primaryKey   : true,
        unique       : true
      },
      createdAt: {
        type   : "datetime",
        default: "NOW"
      },
      updatedAt: {
        type   : "datetime",
        default: "NOW"
      },
      bar      : {
        columnName: "bar",
        type      : "integer",
        foreignKey: true,
        references: "bar",
        on        : "id",
        onKey     : "id"
      },
      bat      : {
        columnName: "bat",
        type      : "integer",
        foreignKey: true,
        references: "bat",
        on        : "id",
        onKey     : "id"
      },
      baz      : {
        columnName: "baz",
        type      : "integer",
        foreignKey: true,
        references: "baz",
        on        : "id",
        onKey     : "id"
      }
    }
  },
  oddity: {
    connection: ["mysqlServer"],
    identity  : "oddity",
    tableName : "oddity",
    migrate   : "safe",
    attributes: {
      meta    : "string",
      id      : {
        type         : "integer",
        autoIncrement: true,
        primaryKey   : true,
        unique       : true
      },
      createdAt: {
        type   : "datetime",
        default: "NOW"
      },
      updatedAt: {
        type   : "datetime",
        default: "NOW"
      },
      bar      : {
        columnName: "stubborn",
        type      : "integer",
        foreignKey: true,
        references: "bar",
        on        : "id",
        onKey     : "id"
      },
      bat      : {
        columnName: "bat",
        type      : "integer",
        foreignKey: true,
        references: "bat",
        on        : "id",
        onKey     : "id"
      }
    }
  }
};
