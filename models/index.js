const dbConfig = require('../config/dbconfig')

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.max,
        min: dbConfig.min,
        acquire: dbConfig.acquire,
        idle: dbConfig.idle
    }
}
)
sequelize.authenticate()
    .then(() => {
        console.log('connected..')
    }).catch((error) => {
        console.log('Error: ' + error)
    })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize
db.users = require('../models/user.js')(sequelize, DataTypes)
db.posts = require('../models/post.js')(sequelize, DataTypes)

// db.players = require('../models/player.js')(sequelize, DataTypes)
// db.playerSkills = require('../models/playerSkill.js')(sequelize, DataTypes)

db.likes = require('../models/like.js')(sequelize, DataTypes, db.users, db.posts)
db.comments = require('../models/comment.js')(sequelize, DataTypes, db.users, db.posts)
db.user_tokens = require('../models/userToken.js')(sequelize, DataTypes)
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync model')
    }).catch((error) => {
        console.log(error)
    })

db.users.hasMany(db.posts, {
    foreignKey: 'user_id',
    as:'post'
})    

db.posts.belongsTo(db.users, {
    foreignKey: 'user_id',
    as:'user'
}) 

// db.players.hasMany(db.playerSkills, {
//     foreignKey: 'playerId',
// }) 

// db.playerSkills.belongsTo(db.players, {
//     foreignKey: 'playerId',
// }) 


module.exports = db