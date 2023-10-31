import { NextResponse } from "next/server";
import Razorpay from 'razorpay'

export async function POST(req) {
    const data = await req.json();

    const razorpay = new Razorpay({
        key_id: "rzp_test_PXt6SEeDFTb2S8",
        key_secret: "xDPLWDJJvyGhLbf2k9uGJXqL",
    });

    const payment_capture = 1;
    const amount = data?.amount;
    const currency = "INR";
    const options = {
        amount: (amount * 100).toString(),
        currency,
        receipt: '12345',
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);

        console.log(response)

        return NextResponse.json({
            status: 200,
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        })

    } catch (err) {
        return NextResponse.json({ status: 400 })
    }
}
