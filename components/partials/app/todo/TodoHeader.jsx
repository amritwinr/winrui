import React, { useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import Button from "@/components/ui/Button"
import { useForm } from "react-hook-form"
import Select from "@/components/ui/Select"
import ReactSelect from "react-select"

const TodoHeader = ({ onCancel, onSubmit, id, broker, removeKeys, selectOptions, }) => {
  const [selectData, setSelectData] = useState({

  })

  const secondFieldsObject = broker?.filter(i => !removeKeys?.includes(i?.short)).reduce((accumulator, currentObject) => {
    const secondField = currentObject.short;
    accumulator[secondField] = yup.string().required(`${currentObject.title} is Required`);
    return accumulator;
  }, {});

  const schema = yup
    .object().shape(secondFieldsObject)
    .required()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  })

  const handleSave = async (data) => {
    onSubmit({ ...data, ...selectData })
  }

  console.log(selectData)

  return (
    <div
      className="
    absolute
    md:flex justify-between items-center relative bg-black dark:bg-slate-800 top-0 z-[44] border-b border-slate-100 dark:border-slate-700 rounded-t-md
    "
    >
      <Card isDraggable className="fixed top-20 right-20 bg-white">
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {broker?.map((item, i) => {
              if (!removeKeys?.includes(item?.short)) {
                return (
                  <Textinput
                    type="text"
                    placeholder={item?.title}
                    register={register}
                    name={item?.short}
                    error={errors[item?.short]}
                  />
                )
              } else if (removeKeys?.length && removeKeys.includes(item?.short)) {
                return (
                  <ReactSelect
                    options={
                      selectOptions[item?.short]?.options?.map((it) => ({
                        label: it, value: it
                      }))
                    }
                    value={selectData[item?.short]}
                    placeholder={item?.short}
                    defaultValue={selectOptions[item?.short]?.default}
                    onChange={(e) => setSelectData(prev => ({ ...prev, [item?.short]: e.value }))}
                    name={item?.short} />
                )
              }
            })}
          </div>

          <div className=" space-y-4">
            <Button text="Submit" type="submit" className="btn-dark btn-sm" />
            <Button text="Cancel" onClick={() => onCancel && onCancel()} type="button" className="btn-grey btn-sm" />
          </div>
        </form>
      </Card>
    </div>
  )
}

export default TodoHeader
