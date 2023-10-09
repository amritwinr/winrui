import React from 'react'
import styles from '@/Styles/modify.module.css'
import Draggable from 'react-draggable'

const Modify = ({ data, value, setValue, handleSaveClick }) => {
    return (
        <Draggable>
            <form className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveClick()
                }}>
                {Object.entries(data)?.map((item, i) => {
                    console.log(value[item[1]])
                    return (
                        <div className={styles.inputContainer}>
                            <label>{item[0]}</label>
                            {/* problem occurs here in value when we want to change data in showModify, first it takes defaultValue so that it detect same value as defaulValue when it changes */}
                            <input name={item[0]} key={i} value={value[item[1]]} placeholder={item[0]}
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