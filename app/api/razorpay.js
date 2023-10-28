const Razorpay = require("razorpay");

export default async function handler(req, res) {
    if (req.method === "POST") {
        // Initialize razorpay object
        const razorpay = new Razorpay({
            key_id: "rzp_test_PXt6SEeDFTb2S8",
            key_secret: "xDPLWDJJvyGhLbf2k9uGJXqL",
        });

        // Create an order -> generate the OrderID -> Send it to the Front-end
        const payment_capture = 1;
        const amount = 1;
        const currency = "INR";
        const options = {
            amount: (amount).toString(),
            currency,
            receipt: '12345',
            payment_capture,
        };

        try {
            const response = await razorpay.orders.create(options);
            res.status(200).json({
                id: response.id,
                currency: response.currency,
                amount: response.amount,
            });
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    } else {
        // Handle any other HTTP method
    }
}