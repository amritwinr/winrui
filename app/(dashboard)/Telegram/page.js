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
import ReactSelect from 'react-select'

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
    const [listData, setListData] = useState(null)

    const getListData = async () => {
        await axios.get(`${apiUrl}subscribe_telegram?user=${isAuth.userId}`, {
            headers: {
                'Content-Type': 'application/json',
                jwttoken: isAuth.jwt,
                userid: isAuth.userId,
            },
        }).then(async (r) => {
            const data = r?.data?.data;
            setListData(data)
        })
    }

    useEffect(() => {
        getListData()
    }, [])

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
                const telData = r?.data?.data[0];
                const telApi = telData?.api_id
                const telHash = telData?.api_hash
                const telPhone = telData?.phone

                if (telData) {

                    await axios.post(`${apiUrl}telegram`, {
                        user: isAuth.userId, apiId: telApi, apiHash: telHash, phone: telPhone
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

            })

        })().finally(() => setDataLoading(false))
    }, [isAuth])

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
        console.log("data")

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
            console.log(data)
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
                            {data?.map((item, i) => <List item={item} key={i} getListData={getListData} listData={listData?.find(i => i?.name === item)} setListData={setListData} />)}
                        </div>
                    }
                </>
            }
        </div>
    )
}

const List = ({ item, getListData, listData, setListData }) => {
    const { isAuth } = useSelector((state) => state.auth);
    const [id, setId] = useState(listData?.id)
    const [symbols, setSymbols] = useState(null);
    const [quantity, setQuantity] = useState(listData?.quantity);
    const [loading, setLoading] = useState(false)

    const symb = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCP", "SBIN", "AARTIIND", "ABB", "ABBOTINDIA", "ABCAPITAL", "ABFRL", "ACC", "ADANIENT", "ADANIPORTS", "ALKEM", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE", "ASHOKLEY", "ASIANPAINT", "ASTRAL", "ATUL", "AUBANK", "AUROPHARMA", "AXISBANK", "BAJAJ-AUTO", "BAJAJFINSV", "BAJFINANCE", "BALKRISIND", "BALRAMCHIN", "BANDHANBNK", "BANKBARODA", "BATAINDIA", "BEL", "BERGEPAINT", "BHARATFORG", "BHARTIARTL", "BHEL", "BIOCON", "BOSCHLTD", "BPCL", "BRITANNIA", "BSOFT", "CANBK", "CANFINHOME", "CHAMBLFERT", "CHOLAFIN", "CIPLA", "COALINDIA", "COFORGE", "COLPAL", "CONCOR", "COROMANDEL", "CROMPTON", "CUB", "CUMMINSIND", "DABUR", "DALBHARAT", "DEEPAKNTR", "DELTACORP", "DIVISLAB", "DIXON", "DLF", "DRREDDY", "EICHERMOT", "ESCORTS", "EXIDEIND", "FEDERALBNK", "FSL", "GAIL", "GLENMARK", "GMRINFRA", "GNFC", "GODREJCP", "GODREJPROP", "GRANULES", "GRASIM", "GSPL", "GUJGASLTD", "HAL", "HAVELLS", "HCLTECH", "HDFCAMC", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDCOPPER", "HINDPETRO", "HINDUNILVR", "HONAUT", "IBULHSGFIN", "ICICIBANK", "ICICIGI", "ICICIPRULI", "IDEA", "IDFC", "IDFCFIRSTB", "IEX", "IGL", "INDHOTEL", "INDIACEM", "INDIAMART", "INDIGO", "INDUSINDBK", "INDUSTOWER", "INFY", "INTELLECT", "IOC", "IPCALAB", "IRCTC", "ITC", "JINDALSTEL", "JKCEMENT", "JSWSTEEL", "JUBLFOOD", "KOTAKBANK", "LALPATHLAB", "LAURUSLABS", "LICHSGFIN", "LT", "LTTS", "LUPIN", "MANAPPURAM", "MARICO", "MARUTI", "METROPOLIS", "MFSL", "MGL", "MSUMI", "MOTHERSON", "MPHASIS", "MRF", "MUTHOOTFIN", "NAM-INDIA", "NATIONALUM", "NAUKRI", "NAVINFLUOR", "NESTLEIND", "NMDC", "NTPC", "OBEROIRLTY", "OFSS", "ONGC", "PAGEIND", "PEL", "PERSISTENT", "PETRONET", "PFC", "PIDILITIND", "PIIND", "PNB", "POLYCAB", "POWERGRID", "RAIN", "RAMCOCEM", "RBLBANK", "RECLTD", "RELIANCE", "SAIL", "SBICARD", "SBILIFE", "SBIN", "SHREECEM", "SIEMENS", "SRF", "SUNPHARMA", "SUNTV", "SYNGENE", "TATACHEM", "TATACOMM", "TATACONSUM", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TCS", "TECHM", "TITAN", "TORNTPHARM", "TORNTPOWER", "TRENT", "TVSMOTOR", "UBL", "ULTRACEMCO", "UPL", "VEDL", "VOLTAS", "WHIRLPOOL", "WIPRO", "ZEEL", "ZYDUSLIFE"]

    const onSubscribe = async (e) => {
        setLoading(true)

        await axios.post(`${apiUrl}subscribe_telegram`, {
            user: isAuth?.userId, quantity, name: item, symbols
        }, {
            headers: {
                'Content-Type': 'application/json',
                jwttoken: isAuth.jwt,
                userid: isAuth.userId,
            },
        }).then(async (r) => {
            setId(r.data.data.id)
            await getListData()

            await axios.post(`${apiUrl}place_order_by_telegram`, {
                id: r.data.data.id, user: isAuth?.userId, quantity, name: item, symbols
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    jwttoken: isAuth.jwt,
                    userid: isAuth.userId,
                },
            });
        }).finally(() => { setLoading(false) })
    }

    const onUnsubscribe = async (e) => {
        setLoading(true)

        await fetch(
            `${apiUrl}subscribe_telegram`,
            {
                method: 'DELETE', // or 'GET', 'PUT', etc.
                headers: {
                    'Content-Type': 'application/json',
                    jwttoken: isAuth.jwt,
                    userid: isAuth.userId,
                },
                body: JSON.stringify({
                    id: id,
                }),
            }
        ).then(async () => {
            setId(null)
            await getListData()
        }).finally(() => { setLoading(false) });
    }

    const handleQuantityUpdate = async (newValue) => {
        await axios.put(
            `${apiUrl}subscribe_telegram`,
            {
                id,
                to_update: newValue
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    jwttoken: isAuth.jwt,
                    userid: isAuth.userId,
                },
            }
        )

    };

    return (
        <div className={styles.listItem}>
            <p>{item}</p>
            <div className={styles.listBtn}>
                <ReactSelect
                    isMulti

                    onChange={(e) => {
                        const val = e.map(i => i?.value)

                        id &&
                            handleQuantityUpdate({
                                symbols:
                                    val.join(",")
                            })

                        setSymbols(val.join(","))
                    }}
                    options={symb?.map(it => ({ label: it, value: it }))}
                />
                <input
                    type='number'
                    value={
                        quantity
                    }
                    onChange={(
                        e
                    ) => {
                        id &&
                            handleQuantityUpdate({
                                quantity:
                                    e
                                        .target
                                        .value,
                            })

                        setQuantity(e.target.value)
                    }}
                    className='form-control py-2'
                    style={{
                        width: 100
                    }}
                />
                <button onClick={id ? onUnsubscribe : onSubscribe}>{id ? "Unsubscribe" : "Subscribe"}</button>
            </div>
        </div>)
}

export default Telegram