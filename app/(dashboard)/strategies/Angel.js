'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SimpleBar from 'simplebar-react';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import Badge from '@/components/ui/Badge';
import useWidth from '@/hooks/useWidth';
import TodoHeader from '@/components/partials/app/todo/TodoHeader';
import axios from 'axios';
import { apiUrl } from '@/constants';
import Modify from '@/components/Broker/Modify';
import Swicth from '@/components/ui/Switch';

const ListLoading = dynamic(() => import('@/components/skeleton/ListLoading'), {
    ssr: false,
});

export const topFilterLists = [
    {
        name: 'Alice Blue',
        value: 'alice',
        checked: true,

        icon: 'uil:image-v',
    },
];

const AngelPage = ({ title }) => {
    const router = useRouter()
    const { isAuth } = useSelector((state) => state.auth);
    const user = isAuth?.userId

    const { width, breakpoints } = useWidth();
    const [showAdd, setShowAdd] = useState(false);
    const { mobileEmailSidebar, emails, search, filter, singleModal } =
        useSelector((state) => state.email);

    const [currentId, setCurrentId] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [currentBrokerData, setCurrentBrokerData] = useState([]);
    // this is to show popup when we press modify button
    const [showModify, setShowModify] = useState({ id: null, show: false, data: null })

    // here data comes from function handleInputValChange
    const [upData, setUpdata] = useState({})

    const api_url = apiUrl

    useEffect(() => {
        setLoading(true)
        if (isAuth?.userName !== "romil776") {
            setLoading(false)
            router?.replace('/not-found')
        }
        else {
            setLoading(false)
        }
    }, [isAuth, router])

    const brokerData = (arr) => currentBrokerData && currentBrokerData[1]
        ?.filter(item => !["id", "user", "created_at", "updated_at", "quantity", "status", "symbolNum"].includes(item)).map((item) => {
            return {
                title: item?.split("_")?.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), short: item,
                show: arr?.includes(item) ? true : false
            }
        })

    /* all broker details goes here, so we can define data dynamically, if anyone want to add more field just add that 
    field name as key in data array, and add that value from currentBrokerData[0].new_field. if you want to show in table then set show to true*/

    // this are dynamic urls for each api page
    const submitUri = `${api_url}add_romil_broker`;
    const updateQuantity = `${api_url}update_romil_broker_quantity`;
    const brokerHeading = brokerData(["upper_level", "lower_level", "symbol"])

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

    useEffect(() => {
        getBrokerData()
    }, [])

    // this is for getting data of accounts of current broker
    const getBrokerData = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${api_url}add_romil_broker`,
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
                            // status: "0"
                        },

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

    const handleUpdate = async (key, newVal, itemId) => {
        const updatedItems = currentBrokerData[0].map((item) =>
            item.id === itemId ? { ...item, [key]: newVal } : item
        );

        setCurrentBrokerData(prev => [updatedItems, prev[1]]);

        try {
            await fetch(
                submitUri,
                {
                    method: 'PUT', // or 'GET', 'PUT', etc.
                    headers: {
                        'Content-Type': 'application/json',
                        jwttoken: isAuth.jwt,
                        userid: isAuth.userId,
                    },
                    body: JSON.stringify({
                        id: itemId,
                        to_update: {
                            [key]: newVal,
                            // status: "0"
                        },

                    }),
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

        await axios.put(submitUri, {
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

        const url = `${api_url}strategy`
        await axios.post(url, {
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
                    handleSaveClick={handleSaveClick} />
            )}

            {showAdd && <TodoHeader onSubmit={onSubmit} id={2} selectField
                broker={brokerHeading}
            />}
            <ToastContainer />

            <div className='flex md:space-x-5 app_height  relative rtl:space-x-reverse'>

                {/* overlay */}
                {width < breakpoints.lg && mobileEmailSidebar && (
                    <div
                        className='overlay bg-slate-900 dark:bg-slate-900 dark:bg-opacity-60 bg-opacity-60 backdrop-filter
        				 backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md'
                    ></div>
                )}
                <div className='flex-1'>
                    <SimpleBar className='h-full all-todos'>

                        <Card
                            title="Strategy"
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
                                                <th
                                                    scope='col'
                                                    className=' table-th w-1/6 '
                                                >
                                                    Type
                                                </th>
                                                {brokerHeading?.filter(i => i?.show === true)?.map((item, i) => {
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
                                            </tr>
                                        </thead>
                                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700 '>
                                            {currentBrokerData &&
                                                currentBrokerData[0]?.map((value, index) => (
                                                    <tr className='hover:bg-hover '>
                                                        <td
                                                            scope='col'
                                                            className=' table-th w-1/6 '
                                                        >
                                                            {value["type"]}
                                                        </td>
                                                        {brokerHeading?.filter(i => i?.show === true && i?.short !== "symbol")?.map((item, i) => {
                                                            return (
                                                                <>
                                                                    <td className='table-td'>
                                                                        <div className=''>

                                                                            <input
                                                                                type='number'
                                                                                value={
                                                                                    value[item.short]
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    handleUpdate(
                                                                                        item?.short,
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
                                                                </>
                                                            )
                                                        })}

                                                        <td
                                                            scope='col'
                                                            className=' table-th w-1/6 '
                                                        >
                                                            {value["symbol"]}
                                                        </td>

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
                                                            {value?.status == '1' ? (
                                                                <div className='rounded-full bg-green-500 w-[10px] h-[10px] text-red-500'></div>
                                                            ) : (
                                                                <div className='rounded-full bg-red-500 w-[10px] h-[10px] text-red-500'></div>
                                                            )}
                                                        </td>

                                                        <td className='table-td '>
                                                            {' '}
                                                            <Swicth
                                                                value={value?.status == '1'}
                                                                onChange={() => handleCred(value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>

                    </SimpleBar>
                </div >
            </div >
        </>
    );
};

export default AngelPage;
