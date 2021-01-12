router.route('/users')
  .post(createUser)
  .get(getAllUsers);

router.route('/users/:userId')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

router.param('userId', getByIdUser);

app.use('/api/v1', router);

app.listen(3000);
module.exports = app;