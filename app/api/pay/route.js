const https = require("https")
// import PaytmChecksum from "@/components/Paytm/Checksum";
import axios from "axios";
import { NextResponse } from "next/server";
import Razorpay from 'razorpay'

export async function POST(req) {
    // const data = await req.json();

    // var paytmParams = {};

    // paytmParams.body = {
    //     "requestType": "Payment",
    //     "mid": "OxMLoN86484833952071",
    //     "websiteName": "WEBSTAGING",
    //     "orderId": 'ORDERID_98765',
    //     "callbackUrl": `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=ORDERID_98765`,
    //     "txnAmount": {
    //         "value": "1.00",
    //         "currency": "INR",
    //     },
    //     "userInfo": {
    //         "custId": "CUST_001",
    //     },
    // };

    // /*
    // * Generate checksum by parameters we have in body
    // * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    // */
    // await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "kv7QFKM7HOZvl%E!").then(async function (checksum) {
    //     const a = await PaytmChecksum.verifySignature(JSON.stringify(paytmParams.body), "kv7QFKM7HOZvl%E!", checksum)

    //     console.log(checksum)

    //     paytmParams.head = {
    //         signature: checksum
    //     };

    //     var post_data = JSON.stringify(paytmParams);

    //     console.log(post_data)

    //     const mid = "OxMLoN86484833952071"

    //     var options = {

    //         /* for Staging */
    //         hostname: 'securegw-stage.paytm.in',

    //         /* for Production */
    //         // hostname: 'securegw.paytm.in',

    //         port: 443,
    //         path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=ORDERID_98765`,
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Content-Length': post_data.length
    //         },
    //     };

    //     await axios.post(`https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${mid}&orderId=ORDERID_98765`, post_data, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Content-Length': post_data.length
    //         },
    //     }).then(r => {
    //         console.log(r.data)
    //     })

    // const res = await doRequest(options, post_data)
    // console.log({ res: res.body })

    // })

    function doRequest(options, data) {
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                res.setEncoding("utf8");
                let responseBody = "";

                res.on("data", (chunk) => {
                    responseBody += chunk;
                });

                res.on("end", () => {
                    resolve(JSON.parse(responseBody));
                });
            });

            req.on("error", (err) => {
                reject(err);
            });

            req.write(data);
            req.end();
        });
    }

    const razorpay = new Razorpay({
        key_id: "rzp_test_PXt6SEeDFTb2S8",
        key_secret: "xDPLWDJJvyGhLbf2k9uGJXqL",
    });

    const payment_capture = 1;
    const amount = 1;
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
