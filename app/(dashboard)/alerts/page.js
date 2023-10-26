'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { bottomFilterLists } from '@/constant/data';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SimpleBar from 'simplebar-react';
import { useSelector, useDispatch } from 'react-redux';
import {
    toggleMobileEmailSidebar,
    toggleEmailModal,
    setFilter,
    setSearch,
} from '@/components/partials/app/email/store';
import { Icon } from '@iconify/react';

import { ToastContainer, toast } from 'react-toastify';
import Badge from '@/components/ui/Badge';
import useWidth from '@/hooks/useWidth';
import Swicth from '@/components/ui/Switch';
import TodoHeader from '@/components/partials/app/todo/TodoHeader';
import axios from 'axios';
import { apiUrl } from '@/constants';
import Modify from '@/components/Broker/Modify';

const ListLoading = dynamic(() => import('@/components/skeleton/ListLoading'), {
    ssr: false,
});

const Topfilter = dynamic(
    () => import('@/components/partials/app/email/Topfilter'),
    {
        ssr: false,
    }
);

export const topFilterLists = [
    {
        name: 'Alice Blue',
        value: 'alice',
        checked: true,

        icon: 'uil:image-v',
    },
];

const Alert = () => {
    const { isAuth } = useSelector((state) => state.auth);
    const user = isAuth?.userId

    const { width, breakpoints } = useWidth();
    const dispatch = useDispatch();
    const [showAdd, setShowAdd] = useState(false);
    const { mobileEmailSidebar, emails, search, filter, singleModal } =
        useSelector((state) => state.email);

    const [currentId, setCurrentId] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState('');
    const [currentBrokerData, setCurrentBrokerData] = useState('');
    const [uniqueCode, setUniqueCode] = useState('');
    const [brokersLoadind, setBrokersLoadind] = useState(false);
    // this is to show popup when we press modify button
    const [showModify, setShowModify] = useState({ id: null, show: false, data: null })

    // here data comes from function handleInputValChange
    const [upData, setUpdata] = useState({})

    const api_url = apiUrl

    const brokerData = (arr) => currentBrokerData && currentBrokerData[1]
        ?.filter(item => !["id", "user", "created_at", "updated_at", "is_main", "quantity", "status", "access_token"].includes(item)).map((item) => {
            return {
                title: item?.split("_")?.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), short: item,
                show: arr?.includes(item) ? true : false
            }
        })

    /* all broker details goes here, so we can define data dynamically, if anyone want to add more field just add that 
    field name as key in data array, and add that value from currentBrokerData[0].new_field. if you want to show in table then set show to true*/
    const broker_details = [
        {
            id: 1,
            broker: "Alice blue",
            submitData: `${api_url}add_broker_creds`,
            updateQuantity: `${api_url}update_broker_quantity`,
            place_order: `${api_url}place_orders_by_master`,
            data: brokerData(["broker_user_id", "broker_api_key"])
        },
        {
            id: 2,
            broker: "Finvasia",
            submitData: `${api_url}add_finvasia_trading_view`,
            getBrokerData: `${api_url}add_finvasia_broker_creds`,
            updateQuantity: `${api_url}update_finvasia_trading_view`,
            data: brokerData(["symbol", "exchange"])

        },
        {
            id: 3,
            broker: "Angel One",
            submitData: `${api_url}add_angel_broker_creds`,
            updateQuantity: `${api_url}update_angel_broker_quantity`,
            place_order: `${api_url}place_order_by_angel_master`,
            data: brokerData(["user_id", "api_key"])
        },
        {
            id: 4,
            broker: "Upstox",
            submitData: `${api_url}add_upstox_broker_creds`,
            updateQuantity: `${api_url}update_upstox_broker_quantity`,
            place_order: `${api_url}place_order_by_upstox_master`,
            data: brokerData(["user_id", "api_key"])
        },
        {
            id: 5,
            broker: "Fyers",
            submitData: `${api_url}add_fyers_broker_creds`,
            updateQuantity: `${api_url}update_fyers_broker_quantity`,
            place_order: `${api_url}place_order_by_fyers_master`,
            data: brokerData(["fy_id", "app_id"])
        },
        {
            id: 6,
            broker: "Flattrade",
            submitData: `${api_url}add_flattrade_broker_creds`,
            updateQuantity: `${api_url}update_flattrade_broker_quantity`,
            place_order: `${api_url}place_order_by_flattrade_master`,
            data: brokerData(["user_id", "api_key"])
        },
        {
            id: 7,
            broker: "5paisa",
            submitData: `${api_url}add_5paisa_broker_creds`,
            updateQuantity: `${api_url}update_5paisa_broker_quantity`,
            place_order: `${api_url}place_order_by_5paisa_master`,
            data: brokerData(["user_id", "app_name"])
        },
    ]

    // this are dynamic urls for each api page
    const submitUri = broker_details?.find(i => i?.broker === currentId[0]?.name)?.submitData
    const updateQuantity = broker_details?.find(i => i?.broker === currentId[0]?.name)?.updateQuantity
    const placeOrder = broker_details?.find(i => i?.broker === currentId[0]?.name)?.place_order

    /* this function is switches the is_background_running_task to 0 and 1 and if quantity changes and 
    if is_background_running_task is 0 then it sets all status of child accounts to 0 and then calls the getData function*/
    const handleSwitchChange = async (id, name, type) => {
        // this is to check that current broker is same as switched broker
        if (currentBrokerData.length === 0 || currentId[0].name !== name) return;

        const updatedSwitches = (type == "toggle" ? data?.map((sw) =>
            sw.id === id
                ? { ...sw, user_status: sw.user_status == 1 ? 0 : 1 }
                : sw
        ) : []);
        if (type == "toggle") {
            setData(updatedSwitches);
        }


        const swicth_status = updatedSwitches?.find((e) => e.id === id)?.user_status

        // this checks that if this is 0 then sets all status to 0
        if (swicth_status === 0) {
            await axios.put(submitUri, {
                updateType: "many",
                status: '0',
                user
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    jwttoken: isAuth.jwt,
                    userid: isAuth.userId,
                },
            }).then(() => {
                getBrokerData(currentId[0]?.name);
            })
        } else {
            try {
                const x = data.find((e) => e.id === id);

                const response = await axios.post(
                    placeOrder,
                    {
                        type: "login",
                        broker_name: x.name,
                        user: user
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            jwttoken: isAuth.jwt,
                            userid: isAuth.userId,
                        },
                    }
                );



                if (response) {
                    getBrokerData(currentId[0].name)
                    const data = await response.json();
                    toast.success(data.data.message, {
                        position: 'top-right',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored',
                    });
                } else {
                    const errorResponse = await response.json();
                    const { errorCode, errorMessage } = errorResponse;
                    throw new Error(
                        errorMessage || 'An error occurred. Please try again.'
                    );
                }
            } catch (error) {
                toast.error(
                    error.message || 'An error occurred. Please try again.',
                    {
                        position: 'top-right',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored',
                    }
                );

            }
        }

    };

    // this is to get broker list data
    const getData = async () => {
        setBrokersLoadind(true);
        try {
            const response = await fetch(
                `${api_url}broker_list`,
                {
                    method: 'GET', // or 'GET', 'PUT', etc.
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                }
            );
            setBrokersLoadind(false);

            if (response.ok) {
                const data = await response.json();
                setData(data?.data);
            } else {
                const errorResponse = await response.json();
                const { errorCode, errorMessage } = errorResponse;
                throw new Error(
                    errorMessage || 'An error occurred. Please try again.'
                );
            }
        } catch (error) {
            toast.error(
                error.message || 'An error occurred. Please try again.',
                {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                }
            );
        }
    };

    useEffect(() => {
        getData();

        if (width < breakpoints.lg && mobileEmailSidebar) {
            dispatch(toggleMobileEmailSidebar(false));
        }
    }, [filter, breakpoints.lg]);

    // this is to submit data for each selected broker
    const onSubmit = async (data) => {
        try {
            const response = await fetch(
                submitUri,
                {
                    method: 'POST', // or 'GET', 'PUT', etc.
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                    body: JSON.stringify({
                        user,
                        ...data,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setShowAdd(false);
                getBrokerData(currentId[0]?.name);
            } else {
                const errorResponse = await response.json();
                const { errorCode, errorMessage } = errorResponse;
                throw new Error(
                    errorMessage || 'An error occurred. Please try again.'
                );
            }
        } catch (error) {
            toast.error(
                error.message || 'An error occurred. Please try again.',
                {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                }
            );
        }
    };

    // this is for getting data of accounts of current broker
    const getBrokerData = async (name) => {
        setLoading(true);
        const queryParams = new URLSearchParams({
            broker_name: name,
        });

        try {
            const uri = broker_details?.find(i => i?.broker === name)?.submitData
            const response = await fetch(
                `${uri}?user=${user}`,
                {
                    method: 'GET', // or 'GET', 'PUT', etc.
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                }
            );

            const getBrokerData = broker_details?.find(i => i?.broker === name)?.getBrokerData
            const response2 = await fetch(
                `${getBrokerData}?user=${user}`,
                {
                    method: 'GET', // or 'GET', 'PUT', etc.
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                }
            );

            if (response.ok) {
                const uc = await response2.json()
                setUniqueCode(uc?.data[0][0]?.unique_code)

                const data = await response.json();
                setCurrentBrokerData(data?.data);
            } else {
                const errorResponse = await response.json();
                const { errorCode, errorMessage } = errorResponse;
                throw new Error(
                    errorMessage || 'An error occurred. Please try again.'
                );
            }
            setLoading(false);


        } catch (error) {
            toast.error(
                error.message || 'An error occurred. Please try again.',
                {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                }
            );
        }
    };

    // this is to modify data of selected account of selected broker
    const handleSaveClick = async () => {
        try {
            const modificationDetails = broker_details?.find(i => i?.broker === currentId[0]?.name)?.modfiy;
            const response = await fetch(
                submitUri,
                {
                    method: 'PUT', // or 'GET', 'PUT', etc.
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                    body: JSON.stringify({
                        id: showModify?.data?.id,
                        to_update: {
                            ...upData,
                            status: "0"
                        },
                        // broker_user_id: showModify?.data?.broker_user_id,
                        ...modificationDetails
                    }),
                }
            );

            if (response.ok) {
                setUpdata({})
                const data = await response.json();
                setShowModify({ id: null, show: false, data: null })
                getBrokerData(currentId[0]?.name);
            } else {
                const errorResponse = await response.json();
                const { errorCode, errorMessage } = errorResponse;
                throw new Error(
                    errorMessage || 'An error occurred. Please try again.'
                );
            }

        } catch (error) {
            toast.error(
                error.message || 'An error occurred. Please try again.',
                {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                }
            );
        }
        // After successful save, you can toggle the edit mode off and update the actual data

    };

    // this is to delete account ot selected broker
    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                submitUri,
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
            );

            if (response.ok) {
                const data = await response.json();

                getBrokerData(currentId[0]?.name);
            } else {
                const errorResponse = await response.json();
                const { errorCode, errorMessage } = errorResponse;
                throw new Error(
                    errorMessage || 'An error occurred. Please try again.'
                );
            }

        } catch (error) {
            toast.error(
                error.message || 'An error occurred. Please try again.',
                {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                }
            );
        }
    };

    // it changes the quantity of selected account of selected broker
    const handleQuantityUpdate = async (newQuantity, itemId) => {
        const updatedItems = currentBrokerData[0].map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        setCurrentBrokerData(prev => [updatedItems, prev[1]]);

        try {
            await axios.post(
                updateQuantity,
                {
                    id: itemId,
                    quantity: newQuantity,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                }
            ).then((response) => {
                console.log({ response })
                if (response.status == 200) {

                } else {
                    const errorResponse = response.data.errorMessage;
                    throw new Error(
                        errorResponse || 'An error occurred. Please try again.'
                    );
                }
            });

        }
        catch (error) {
            toast.error(
                error.message || 'An error occurred. Please try again.',
                {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                }
            );
        }
    };

    // when we modify data in every input then it updates the object upData
    const handleInputValChange = (fieldName, e) => {
        setUpdata({
            ...upData,
            [fieldName]: e.target.value,
        });
    };

    /*this is to handle credentials of accounts of selected broker, when we turn switch on it checks and if success,
    then it switch the status button to 0 and 1 */
    const handleCred = async (value) => {
        const url = `${api_url}check_credentials`
        await axios.post(url, {
            type: currentId[0].name,
            ...value
        }, {
            headers: {
                'Content-Type': 'application/json',
                jwttoken: isAuth.jwt,
                userid: isAuth.userId,
            },
        }).then(async (r) => {
            // console.log({ data: r.data?.errorMessage })
            if (r.status === 200) {
                toast.success(
                    r.data?.errorMessage || 'Success',
                    {
                        position: 'top-right',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored',
                    }
                );

                const uri = submitUri

                await axios.put(uri, {
                    id: value?.id,
                    to_update: {
                        status: value?.status === '1' ? '0' : '1'
                    },
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                }).then((r) => {
                    getBrokerData(currentId[0]?.name);
                })

            } else {
                toast.error(
                    r.data?.errorMessage || 'Credentials are not correct',
                    {
                        position: 'top-right',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored',
                    }
                );
            }
        }).catch(err => {
            toast.error(
                err.message || 'Something error',
                {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                }
            );
        })
    }

    return (
        <>
            {showModify?.id !== null && (
                <Modify data={showModify?.data}
                    value={upData}
                    setValue={(item, e) => handleInputValChange(item, e)}
                    removeKeys={["symbol", "strike_type", "buy_sell"]}
                    selectOptions={{
                        "symbol": {
                            default: "NIFTY BANK",
                            options: ["NIFTY BANK", "SBIN", "AARTIIND", "ABB", "ABBOTINDIA", "ABCAPITAL", "ABFRL", "ACC", "ADANIENT", "ADANIPORTS", "ALKEM", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE", "ASHOKLEY", "ASIANPAINT", "ASTRAL", "ATUL", "AUBANK", "AUROPHARMA", "AXISBANK", "BAJAJ-AUTO", "BAJAJFINSV", "BAJFINANCE", "BALKRISIND", "BALRAMCHIN", "BANDHANBNK", "BANKBARODA", "BATAINDIA", "BEL", "BERGEPAINT", "BHARATFORG", "BHARTIARTL", "BHEL", "BIOCON", "BOSCHLTD", "BPCL", "BRITANNIA", "BSOFT", "CANBK", "CANFINHOME", "CHAMBLFERT", "CHOLAFIN", "CIPLA", "COALINDIA", "COFORGE", "COLPAL", "CONCOR", "COROMANDEL", "CROMPTON", "CUB", "CUMMINSIND", "DABUR", "DALBHARAT", "DEEPAKNTR", "DELTACORP", "DIVISLAB", "DIXON", "DLF", "DRREDDY", "EICHERMOT", "ESCORTS", "EXIDEIND", "FEDERALBNK", "FSL", "GAIL", "GLENMARK", "GMRINFRA", "GNFC", "GODREJCP", "GODREJPROP", "GRANULES", "GRASIM", "GSPL", "GUJGASLTD", "HAL", "HAVELLS", "HCLTECH", "HDFCAMC", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDCOPPER", "HINDPETRO", "HINDUNILVR", "HONAUT", "IBULHSGFIN", "ICICIBANK", "ICICIGI", "ICICIPRULI", "IDEA", "IDFC", "IDFCFIRSTB", "IEX", "IGL", "INDHOTEL", "INDIACEM", "INDIAMART", "INDIGO", "INDUSINDBK", "INDUSTOWER", "INFY", "INTELLECT", "IOC", "IPCALAB", "IRCTC", "ITC", "JINDALSTEL", "JKCEMENT", "JSWSTEEL", "JUBLFOOD", "KOTAKBANK", "LALPATHLAB", "LAURUSLABS", "LICHSGFIN", "LT", "LTTS", "LUPIN", "MANAPPURAM", "MARICO", "MARUTI", "METROPOLIS", "MFSL", "MGL", "MSUMI", "MOTHERSON", "MPHASIS", "MRF", "MUTHOOTFIN", "NAM-INDIA", "NATIONALUM", "NAUKRI", "NAVINFLUOR", "NESTLEIND", "NMDC", "NTPC", "OBEROIRLTY", "OFSS", "ONGC", "PAGEIND", "PEL", "PERSISTENT", "PETRONET", "PFC", "PIDILITIND", "PIIND", "PNB", "POLYCAB", "POWERGRID", "RAIN", "RAMCOCEM", "RBLBANK", "RECLTD", "RELIANCE", "SAIL", "SBICARD", "SBILIFE", "SBIN", "SHREECEM", "SIEMENS", "SRF", "SUNPHARMA", "SUNTV", "SYNGENE", "TATACHEM", "TATACOMM", "TATACONSUM", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TCS", "TECHM", "TITAN", "TORNTPHARM", "TORNTPOWER", "TRENT", "TVSMOTOR", "UBL", "ULTRACEMCO", "UPL", "VEDL", "VOLTAS", "WHIRLPOOL", "WIPRO", "ZEEL", "ZYDUSLIFE"],
                        },
                        "strike_type": {
                            default: "Auto",
                            options: ["Auto", "Manual"],
                        },
                        "buy_sell": {
                            default: "",
                            options: ["Blank", "buy", "sell"]
                        },
                    }}
                    handleSaveClick={handleSaveClick} />
            )}

            {showAdd && <TodoHeader onSubmit={onSubmit}
                broker={broker_details?.find(i => i?.id === currentId[0]?.id)?.data}
                removeKeys={["symbol", "strike_type", "buy_sell"]}
                selectOptions={{
                    "symbol": {
                        default: "NIFTY BANK",
                        options: ["NIFTY BANK", "SBIN", "AARTIIND", "ABB", "ABBOTINDIA", "ABCAPITAL", "ABFRL", "ACC", "ADANIENT", "ADANIPORTS", "ALKEM", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE", "ASHOKLEY", "ASIANPAINT", "ASTRAL", "ATUL", "AUBANK", "AUROPHARMA", "AXISBANK", "BAJAJ-AUTO", "BAJAJFINSV", "BAJFINANCE", "BALKRISIND", "BALRAMCHIN", "BANDHANBNK", "BANKBARODA", "BATAINDIA", "BEL", "BERGEPAINT", "BHARATFORG", "BHARTIARTL", "BHEL", "BIOCON", "BOSCHLTD", "BPCL", "BRITANNIA", "BSOFT", "CANBK", "CANFINHOME", "CHAMBLFERT", "CHOLAFIN", "CIPLA", "COALINDIA", "COFORGE", "COLPAL", "CONCOR", "COROMANDEL", "CROMPTON", "CUB", "CUMMINSIND", "DABUR", "DALBHARAT", "DEEPAKNTR", "DELTACORP", "DIVISLAB", "DIXON", "DLF", "DRREDDY", "EICHERMOT", "ESCORTS", "EXIDEIND", "FEDERALBNK", "FSL", "GAIL", "GLENMARK", "GMRINFRA", "GNFC", "GODREJCP", "GODREJPROP", "GRANULES", "GRASIM", "GSPL", "GUJGASLTD", "HAL", "HAVELLS", "HCLTECH", "HDFCAMC", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDCOPPER", "HINDPETRO", "HINDUNILVR", "HONAUT", "IBULHSGFIN", "ICICIBANK", "ICICIGI", "ICICIPRULI", "IDEA", "IDFC", "IDFCFIRSTB", "IEX", "IGL", "INDHOTEL", "INDIACEM", "INDIAMART", "INDIGO", "INDUSINDBK", "INDUSTOWER", "INFY", "INTELLECT", "IOC", "IPCALAB", "IRCTC", "ITC", "JINDALSTEL", "JKCEMENT", "JSWSTEEL", "JUBLFOOD", "KOTAKBANK", "LALPATHLAB", "LAURUSLABS", "LICHSGFIN", "LT", "LTTS", "LUPIN", "MANAPPURAM", "MARICO", "MARUTI", "METROPOLIS", "MFSL", "MGL", "MSUMI", "MOTHERSON", "MPHASIS", "MRF", "MUTHOOTFIN", "NAM-INDIA", "NATIONALUM", "NAUKRI", "NAVINFLUOR", "NESTLEIND", "NMDC", "NTPC", "OBEROIRLTY", "OFSS", "ONGC", "PAGEIND", "PEL", "PERSISTENT", "PETRONET", "PFC", "PIDILITIND", "PIIND", "PNB", "POLYCAB", "POWERGRID", "RAIN", "RAMCOCEM", "RBLBANK", "RECLTD", "RELIANCE", "SAIL", "SBICARD", "SBILIFE", "SBIN", "SHREECEM", "SIEMENS", "SRF", "SUNPHARMA", "SUNTV", "SYNGENE", "TATACHEM", "TATACOMM", "TATACONSUM", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TCS", "TECHM", "TITAN", "TORNTPHARM", "TORNTPOWER", "TRENT", "TVSMOTOR", "UBL", "ULTRACEMCO", "UPL", "VEDL", "VOLTAS", "WHIRLPOOL", "WIPRO", "ZEEL", "ZYDUSLIFE"],
                    },
                    "strike_type": {
                        default: "Auto",
                        options: ["Auto", "Manual"],
                    },
                    "buy_sell": {
                        default: "",
                        options: ["Blank", "buy", "sell"]
                    },
                }}
            />}
            <ToastContainer />

            <div className='flex md:space-x-5 app_height  relative rtl:space-x-reverse'>
                <div
                    className={`transition-all duration-150 flex-none min-w-[260px] 
        			${width < breakpoints.lg
                            ? 'absolute h-full top-0 md:w-[260px] w-[200px] z-[999]'
                            : 'flex-none min-w-[260px]'
                        }
        			${width < breakpoints.lg && mobileEmailSidebar
                            ? 'left-0 '
                            : '-left-full '
                        }
        			`}
                >
                    <Card
                        bodyClass=' py-6 h-full flex flex-col'
                        className='h-full bg-background'
                    >
                        {brokersLoadind && <ListLoading count={3} />}
                        {!brokersLoadind && (
                            <SimpleBar className='h-full px-6 '>
                                <ul className='list mt-2'>
                                    {data &&
                                        data?.map((item, i) => (
                                            <Topfilter
                                                enableSwitch={null}
                                                item={item}
                                                key={i}
                                                filter={currentId[0]?.id}
                                                handleSwitchChange={
                                                    handleSwitchChange
                                                }
                                                onClick={() => {
                                                    setShowAdd(false)
                                                    setCurrentId([item]);
                                                    getBrokerData(item?.name);
                                                }}
                                            />
                                        ))}
                                </ul>

                            </SimpleBar>
                        )}
                    </Card>
                </div>

                {/* overlay */}
                {width < breakpoints.lg && mobileEmailSidebar && (
                    <div
                        className='overlay bg-slate-900 dark:bg-slate-900 dark:bg-opacity-60 bg-opacity-60 backdrop-filter
        				 backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md'
                    ></div>
                )}
                <div className='flex-1'>
                    <SimpleBar className='h-full all-todos'>
                        {currentId ? (
                            <>
                                <Card
                                    title={currentId[0]?.name}
                                    noborder
                                    className='app_height bg-background overflow-x-scroll'
                                    headerslot={
                                        <div className='relative'>
                                            <Button
                                                onClick={() => setShowAdd(prev => !prev)}
                                            >
                                                add
                                            </Button>

                                        </div>
                                    }
                                >
                                    {isLoading && <ListLoading count={3} />}
                                    {!isLoading && (
                                        <div className='divide-y divide-slate-100 dark:divide-slate-700 -mb-6 h-full'>
                                            <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                                                <thead className=' border-t border-slate-100 dark:border-slate-800'>
                                                    <tr>
                                                        {broker_details?.find((i) => i.id === currentId[0].id).data?.filter(i => i?.show === true)?.map((item, i) => {
                                                            return (
                                                                <th
                                                                    key={i}
                                                                    scope='col'
                                                                    className=' table-th w-1/6 '
                                                                >
                                                                    {item?.title}
                                                                </th>
                                                            )
                                                        })}
                                                        <th
                                                            scope='col'
                                                            className=' table-th w-1/6 '
                                                        >
                                                            Quantity
                                                        </th>

                                                        <th
                                                            scope='col'
                                                            className=' table-th '
                                                        >
                                                            Modify
                                                        </th>

                                                        <th
                                                            scope='col'
                                                            className=' table-th '
                                                        >
                                                            Delete
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className=' table-th '
                                                        >
                                                            Copy
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700 '>
                                                    {currentBrokerData &&
                                                        currentBrokerData[0]?.filter(item => item?.user == user)?.map((value, index) => (
                                                            <tr className='hover:bg-hover '>
                                                                {broker_details?.find((i) => i.id === currentId[0].id).data?.filter(i => i?.show === true)?.map((item, i) => {

                                                                    return (
                                                                        <td
                                                                            key={i}
                                                                            scope='col'
                                                                            className=' table-th w-1/6 '
                                                                        >
                                                                            {value[item.short]}
                                                                        </td>
                                                                    )
                                                                })}

                                                                <td className='table-td'>
                                                                    <div className=''>

                                                                        <input
                                                                            type='number'
                                                                            value={
                                                                                value?.quantity
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                handleQuantityUpdate(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    value?.id
                                                                                );
                                                                            }}
                                                                            className='form-control py-2 '
                                                                        />

                                                                    </div>
                                                                </td>
                                                                <td className='table-td'>

                                                                    <Badge
                                                                        className='bg-success-500 text-white cursor-pointer'
                                                                        onClick={() => {
                                                                            const oppIndex = showModify?.id !== index
                                                                            // this are two variables for changing data when we first set index and value to setModify, 
                                                                            // and then press other modify button without pressing cancel button, then data changes in showModify,
                                                                            // but problem occurs in input value of modify form
                                                                            const changeOppIndex = (oppIndex ? index : null)
                                                                            const changeOppVal = (oppIndex ? value : null)

                                                                            setShowModify(prev => (
                                                                                {
                                                                                    id: prev?.id === null ? index : null,
                                                                                    data: prev?.data === null ? value : null
                                                                                }
                                                                            ))
                                                                        }}
                                                                    >
                                                                        {/* due to unchangable data cancel button appear on every account, and cancel modify form when we
																			click on any cancel button, to modify other account data, first cancel it, and then select that data */}
                                                                        {showModify?.id === index ? 'Cancel' : 'Modify'}
                                                                    </Badge>

                                                                </td>
                                                                <td className='table-td'>
                                                                    <Badge
                                                                        className='bg-danger-500 text-white cursor-pointer'
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                value?.id
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </Badge>
                                                                </td>
                                                                <td className='table-td '>
                                                                    {value?.is_main ? (
                                                                        <Icon
                                                                            icon='mdi:administrator-outline'
                                                                            color='#ffc300'
                                                                            width='25'
                                                                        />
                                                                    ) : (
                                                                        ''
                                                                    )}
                                                                </td>

                                                                <td className='table-td '>
                                                                    {' '}
                                                                    <Button onClick={async () => {
                                                                        const keysToRemove = ["id", "status", "user"];
                                                                        function objectToQueryParams(obj, keysToRemove = []) {
                                                                            const queryParams = [];
                                                                            for (const key in obj) {
                                                                                if (obj.hasOwnProperty(key) && !keysToRemove.includes(key)) {
                                                                                    queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
                                                                                }
                                                                            }
                                                                            return queryParams.join("&");
                                                                        }

                                                                        // Create the URL with query parameters
                                                                        const baseUrl = `${apiUrl}tradingView`;
                                                                        const d = { unique_code: uniqueCode, ...currentBrokerData[0]?.find(item => item?.user == user) }
                                                                        const queryParamsString = objectToQueryParams(d, keysToRemove);
                                                                        const fullUrl = `${baseUrl}?${queryParamsString}`;

                                                                        if (typeof window !== "undefined") {
                                                                            await navigator.clipboard.writeText(fullUrl);
                                                                        }
                                                                        console.log(fullUrl)
                                                                    }}>Copy</Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </Card>
                            </>
                        ) : (
                            <Card className='app_height bg-background'>
                                Please Select a broker
                            </Card>
                        )}
                    </SimpleBar>
                </div >
            </div >
        </>
    );
};

export default Alert;
