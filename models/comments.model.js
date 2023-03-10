const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    title_comment: String,
    short_desc: {
      type: String,
    },
    content: {
      type: String,
    },
   
  },
  { timestamps: true }
)


module.exports = mongoose.model('Commment', commentSchema)

