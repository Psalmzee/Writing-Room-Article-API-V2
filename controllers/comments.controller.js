const Comment = require('../models/comments.model')

const createComment = async (req, res, next) => {
  try {
    // grab details from the request
    const { postId, title_comment, short_desc, content } = req.body
    // create comment object
    const newComment= new Comment({
        postId,
      title_comment,
      short_desc,
      content
    })
    // save to database
    const createdComment = await newComment.save()

    // save comment ID to user document
    req.user.articles = req.user.articles.concat(createdComment._id)
    await req.user.save()

    // return response
    return res.status(201).json({
      status: 'success',
      data: createdComment,
    })
  } catch (err) {
    err.source = 'creating a comment'
    next(err)
  }
}

const getComments = async (req, res, next) => {
  try {
    const comment = await Comment
      .find(req.findFilter)
      .sort(req.sort)
      .select(req.fields)
      .populate('author', { username: 1 })
      .skip(req.pagination.start)
      .limit(req.pagination.sizePerPage)

    const pageInfo = req.pageInfo

    return res.json({
      status: 'success',
      pageInfo,
      data: comment,
    })
  } catch (err) {
    err.source = 'get comment controller'
    next(err)
  }
}

const getComment = async (req, res, next) => {
  try {
    const { id } = req.params
    const comment = await Comment.findById(id).populate('author', { username: 1 })

    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        message: 'comment not found'
      })
    }

      if (!req.user) {
        return response(res)
      } else if (comm.author._id.toString() !== req.user.id.toString()) {
        return response(res)
      }

    }

    catch (err) {
    err.source = 'get published comment controller'
    next(err)
  }
  return res.json({
    status: 'success',
    data: comment,
  })

}



const updateComment = async (req, res, next) => {
  try {
    let commentUpdate = { ...req.body }

    if (commentUpdate.state) delete commentUpdate.state

    const comment = await Comment.findByIdAndUpdate(req.params.id, commentUpdate, { new: true, runValidators: true, context: 'query' })

    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Comment not found'
      })
    }

    return res.json({
      status: 'success',
      data: commment
    })
  } catch (err) {
    err.source = 'update comment'
    next(err)
  }
}

const deleteComment = async (req, res, next) => {
  const user = req.user
  try {
    const deletedComment = await Comment.findByIdAndRemove(req.params.id)

    if (!deletedComment) {
      return res.status(404).json({
        status: 'fail',
        error: 'Comment not found'
      })
    }
    const deletedCommentId = deletedComment._id
    const index = user.articles.indexOf(deletedCommentId)
    user.articles.splice(index, 1)

    await user.save()

    res.json({
      status: 'success',
      data: deletedComment
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
}
