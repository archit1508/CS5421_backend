const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompetitionsSchema = new Schema({
  creatorId: {
    type: String,
  },
  participantsIds: [],
  competitionName: {
    type: String,
  },
  competitionDescription: {
    type: String,
  },
  competitionStartDate: {
    type: Date,
  },
  competitionEndDate: {
    type: Date,
  },
  question: {
    type: String,
  },
  correctQuery: {
    type: String,
  },
  correctAnswer: {
    type: String,
  },
  statementTimeout: {
      type: Number,
  },
  creationQueries: [],
  competitionSubmissions: [{ type: Schema.Types.ObjectId, ref: "Submission" }],
});

module.exports = Competitions = mongoose.model(
  "Competitions",
  CompetitionsSchema
);
