const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const { DB_HOST } = process.env;

const { Schema, model } = mongoose;

const contactSchema = Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model("contact", contactSchema);

const newContact = {
  name: "Alex",
  email: "nulla.ante@vestibul.co.uk",
  phone: "(992) 914-3792",
};

// mongoose
//   .connect(DB_HOST, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(async () => {
//     console.log("Database connection successful");
//     try {
//       const result = await Contact.create(newContact);
//       console.log(result);
//     } catch (error) {
//       console.log(error.message);
//     }
//   })
//   .catch((err) => console.log(err.message));

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
