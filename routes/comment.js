const router = require('express').Router()
const commentController = require('../controllers/comments.controller')
const { filterAndSort, filterByPublished, list, setUserFilter } = require('../middleware/apiHelpers')
const { getUserFromToken, attachUser } = require('../middleware/verifyUser')
const pagination = require('../middleware/pagination')
const isCreator = require('../middleware/isCreator')

router.route('/')
  .get(filterAndSort, filterByPublished, pagination, list, commentController.getComments)
  .post(getUserFromToken, commentController.createComment)

router.route('/p')
  .get(getUserFromToken, filterAndSort, setUserFilter, pagination, commentController.getComments)

router.route('/:id')
  .get(attachUser, commentController.getComment)
  .put(getUserFromToken, isCreator, commentController.updateComment)
  .delete(getUserFromToken, isCreator, commentController.deleteComment)

module.exports = router
