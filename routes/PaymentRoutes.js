const express = require("express");
const router = express.Router();
const { Add, Verify } = require('../controllers/PaymentController');

router.post("/PaymentRouter", Add); 
router.post("/PaymentRouter/:id", Verify); 

module.exports = router;
