module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate:{
                isEmail: true, 
                notNull: {
                    msg: 'Please enter a username'
                },
                notEmpty: {
                    msg: 'Username cannot be empty'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                min:6,
                notNull: {
                    msg: 'Please enter a password'
                },
                notEmpty: {
                    msg: 'Password cannot be empty'
                }
            }
        },
        age: {
            type: DataTypes.INTEGER,
            validate:{
                negativeAge(value){
                    if(value <= 0){
                        throw new Error('age can not be negative or 0')
                    }
                }
            }
        }
    })
    User.prototype.toJSON =  function () {
        var values = Object.assign({}, this.get());
      
        delete values.password;
        return values;
    }
    return User
}