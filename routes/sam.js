const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:id", (req, res) => {
    console.log("test");
  res.sendFile(path.join(__dirname,"../public/views/sam-dashboard.html"));
});


module.exports = router;