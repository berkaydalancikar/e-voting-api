'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "admins", deps: []
 * createTable "elections", deps: []
 * createTable "emailTemplates", deps: []
 * createTable "notifications", deps: []
 * createTable "students", deps: []
 * createTable "candidates", deps: [students]
 * createTable "resetPasswordTokens", deps: [students]
 * createTable "studentTokens", deps: [students]
 *
 **/

var info = {
    "revision": 1,
    "name": "initial",
    "created": "2021-06-06T12:14:29.732Z",
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
                    "department": {
                        "type": Sequelize.STRING,
                        "field": "department",
                        "allowNull": false
                    },
                    "password": {
                        "type": Sequelize.STRING,
                        "field": "password",
                        "allowNull": false
                    },
                    "status": {
                        "type": Sequelize.STRING,
                        "field": "status",
                        "defaultValue": "passive"
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
                "elections",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "department": {
                        "type": Sequelize.STRING,
                        "field": "department",
                        "allowNull": false
                    },
                    "status": {
                        "type": Sequelize.STRING,
                        "field": "status",
                        "defaultValue": "idle"
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
                "emailTemplates",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "name": {
                        "type": Sequelize.STRING,
                        "field": "name"
                    },
                    "subject": {
                        "type": Sequelize.STRING,
                        "field": "subject"
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
                        "type": Sequelize.STRING,
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
                    "password": {
                        "type": Sequelize.STRING,
                        "field": "password",
                        "allowNull": false
                    },
                    "department": {
                        "type": Sequelize.STRING,
                        "field": "department",
                        "allowNull": false
                    },
                    "grade": {
                        "type": Sequelize.INTEGER,
                        "field": "grade",
                        "allowNull": false
                    },
                    "gpa": {
                        "type": Sequelize.FLOAT,
                        "field": "gpa",
                        "allowNull": false
                    },
                    "status": {
                        "type": Sequelize.STRING,
                        "field": "status",
                        "defaultValue": "passive",
                        "allowNull": false
                    },
                    "hasVoted": {
                        "type": Sequelize.STRING,
                        "field": "hasVoted",
                        "defaultValue": "no",
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
                "candidates",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "onUpdate": "CASCADE",
                        "onDelete": "NO ACTION",
                        "references": {
                            "model": "students",
                            "key": "id"
                        },
                        "field": "id",
                        "autoIncrement": true,
                        "primaryKey": true,
                        "allowNull": false
                    },
                    "studentId": {
                        "type": Sequelize.STRING,
                        "field": "studentId",
                        "allowNull": false
                    },
                    "department": {
                        "type": Sequelize.STRING,
                        "field": "department",
                        "allowNull": false
                    },
                    "description": {
                        "type": Sequelize.STRING,
                        "field": "description",
                        "allowNull": false
                    },
                    "votes": {
                        "type": Sequelize.INTEGER,
                        "field": "votes",
                        "defaultValue": 0
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
                "resetPasswordTokens",
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
                        "onUpdate": "CASCADE",
                        "onDelete": "NO ACTION",
                        "references": {
                            "model": "students",
                            "key": "id"
                        },
                        "field": "user_id",
                        "allowNull": false
                    },
                    "token": {
                        "type": Sequelize.STRING,
                        "field": "token",
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
                "studentTokens",
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
                        "onUpdate": "CASCADE",
                        "onDelete": "NO ACTION",
                        "references": {
                            "model": "students",
                            "key": "id"
                        },
                        "field": "student_id",
                        "allowNull": false
                    },
                    "token": {
                        "type": Sequelize.STRING,
                        "field": "token",
                        "allowNull": false
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
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
            params: ["candidates", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["elections", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["emailTemplates", {
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
            params: ["resetPasswordTokens", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["students", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["studentTokens", {
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
