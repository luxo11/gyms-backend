const Comment = require('../models/commentModel')
const User = require('../models/userModel')

const getComments = async (req, res) => {
    const { gymId } = req.params

    const comments = await Comment.find({gymId}).select('message username createdAt').sort({createdAt: -1})

    if(comments.length === 0) {
        return res.status(404).json({error: 'Žiadne komentáre', count: 0})
    }
    
    res.status(200).json({comments, count: comments.length})
}

const addComment = async (req, res) => {
    const { message, gymId } = req.body
    const { _id } = req.user    

    const { email:username } = await User.findOne({_id})

    const comment = await Comment.create({message, gymId, username, userId: _id})

    res.status(200).json({comment})
}

module.exports = { getComments, addComment }