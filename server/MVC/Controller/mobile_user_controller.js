var createUser = function (req, res, next) {
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            next(err);
        } else {
            res.json(user);
        }
    });
};

var updateUser = function (req, res, next) {
    User.findByIdAndUpdate(req.body._id, req.body, { new: true }, function (err, user) {
        if (err) {
            next(err);
        } else {
            res.json(user);
        }
    });
};

var deleteUser = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            next(err);
        } else {
            res.json(req.user);
        }
    });
};

var getAllUsers = function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            next(err);
        } else {
            res.json(users);
        }
    });
};

var getOneUser = function (req, res) {
    res.json(req.user);
};

var getByIdUser = function (req, res, next, id) {
    User.findOne({ _id: id }, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};