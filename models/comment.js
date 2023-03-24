module.exports = (sequelize, DataTypes, User, Post) => {
    const Comment = sequelize.define("comment", {
        comment: {
            type: DataTypes.TEXT,
            allowNull:false
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
    Comment.belongsTo(User)
    Comment.belongsTo(Post)
    return Comment
}