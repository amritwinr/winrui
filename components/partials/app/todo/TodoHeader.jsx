import React, { useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import Button from "@/components/ui/Button"
import { useForm } from "react-hook-form"
import Swicth from "@/components/ui/Switch"
import Draggable from "react-draggable"

const TodoHeader = ({ onSubmit, id }) => {
  const [mainAccount, setMainAccount] = useState(false);

  const schema = yup
    .object({
      broker_user_id: yup.string().required("User id is Required"),
      totp_encrypt_key: yup.string().required("Password is Required"),
      two_fa: yup.string().required("TWOTA  is Required"),
      mpin: yup.string().required("MPIN  is Required"),
      broker_api_key: yup.string().required("API_KEY  is Required"),
    })
    .required()

  const schema2 = yup
    .object({
      broker_user_id: yup.string().required("User id is Required"),
      totp_encrypt_key: yup.string().required("Password is Required"),
      twoFA: yup.string().required("twoFA  is Required"),
      vc: yup.string().required("Vc is Required"),
      app_key: yup.string().required("App_key is Required"),
      imei: yup.string().required("Imei is Required"),
    })
    .required()


  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(id === 1 ? schema : schema2),
    //
    mode: "all",
  })
  const handleSave = async (data) => {
    onSubmit({ is_main: mainAccount, ...data, userId: id })
  }

  return (
    <div
      className="
    absolute
    md:flex justify-between items-center relative bg-black dark:bg-slate-800 top-0 z-[44] border-b border-slate-100 dark:border-slate-700 rounded-t-md
    "
    >
      <div className="">
        <Card isDraggable className="fixed right-20 bg-white">
          <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Textinput
                type="text"
                placeholder="User Id"
                register={register}
                name="broker_user_id"
                error={errors.broker_user_id}
              />
              <Textinput
                name="totp_encrypt_key"
                type="text"
                placeholder="Password"
                error={errors.totp_encrypt_key}
                register={register}
              />
              {id == 1 &&
                <Textinput
                  type="text"
                  placeholder="TWOTA"
                  name="two_fa"
                  error={errors.two_fa}
                  register={register}
                />
              }
              {id == 1 &&
                <Textinput
                  type="text"
                  name="mpin"
                  placeholder="MPIN"
                  error={errors.mpin}
                  register={register}
                />}
              {id == 1 &&
                <Textinput
                  type="text"
                  name="broker_api_key"
                  placeholder="API_KEY"
                  error={errors.broker_api_key}
                  register={register}
                />}
              {id == 2 &&
                <Textinput
                  type="text"
                  placeholder="twoFA"
                  name="twoFA"
                  error={errors.twoFA}
                  register={register}
                />
              }
              {id === 2 &&
                <Textinput
                  type="text"
                  name="vc"
                  placeholder="VC"
                  error={errors.vc}
                  register={register}
                />}
              {id === 2 &&
                <Textinput
                  type="text"
                  name="app_key"
                  placeholder="APP_KEY"
                  error={errors.app_key}
                  register={register}
                />}
              {id === 2 &&
                <Textinput
                  type="text"
                  name="imei"
                  placeholder="IMEI"
                  error={errors.imei}
                  register={register}
                />}

              <Swicth
                label="Main account"
                value={mainAccount}
                onChange={() => setMainAccount(!mainAccount)}
              />
            </div>

            <div className=" space-y-4">
              <Button text="Submit" type="submit" className="btn-dark btn-sm" />
            </div>
          </form>
        </Card>

      </div>
    </div>
  )
}

export default TodoHeader
