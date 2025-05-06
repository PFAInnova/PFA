const axios = require('axios');
require('dotenv').config();

module.exports = {
    Add: async (req, res) => {
        const url = "https://developers.flouci.com/api/generate_payment";

        const baseUrl = "http://localhost:5173"; 

        const payload = {
            "app_token": "78d252b8-aee2-4756-9e65-ff394ba5263b", 
            "app_secret": process.env.FLOUCI_SECRET,  
            "amount": req.body.amount, 
            "accept_card": "true",
            "session_timeout_secs": 1200,
            "success_link": `${baseUrl}/Payment/Success`,  
            "fail_link": `${baseUrl}/Payment/Fail`,  
            "developer_tracking_id": "223fe2c9-2320-4b74-9ae3-9c26bb19aa0a"
        };

        try {
            const result = await axios.post(url, payload);

            res.send(result.data);
        } catch (err) {
            console.error(err);
            res.status(500).send("Failed to generate payment");
        }
    },

    Verify: async (req, res) => {
        const id_payment = req.params.id;
        try {
            const result = await axios.get(`https://developers.flouci.com/api/verify_payment/${id_payment}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'apppublic': "78d252b8-aee2-4756-9e65-ff394ba5263b",
                    'appsecret': process.env.FLOUCI_SECRET
                }
            });

            res.json(result.data); 
        } catch (err) {
            console.log(err);
            res.status(500).send("Failed to verify payment");
        }
    }
};
