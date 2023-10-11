const router = require("express").Router();
const { User } = require("../../models");

// Error handler function
const errorHandler = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ error: message });
};

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).json(result);
  } catch (err) {
    errorHandler(res, "Unable to get all users");
  }
});

// GET a single user by its _id and populated thought and friend data
router.get("/:userId", async (req, res) => {
  try {
    const singleUser = await User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts")
      .populate("friends");
    res.status(200).json(singleUser);
  } catch (err) {
    errorHandler(res, "Unable to get user");
  }
});

// POST a new user
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
    });
    res.status(201).json(newUser);
  } catch (err) {
    errorHandler(res, "New user not created");
  }
});

// PUT to update a user by its _id
router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { new: true });
    if (!user) {
      return errorHandler(res, "No user with this id!", 404);
    }
    res.status(200).json(user);
  } catch (err) {
    errorHandler(res, err);
  }
});

// DELETE to remove user by its _id
router.delete("/:userId", async (req, res) => {
  try {
    const deleteUser = await User.findOneAndRemove({ _id: req.params.userId });
    if (!deleteUser) {
      return errorHandler(res, "No user with this id!", 404);
    }
    res.status(200).json({ message: "User has been deleted" });
  } catch (err) {
    errorHandler(res, err);
  }
});

// POST to add a new friend to a user's friend list
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const friend = await User.findOneAndUpdate({ _id: req.params.userId }, { $push: { friends: req.params.friendId } }, { new: true });
    if (!friend) {
      return errorHandler(res, "No user with that id", 404);
    }
    res.status(200).json(friend);
  } catch (err) {
    errorHandler(res, "Unable to create new post");
  }
});

// PUT to remove a friend from a user's friend list
router.put("/:userId/friends/:friendId", async (req, res) => {
  try {
    const friend = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });
    if (!friend) {
      return errorHandler(res, "No user with that id", 404);
    }
    res.status(200).json({ message: "Friend has been deleted" });
  } catch (err) {
    errorHandler(res, "Unable to create new post");
  }
});

module.exports = router;