import React from 'react'
import styles from '@/Styles/modify.module.css'
import Draggable from 'react-draggable'
import ReactSelect from 'react-select'

const Modify = ({ data, value, setValue, handleSaveClick }) => {

    const excludeFields = ["id", "quantity", "status", "is_background_task_running"]
    return (
        <Draggable>
            <form className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveClick()
                }}>
                {Object.entries(data)?.filter(i => !excludeFields?.includes(i[0]))?.map((item, i) => {
                    return (
                        item[0] == "type" ?
                            <ReactSelect options={[
                                { label: "Finvasia", value: "Finvasia" },
                                { label: "Angel One", value: "Angel One" }
                            ]}
                                value={value[item[1]]}
                                onChange={val => {
                                    const v = {
                                        target: {
                                            value: val?.value
                                        }
                                    }
                                    setValue(item[0], v)
                                }}
                                // placeholder="Select"
                                defaultValue={item[1]}
                                name="type" /> :
                            <div className={styles.inputContainer}>
                                <label>{item[0]?.split("_")?.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</label>
                                {/* problem occurs here in value when we want to change data in showModify, first it takes defaultValue so that it detect same value as defaulValue when it changes */}
                                <input name={item[0]} key={i} value={value[item[1]]} placeholder={item[0]?.split("_")?.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                    defaultValue={item[1]}
                                    onChange={(e) => setValue(item[0], e)}
                                    className={styles.input} />
                            </div>
                    )
                })}

                <button type="submit" className={styles.save}>Save</button>
            </form>
        </Draggable>
    )
}

export default Modify