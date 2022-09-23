const { ARRAY } = require("sequelize");
const { Sequelize, Model, DataTypes } = require("sequelize");
const Database = require('../database/database')


const Message = Database.sequelize.define("Message", {
    message:{
        type: DataTypes.STRING
    },
    author:{
        type: DataTypes.STRING,
        allowNull: false
    },
    like:{
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    userId:{
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    usersLiked: {
        type : DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    }
    })

exports.Message = Message