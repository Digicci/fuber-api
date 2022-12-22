const express = require('express');
const router = express.Router();    // Create a router

router.get('/form', function (req, res) {
    // pass the csrfToken to the view
    res.status(200).send({ csrfToken: req.csrfToken() });
})

module.exports = router