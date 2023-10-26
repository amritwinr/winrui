const https = require("https")
import PaytmChecksum from "@/components/Paytm/Checksum";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.json();

    // var paytmParams = {
    //     "requestType": "Payment",
    //     "mid": "vMrfbz82358829675624",
    //     "websiteName": "WEBSTAGING",
    //     "orderId": data.orderId,
    //     "callbackUrl": "https://localhost:3000/api/Payout",
    //     "txnAmount": {
    //         "value": data.amount,
    //         "currency": "INR",
    //     },
    //     "userInfo": {
    //         "custId": "CUST_001",
    //     },
    // }

    // /**
    // * Generate checksum by parameters we have
    // * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    // */
    // var paytmChecksum = await PaytmChecksum.generateSignature(paytmParams, "TeCjh5LAZIZ8zjlb").then((result) => {
    //     var verifyChecksum = PaytmChecksum.verifySignature(paytmParams, "TeCjh5LAZIZ8zjlb", result);
    //     return result
    // }).catch(function (error) {
    //     console.log(error);
    // });

    // console.log(paytmChecksum)

    var paytmParams = {};

    paytmParams.body = {
        "requestType": "Payment",
        "mid": "vMrfbz82358829675624",
        "websiteName": "WEBSTAGING",
        "orderId": 'ORDERID_98765',
        "callbackUrl": `http://localhost:3000/api/Payout`,
        "txnAmount": {
            "value": 1,
            "currency": "INR",
        },
        "userInfo": {
            "custId": "CUST_001",
        },
    };

    /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "TeCjh5LAZIZ8zjlb").then(async function (checksum) {
        paytmParams.head = {
            signature: checksum
        };

        var post_data = JSON.stringify(paytmParams);
        console.log(post_data)

        const mid = "vMrfbz82358829675624"

        var options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=ORDERID_98765`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            },
        };

        await axios.post(`https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${mid}&orderId=ORDERID_98765`, post_data, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            },
        }).then(r => {
            console.log(r.data)
        })

        // const res = await doRequest(options, post_data)
        // console.log({ res: res.body })

    })

    // function doRequest(options, data) {
    //     return new Promise((resolve, reject) => {
    //         const req = https.request(options, (res) => {
    //             res.setEncoding("utf8");
    //             let responseBody = "";

    //             res.on("data", (chunk) => {
    //                 responseBody += chunk;
    //             });

    //             res.on("end", () => {
    //                 resolve(JSON.parse(responseBody));
    //             });
    //         });

    //         req.on("error", (err) => {
    //             reject(err);
    //         });

    //         req.write(data);
    //         req.end();
    //     });
    // }

    return NextResponse.json({ token: "paytmChecksum" })
}
