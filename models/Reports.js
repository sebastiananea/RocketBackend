const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportsSchema = new Schema(
  {
    group: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    }
  },
  { collection: "reports" }
);

const Reports = mongoose.model("Reports", ReportsSchema);

module.exports = Reports;
