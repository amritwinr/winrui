import React from 'react'
import styles from '@/Styles/modify.module.css'
import Draggable from 'react-draggable'
import ReactSelect from 'react-select'

const Modify = ({ data, value, setValue, handleSaveClick, removeKeys, selectOptions }) => {

    const excludeFields = ["id", "user", "quantity", "status", "is_background_task_running", "unique_code", "access_token"]
    return (
        <Draggable>
            <form className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveClick()
                }}>
                {Object.entries(data)?.map((item, i) => {
                    if (!excludeFields?.includes(item[0]) && !removeKeys?.includes(item[0])) {
                        return (
                            <div className={styles.inputContainer}>
                                <label>{item[0]?.split("_")?.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</label>
                                {/* problem occurs here in value when we want to change data in showModify, first it takes defaultValue so that it detect same value as defaulValue when it changes */}
                                <input name={item[0]} key={i} value={value[item[1]]} placeholder={item[0]?.split("_")?.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                    defaultValue={item[1]}
                                    onChange={(e) => setValue(item[0], e)}
                                    className={styles.input} />
                            </div>
                        )
                    } else if (removeKeys?.length > 0 && removeKeys?.includes(item[0])) {
                        return (
                            <div className={styles.inputContainer}>
                                <ReactSelect options={
                                    selectOptions[item[0]]?.options?.map((it) => ({
                                        label: it, value: it
                                    }))
                                }
                                   className={styles.selectBtn}
                                    value={value[item[1]]}
                                    onChange={val => {
                                        const v = {
                                            target: {
                                                value: val?.value
                                            }
                                        }
                                        setValue(item[0], v)
                                    }}
                                    placeholder={item[0]?.split("_")?.join(" ")?.toUpperCase()}
                                    defaultValue={item[1]}
                                    name="type" />
                            </div>
                        )
                    }
                })}

                <button type="submit" className={styles.save}>Save</button>
            </form>
        </Draggable>
    )
}

export default Modify