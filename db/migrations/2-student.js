'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "candidates", deps: []
 * addColumn "hasVoted" to table "students"
 * addColumn "isCandidate" to table "students"
 * changeColumn "studentId" on table "students"
 * changeColumn "mail" on table "students"
 *
 **/

var info = {
    "revision": 2,
    "name": "student",
    "created": "2021-04-28T07:40:35.642Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "candidates",
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
                    "department": {
                        "type": Sequelize.STRING,
                        "field": "department",
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
            fn: "addColumn",
            params: [
                "students",
                "hasVoted",
                {
                    "type": Sequelize.BOOLEAN,
                    "field": "hasVoted",
                    "defaultValue": false,
                    "allowNull": false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "students",
                "isCandidate",
                {
                    "type": Sequelize.BOOLEAN,
                    "field": "isCandidate",
                    "defaultValue": false,
                    "allowNull": false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "students",
                "studentId",
                {
                    "type": Sequelize.STRING,
                    "field": "studentId",
                    "unique": true,
                    "allowNull": false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "students",
                "mail",
                {
                    "type": Sequelize.STRING,
                    "field": "mail",
                    "defaultValue": "this.studentId@stu.iku.edu.tr"
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "students",
                "hasVoted",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "removeColumn",
            params: [
                "students",
                "isCandidate",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "dropTable",
            params: ["candidates", {
                transaction: transaction
            }]
        },
        {
            fn: "changeColumn",
            params: [
                "students",
                "studentId",
                {
                    "type": Sequelize.INTEGER,
                    "field": "studentId",
                    "unique": true,
                    "allowNull": false
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "students",
                "mail",
                {
                    "type": Sequelize.STRING,
                    "field": "mail"
                },
                {
                    transaction: transaction
                }
            ]
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
