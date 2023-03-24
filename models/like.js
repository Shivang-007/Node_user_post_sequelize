module.exports = (sequelize, DataTypes, User, Post) => {
    const Like = sequelize.define("like", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull:false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:User,
                key:'id'
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:Post,
                key:'id'
            }
        }
    })
    Like.belongsTo(User)
    Like.belongsTo(Post)
    return Like
}