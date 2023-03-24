const db = require('../models')
const { Sequelize } = db.Sequelize
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs')
const { createToken } = require('../auth/jwt')
const User = db.users
const Post = db.posts
const UserToken = db.user_tokens
const Player = db.players
const PlayerSkill = db.playerSkills 



const registerUser = async (req, res) => {
    try {
        const { username, password, age } = req.body;
        // Check if username already exists
        const existingUser = await User.findOne({ where: { username } })

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username,
            password: hashedPassword,
            age
        })
        const token = createToken(user)
        await UserToken.create({
            userId: user.id,
            token: token
        })
        return res.status(201).json({ user, token })
    } catch (e) {
        return res.status(400).send()
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ where: { username } })
        if (!user) {
            res.status(400).send({ error: 'unable to login' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).send({ error: 'unable to login' })
        }
        const token = createToken(user)
        await UserToken.create({
            userId: user.id,
            token: token
        })
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
}

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        await UserToken.destroy({
            where: { token }
        })
        res.status(200).send({ message: 'Logout successfully' })
    } catch (e) {
        res.status(500).send()
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({})
        if (!users.length) {
            res.status(404).send()
        }
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send()
    }
}

const getOneUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } })
        if (!user.length) {
            res.status(404).send()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
}

const profile = async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send()
    }
}

const updateProfile = async (req, res) => {
    try {
        const user = await User.update(req.body, { where: { id: req.user.id } })
        if (!user.length) {
            res.status(404).send()
        }
        res.status(200).send('updated successfully!')
    } catch (e) {
        res.status(400).send()
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.update(req.body, { where: { id: req.params.id } })
        if (!user.length) {
            res.status(404).send()
        }
        res.status(200).send('updated successfully!')
    } catch (e) {
        res.status(400).send()
    }
}

const deleteProfile = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.user.id } })
        res.status(200).send('user is deleted!')
    } catch (e) {
        res.status(400).send()
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.destroy({ where: { id: req.params.id } })
        if (!user.length) {
            res.status(404).send()
        }
        res.status(200).send('user is deleted!')
    } catch (e) {
        res.status(400).send()
    }
}

const userPosts = async (req, res) => {
    const userPosts = await User.findAll({
        include: [{
            model: Post,
            as: 'post'
        }],
        where: { id: req.params.id }
    })
    res.status(200).send(userPosts)
}

//count user posts
const countUserPosts = async (req, res) => {
    const userPosts = await User.findAll({
        attributes: {
            include: [[Sequelize.fn('COUNT', Sequelize.col('post.id')), 'postCount']]
        },
        include: [{
            model: Post,
            as: 'post',
            attributes: []
        }],
        group: ['user.id']
    });
    res.status(200).send(userPosts)
}


//18+ users
const adultUser = async (req, res) => {
    try {
        const users = await User.findAll({
            where:
            {
                age: {
                    [Op.gt]: 18
                }
            }
        })
        if (!users.length) {
            res.status(404).send()
        }
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send()
    }
}

//Order by age desc users
const maxToMinUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [
                ['age', 'DESC'],
            ]
        })
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send()
    }
}

const oneToManyPost = async (req, res) => {
    try {
        const userPosts = await User.findAll({
            attributes: ['username'],
            include: [{
                model: Post,
                as: 'post',
                attributes: ['title', 'content']
            }],
            where: { id: 3 }
        })
        res.status(200).send(userPosts)
    } catch (e) {
        res.status(500).send()
    }
}

//innerJoin
const innerJoin = async (req, res) => {
    try {
        const userPosts = await User.findAll({
            include: [
                { model: Post, as: 'post', required: true },

            ]
        })
        res.status(200).send({ userPosts })
    } catch (e) {
        res.status(500).send()
    }
}

// const createPlayerSkills = async (req, res) => {
//     try{
//         const playerData = await Player.create(req.body)
//         var data = [
//             {
//                 "skill": "strength",
//                 "value": 90,
//                 "playerId": 1
//             },
//             {
//                 "skill": "speed",
//                 "value": 90,
//                 "playerId": 1
//             }
//         ];
//         const skillData = await PlayerSkill.bulkCreate(data);
//         const playerSkillData = await Player.findAll({ include: [{model:PlayerSkill}] })
//         res.status(201).send(playerSkillData)
//     }catch(e){
//         res.status(400).send({
//             message: e.message || 'Error occurred while creating player',
//           });
//     }
// } 

module.exports = {
    registerUser,
    login,
    logout,
    getAllUsers,
    profile,
    getOneUser,
    updateUser,
    updateProfile,
    deleteUser,
    deleteProfile,
    userPosts,
    countUserPosts,
    adultUser,
    maxToMinUsers,
    oneToManyPost,
    innerJoin,
    // createPlayerSkills
}
