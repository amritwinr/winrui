"use client"

import React from 'react'
import styles from "@/Styles/subscribe.module.css"
import axios from 'axios'
import Script from 'next/script'
import { useState } from 'react'
import { useEffect } from 'react'
import { apiUrl } from '@/constants'
import { useSelector } from 'react-redux'

const Subscribe = () => {
    const { isAuth } = useSelector((state) => state.auth);

    const data = [
        {
            type: "Starter",
            title: "A",
            price: "10",
            items: [
                "2"
            ]
        },
        {
            type: "Premium",
            title: "B",
            price: "20",
            items: [
                "2"
            ]
        },
        {
            type: "Enterprise",
            title: "C",
            price: "30",
            items: [
                "2"
            ]
        },
    ]

    const [scriptLoaded, setScriptLoaded] = useState(false);

    function onScriptLoad(token) {
        var config = {
            "root": "",
            "flow": "DEFAULT",
            "data": {
                "orderId": "order1234", /* update order id */
                "token": token, /* update token value */
                "tokenType": "TXN_TOKEN",
                "amount": "1.00" /* update amount */,
                "userDetail": {
                    "mobileNumber": "7007498505",
                    "name": "Suryansh Pandey"
                }
            },
            "merchant": {
                "mid": "vMrfbz82358829675624",
            },
            "handler": {
                "notifyMerchant": function (eventName, data) {
                    console.log("notifyMerchant handler function called");
                    console.log("eventName => ", eventName);
                    console.log("data => ", data);
                }
            }
        };

        window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
            console.log("hello")
            // after successfully updating configuration, invoke JS Checkout
            window.Paytm.CheckoutJS.invoke();
        }).catch(function onError(error) {
            console.log("error => ", error);
        });


    }

    // const addPaypalScript = async (token) => {
    //     if (typeof window !== "undefined") {

    //         const script = document.createElement("script");
    //         script.src = `https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/vMrfbz82358829675624.js`;
    //         script.type = "text/javascript";
    //         script.crossOrigin = "anonymous";
    //         document.body.appendChild(script);
    //     }
    // };

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    // const onSubmit = async (e) => {
    //     e.preventDefault()

    //     axios.post("/api/pay", {
    //         orderId: "order1234",
    //         amount: "1"
    //     }).then((r) => {
    //         const token = r?.data?.token;
    //         onScriptLoad(token)
    //     })
    // }

    const makePayment = async (e) => {
        e.preventDefault()
        const res = await initializeRazorpay();

        if (!res) {
            alert("Razorpay SDK Failed to load");
            return;
        }

        // Make API call to the serverless API
        const data = await axios.post("/api/pay")

        var options = {
            key: 'rzp_test_PXt6SEeDFTb2S8', // Enter the Key ID generated from the Dashboard
            name: "Manu Arora Pvt Ltd",
            currency: data.data.currency,
            amount: data.data.amount,
            order_id: data.data.id,
            handler: async function (response) {
                await axios.post(`${apiUrl}subscribe`, {
                    user: isAuth.userId, type: "", amount: data.data.amount
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                }).then(async (r) => {
                    const data = r?.data?.data
                    console.log(data)
                })
                // Validate payment at server - using webhooks is a better idea.
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature);
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className={styles.container}>
            {data?.map((item, i) => {
                return (
                    <form onSubmit={makePayment} key={i} className={styles.card}>
                        <p className={styles.type}>
                            {item?.type}
                        </p>
                        <p className={styles.price}>
                            {item?.price}
                        </p>

                        <ul className={styles.list}>
                            {item?.items?.map((list, i) => (
                                <li key={i}>
                                    {list}
                                </li>
                            ))}
                        </ul>

                        <button type='submit' className={styles.button}>Pay</button>
                    </form>
                )
            })}
        </div>
    )
}

export default Subscribe