import React, { useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import Button from "@/components/ui/Button"
import { useForm } from "react-hook-form"
import Select from "@/components/ui/Select"

const TodoHeader = ({ onSubmit, id, broker, selectField }) => {

  const secondFieldsObject = broker?.filter(i => i?.short !== "type").reduce((accumulator, currentObject) => {
    const secondField = currentObject.short;
    accumulator[secondField] = yup.string().required(`${currentObject.title} is Required`);
    return accumulator;
  }, {});

  const schema = yup
    .object(secondFieldsObject)
    .required()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  })
  const handleSave = async (data) => {
    onSubmit({ ...data })
  }

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
              {broker?.filter(i => i?.short !== "type")?.map((item, i) => {
                return (
                  <Textinput
                    type="text"
                    placeholder={item?.title}
                    register={register}
                    name={item?.short}
                    error={errors[item?.short]}
                  />
                )
              })}
              {selectField &&
                <Select options={[
                  { label: "Finvasia", value: "Finvasia" },
                  { label: "Angel One", value: "Angel One" }
                ]}
                  placeholder="Select"
                  defaultValue="Finvasia"
                  register={register}
                  name="type" />
              }
            </div>

            <div className=" space-y-4">
              <Button text="Submit" type="submit" className="btn-dark btn-sm" />
            </div>
          </form>
        </Card>
    </div>
  )
}

export default TodoHeader
