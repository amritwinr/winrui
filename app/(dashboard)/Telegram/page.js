"use client"

import React from 'react'
import styles from "@/Styles/telegram.module.css"
import { useState } from 'react'
import { AiOutlineUser } from "react-icons/ai"
import { BiSolidUser } from "react-icons/bi"
import Loading from '@/app/loading'
import axios from 'axios'
import { apiUrl } from '@/constants'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const Telegram = () => {
    const { isAuth } = useSelector((state) => state.auth);
    const [modal, setModal] = useState(false)
    const [apiId, setApiId] = useState("");
    const [apiHash, setApiHash] = useState("");
    const [phone, setPhone] = useState("");

    const [otp, setOtp] = useState()
    const [isOtp, setIsOtp] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)

    const [codeId, setCodeId] = useState(null)

    useEffect(() => {
        (async () => {
            setDataLoading(true)
            await axios.get(`${apiUrl}add_telegram?user=${isAuth.userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    jwttoken: isAuth.jwt,
                    userid: isAuth.userId,
                },
            }).then(async (r) => {
                const telData = r.data.data[0];
                const telApi = telData.api_id
                const telHash = telData.api_hash
                const telPhone = telData.phone

                await axios.post(`${apiUrl}telegram`, {
                    user: isAuth.userId, apiId: telApi, apiHash: telHash, phone: telPhone
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                }).then(async (r) => {
                    setDataLoading(false)
                    const data = r?.data?.data
                    setData(data)
                })
            })

        })()
    }, [apiUrl, isAuth, apiId])

    const getData = async (e) => {
        e.preventDefault()
        setIsOtp(true)

        await axios.post(`${apiUrl}telegram`, {
            user: isAuth.userId, apiId, apiHash, phone
        }, {
            headers: {
                'Content-Type': 'application/json',
                jwttoken: isAuth.jwt,
                userid: isAuth.userId,
            },
        }).then(async (r) => {
            const data = r?.data?.data
            setData(data)
        })

    }

    const onSave = async (e) => {
        e.preventDefault()

        await axios.put(`${apiUrl}add_telegram`, {
            id: codeId,
            user: isAuth.userId,
            code: otp,
            to_update: {
                code: otp
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                jwttoken: isAuth.jwt,
                userid: isAuth.userId,
            },
        }).then(async (r) => {
            const data = r?.data?.data
            setCodeId(data.id)
        })
    }

    return (
        <div className={styles.container}>
            {dataLoading ?
                <Loading /> :
                <>
                    <div className={styles.header}>
                        <button onClick={() => {
                            setModal(prev => !prev)
                        }}>Connect <BiSolidUser size={20} />
                        </button>
                    </div>
                    {modal && (
                        <div className={styles.modal}>
                            <AiOutlineUser size={50} />
                            {loading &&
                                <div className={styles.loading}>
                                    <Loading />
                                </div>
                            }

                            <form>
                                {data?.length > 0 ?
                                    <p className={styles.savedData}>Data Saved Successfully</p> :
                                    <>
                                        {isOtp ?
                                            <input placeholder="Otp" value={otp} onChange={(e) => setOtp(e.target.value)} /> :
                                            <>
                                                <input placeholder="App ID" value={apiId} onChange={(e) => setApiId(e.target.value)} />
                                                <input placeholder="App Hash" value={apiHash} onChange={(e) => setApiHash(e.target.value)} />
                                                <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                            </>}
                                        <button onClick={isOtp ? onSave : getData}>Save</button>
                                    </>}
                            </form>
                        </div>
                    )}

                    {data?.length > 0 &&
                        <div className={styles.list}>
                            {data?.map((item, i) => {
                                return (
                                    <div key={i} className={styles.listItem}>
                                        <p>{item}</p>
                                        <button>Subscribe</button>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default Telegram