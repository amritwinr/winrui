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
    const [time, setTime] = useState("Monthly")

    const data = [
        {
            type: "Starter",
            title: "A",
            price: {
                Monthly: 20,
                Yearly: 30
            },
            items: [
                "2"
            ]
        },
        {
            type: "Premium",
            title: "B",
            price: {
                Monthly: 20,
                Yearly: 30
            },
            items: [
                "2"
            ]
        },
        {
            type: "Enterprise",
            title: "C",
            price: {
                Monthly: 20,
                Yearly: 30
            },
            items: [
                "2"
            ]
        },
    ]

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

    const makePayment = async (e, amount) => {
        e.preventDefault()
        const res = await initializeRazorpay();

        if (!res) {
            alert("Razorpay SDK Failed to load");
            return;
        }

        // Make API call to the serverless API
        const data = await axios.post("/api/pay", {
            amount
        })

        var options = {
            key: 'rzp_test_PXt6SEeDFTb2S8', // Enter the Key ID generated from the Dashboard
            // name: "Manu Arora Pvt Ltd",
            currency: data.data.currency,
            amount: data.data.amount,
            order_id: data.data.id,
            handler: async function (response) {
                await axios.post(`${apiUrl}subscribe`, {
                    user: isAuth.userId, time, amount: data.data.amount
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
        <>
            <div className={styles.timeContainer}>
                <div className={styles.timeBtn}>
                    <button className={time === "Monthly" && styles.activeBtn} onClick={() => setTime("Monthly")}>Monthly</button>
                    <button className={time === "Yearly" && styles.activeBtn} onClick={() => setTime("Yearly")}>Yearly</button>
                </div>
            </div>
            <div className={styles.container}>
                {data?.map((item, i) => {
                    return (
                        <form onSubmit={(e) => makePayment(e, item?.price[time])} key={i} className={styles.card}>
                            <p className={styles.type}>
                                {item?.type}
                            </p>
                            <p className={styles.price}>
                                {item?.price[time]}
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
        </>
    )
}

export default Subscribe