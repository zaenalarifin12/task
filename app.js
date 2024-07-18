const express = require("express");
const bodyParser = require("body-parser");
const { sequelize, ContactUs } = require("./models");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create
app.post("/contactus", async (req, res) => {
  const { yourname, yourphone, youremail, message, website } = req.body;
  try {
    const contact = await ContactUs.create({
      yourname,
      yourphone,
      youremail,
      message,
      website,
    });
    res.status(202).json({ status: 202, error: false, data: [contact] });
  } catch (err) {
    res.status(500).json({ status: 500, error: true, message: err.message });
  }
});

// Read all contacts with pagination
app.get("/contactus", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const size = parseInt(req.query.size) || 10; // Default to 10 items per page if not provided

  const offset = (page - 1) * size;
  const limit = size;

  try {
    const { count, rows } = await ContactUs.findAndCountAll({
      offset,
      limit,
      order: [["contactuscreate", "DESC"]],
    });

    res.status(200).json({
      status: 200,
      error: false,
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ status: 500, error: true, message: err.message });
  }
});

// Read a single contact by ID
app.get("/contactus/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const contact = await ContactUs.findByPk(id);
    if (contact) {
      res.status(200).json({ status: 200, error: false, data: [contact] });
    } else {
      res
        .status(404)
        .json({ status: 404, error: true, message: "Contact not found" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, error: true, message: err.message });
  }
});

// Update
app.put("/contactus/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { yourname, yourphone, youremail, message, website } = req.body;
  try {
    const contact = await ContactUs.findByPk(id);
    if (contact) {
      contact.yourname = yourname;
      contact.yourphone = yourphone;
      contact.youremail = youremail;
      contact.message = message;
      contact.website = website;
      await contact.save();
      res.status(200).json({ status: 200, error: false, data: [contact] });
    } else {
      res
        .status(404)
        .json({ status: 404, error: true, message: "Contact not found" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, error: true, message: err.message });
  }
});

// Delete
app.delete("/contactus/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const contact = await ContactUs.findByPk(id);
    if (contact) {
      await contact.destroy();
      res.status(200).json({ status: 200, error: false, data: [contact] });
    } else {
      res
        .status(404)
        .json({ status: 404, error: true, message: "Contact not found" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, error: true, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
