const express = require("express");
const router = express.Router();
const clientPath = process.cwd();
const controller = require('../controllers/controller');


router.get('/indexhtml', async (req, res, next) => {
    return res.status(200).sendFile(`${clientPath}/templates/index.html`)
})

router.get('/articles', controller.articles);
router.get('/categories/:id', controller.categoriesId);
module.exports = router;
