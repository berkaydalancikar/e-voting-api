'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "admins", deps: []
 * createTable "notifications", deps: []
 * createTable "students", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "admin",
    "created": "2021-04-27T08:28:46.538Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "admins",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "username": {
                        "type": Sequelize.STRING,
                        "field": "username",
                        "allowNull": false
                    },
                    "password": {
                        "type": Sequelize.STRING,
                        "field": "password",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "notifications",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "title": {
                        "type": Sequelize.STRING,
                        "field": "title",
                        "allowNull": false
                    },
                    "content": {
                        "type": Sequelize.STRING,
                        "field": "content",
                        "allowNull": false
                    },
                    "department": {
                        "type": Sequelize.STRING,
                        "field": "department",
                        "allowNull": false
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "deletedAt": {
                        "type": Sequelize.DATE,
                        "field": "deletedAt"
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "students",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "studentId": {
                        "type": Sequelize.INTEGER,
                        "field": "studentId",
                        "unique": true,
                        "allowNull": false
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name",
                        "allowNull": false
                    },
                    "surname": {
                        "type": Sequelize.STRING,
                        "field": "surname",
                        "allowNull": false
                    },
                    "mail": {
                        "type": Sequelize.STRING,
                        "field": "mail"
                    },
                    "primaryDepartment": {
                        "type": Sequelize.STRING,
                        "field": "primaryDepartment",
                        "allowNull": false
                    },
                    "secondaryDepartment": {
                        "type": Sequelize.STRING,
                        "field": "secondaryDepartment",
                        "allowNull": true
                    },
                    "status": {
                        "type": Sequelize.STRING,
                        "field": "status",
                        "defaultValue": "passive",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "dropTable",
            params: ["admins", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["notifications", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["students", {
                transaction: transaction
            }]
        }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
