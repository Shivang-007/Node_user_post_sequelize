module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'Simform@123',
    DB: 'node_user_post_db',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}