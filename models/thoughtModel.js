const { Schema, model} = require('mongoose');


const reactionSchema = new Schema(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
      reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
      },
      username: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: formatDate,
      },
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false,
    }
  );
  
  // Create Thought Schema
  const thoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        minLength: 1,
        maxLength: 280,
        required: [true, "Thought is required"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: formatDate,
      },
      username: {
        type: String,
        required: true,
      },
      reactions: [reactionSchema],
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false,
    }
  );


const formatDate = value => moment(value).format('MM-DD-YYYY');


thoughtSchema.virtual("reactionCount").get(() => this.reactions.length);

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;