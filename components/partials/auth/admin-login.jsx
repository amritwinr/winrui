import React, { useState } from "react"
import Textinput from "@/components/ui/Textinput"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { handleLogin } from "./store"
import { toast } from "react-toastify"
import ForgotPass from "./forgot-pass"
import RegForm from "./reg-from"
import { url } from "@/constants"
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required()
const AdminForm = () => {
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.auth)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  })
  const router = useRouter()
  const onSubmit = async (data) => {
    let body = {
      email: data.email,
      password: data.password,
    }
    try {
      const response = await fetch(
        `${url}/api/user/admin_login`,
        {
          method: "POST", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body), // Send the form data to the API
        }
      )


      if (response.ok) {
        const data = await response.json()
        console.log(data)
        dispatch(handleLogin(data.data))
        setTimeout(() => {
          router.push("/admin/request")
        }, 1500)

      } else {
        const errorResponse = await response.json()
        const { errorCode, errorMessage } = errorResponse
        throw new Error(errorMessage || "An error occurred. Please try again.")
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }
    // if (user) {
    //   dispatch(handleLogin(true));
    //   setTimeout(() => {
    //     router.push("/analytics");
    //   }, 1500);
    // } else {
    //   toast.error("Invalid credentials", {
    //     position: "top-right",
    //     autoClose: 1500,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // }
  }

  const [checked, setChecked] = useState(false)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="email"
        placeholder="Enter Admin Email"
        register={register}
        error={errors?.email}
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        placeholder="Enter Password"
        register={register}
        error={errors.password}
      />

      <button className="btn btn-dark block w-full text-center">Sign in</button>
    </form>
  )
}

export default AdminForm
