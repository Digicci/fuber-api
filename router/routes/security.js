const express = require('express');
const router = express.Router();    // Create a router
let csrf = require('csurf');

let csrfProtection = csrf({ cookie: true });
router.get('/form', csrfProtection, function (req, res) {
    // pass the csrfToken to the view
    res.status(200).send({ csrfToken: req.csrfToken() });
})

module.exports = router