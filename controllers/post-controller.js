const db = require('../models')
const { Op } = require("sequelize");
const User = db.users
const Post = db.posts
const Like = db.likes
const Comment = db.comments

const addPost = async (req, res) => {
    try {
        let data = {
            ...req.body,
            user_id: req.user.id
        }
        const post = await Post.create(data)
        res.status(200).send(post)
    } catch (e) {
        res.status(400).send()
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({ where: { user_id: req.user.id } })
        if (!posts.length) {
            res.status(404).send({ error: 'post not found' })
        }
        res.status(200).send(posts)
    } catch (e) {
        res.status(500).send()
    }
}


//update post
const updatePost = async (req, res) => {
    try {
        const post = await Post.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        })
        if (post === null) {
            res.status(404).json({ error: 'post not found' })
        }
        await Post.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        })
        res.status(200).send({ message: 'post updated successfully' })
    } catch (e) {
        res.status(500).send()
    }
}

//delete post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        })
        if (post === null) {
            res.status(404).json({ error: 'post not found' })
        }
        await Post.destroy({ where: { id: req.params.id, user_id: req.user.id } })
        res.status(200).send({ message: 'post deleted successfully' })
    } catch (e) {
        res.status(500).send()
    }
}

// like operator
const searchPost = async (req, res) => {
    const title = req.query.title
    try {
        const matchedPosts = await Post.findAll({
            where: {
                title: {
                    [Op.like]: '%' + title + '%'
                },
                user_id: req.user.id
            }
        })
        if (!matchedPosts.length) {
            res.status(404).send({ error: 'post not found' })
        }
        res.status(200).send(matchedPosts)
    } catch (e) {
        res.status(500).send()
    }
}

const addLike = async (req, res) => {
    try {
        const like = await Like.create({
            userId: req.user.id,
            postId: req.params.id
        })
        const user = await User.findByPk(req.user.id)
        const post = await Post.findByPk(req.params.id)
        res.status(200).send({
            message: 'like added successfully',
            like,
            user,
            post
        })
    } catch (e) {
        res.staus(500).send()
    }
}

const deleteLike = async (req, res) => {
    try {
        await Like.destroy({
            where: {
                userId: req.user.id,
                postId: req.params.id
            }
        })
        res.status(200).send({ message: 'like removed successfully' })
    } catch (e) {
        res.status(500).send()
    }
}

const addComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            comment: req.body.comment,
            userId: req.user.id,
            postId: req.params.id
        })
        const user = await User.findByPk(req.user.id)
        const post = await Post.findByPk(req.params.id)
        res.status(200).send({
            message: 'comment added successfully',
            comment,
            user,
            post
        })
    } catch (e) {
        res.staus(500).send()
    }
}

const deleteComment = async (req, res) => {
    try {
        await Comment.destroy({
            where: {
                userId: req.user.id,
                postId: req.params.id
            }
        })
        res.status(200).send({ message: 'comment removed successfully' })
    } catch (e) {
        res.status(500).send()
    }
}

const countLikes = async (req, res) => {
    try{
        const countPostLikes = await Like.count({
            where:{
                postId:req.params.id
            }
        })
        res.status(200).send({ countPostLikes })
    }catch(e){
        res.status(500).send()
    }
}

const allComments = async (req, res) => {
    try{
        const comments = await Comment.findAll({
            where: {
                postId:req.params.id
            }
        })
        res.status(200).send({comments : comments})
    }catch(e){
        res.status(500).sned()
    }
}

module.exports = {
    addPost,
    getAllPosts,
    searchPost,
    updatePost,
    deletePost,
    addLike,
    deleteLike,
    addComment,
    deleteComment,
    countLikes,
    allComments,
}