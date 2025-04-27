// routes/videoProgressRoutes.js
const express = require('express');
const { saveVideoProgress, getVideoProgress } = require('../controllers/videoProgressController');
const router = express.Router();


router.post('/', saveVideoProgress);
router.get('/:videoId', getVideoProgress); 

module.exports = router;
