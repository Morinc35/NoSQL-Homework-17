const router = require("express").Router();
const { Thought, User } = require("../../models");

const handleErrors = (res, message, status = 500) => {
  res.status(status).json({ error: message });
};

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.status(200).json(thoughts);
  } catch (err) {
    handleErrors(res, "Unable to get all thoughts");
  }
});

router.get("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId });
    res.status(200).json(thought);
  } catch (err) {
    handleErrors(res, "Unable to get this thought");
  }
});

router.post("/", async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: newThought._id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user with that id" });
    }

    res.status(200).json(newThought);
  } catch (err) {
    handleErrors(res, "Unable to create new post");
  }
});

router.put("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought with this id!" });
    }

    res.status(200).json(thought);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.delete("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

    if (!thought) {
      return res.status(404).json({ message: "No thought with this id!" });
    }

    res.status(200).json(thought);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    );

    res.status(200).json(thought);
  } catch (err) {
    handleErrors(res, err);
  }
});

router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.updateOne(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No reaction with that id" });
    }

    res.status(200).json(thought);
  } catch (err) {
    handleErrors(res, err);
  }
});

module.exports = router;