module.exports = (sequelize, DataTypes) => {
    const UserToken = sequelize.define("user_token", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull :false
        },
        token:{
            type: DataTypes.STRING
        }
    })
    return UserToken
}