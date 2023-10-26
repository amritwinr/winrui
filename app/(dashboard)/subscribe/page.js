"use client"

import React from 'react'
import styles from "@/Styles/subscribe.module.css"
import axios from 'axios'
import Script from 'next/script'
import { useState } from 'react'
import { useEffect } from 'react'

const Subscribe = () => {

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

    const addPaypalScript = async (token) => {
        if (typeof window !== "undefined") {

            const script = document.createElement("script");
            script.src = `https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/vMrfbz82358829675624.js`;
            script.type = "text/javascript";
            script.crossOrigin = "anonymous";
            document.body.appendChild(script);
        }
    };

    useEffect(() => {
        addPaypalScript()
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault()

        axios.post("/api/pay", {
            orderId: "order1234",
            amount: "1"
        }).then((r) => {
            const token = r?.data?.token;
            onScriptLoad(token)
        })
    }

    return (
        <div className={styles.container}>
            {data?.map((item, i) => {
                return (
                    <form onSubmit={onSubmit} key={i} className={styles.card}>
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