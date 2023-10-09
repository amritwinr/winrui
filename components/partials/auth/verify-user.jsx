import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

require('dotenv').config()

const schema = yup
  .object({
    otp: yup.string().required("OTP required .Please Enter otp"),
  })
  .required();


const API_URL = process.env.NEXT_PUBLIC_NLP_API_URL



const VerifyUserForm = () => {
  const [changePassword, setChangePassword] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const router = useRouter();
  const [newData, setNewData] = useState();
  const onSubmit = async (data) => {
    const email = localStorage.getItem("email");

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/user/verify-email`,
        {
          method: "POST", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: data.otp,
          }), // Send the form data to the API
        }
      );

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        toast.success("Email Verified sucessfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        const errorResponse = await response.json();
        const { errorCode, errorMessage } = errorResponse;
        throw new Error(errorMessage || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const resendEmail = async (data) => {
    const email = localStorage.getItem("email");
    try {
      const response = await fetch(
        `${API_URL}/api/user/resend-email`,
        {
          method: "POST", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }), // Send the form data to the API
        }
      );
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        toast.success("OTP sent sucessfully. Please check your E-mail", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        const errorResponse = await response.json();
        const { errorCode, errorMessage } = errorResponse;
        throw new Error(errorMessage || "An error occurred. Please try again.");
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
      });
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textinput
          name="otp"
          label="Please Enter OTP"
          type="text"
          register={register}
          autoComplete="off"
          placeholder="22334"
          error={errors.otp}
        />

        <button className="btn btn-dark block w-full text-center" type="submit">
          Verify E-Mail
        </button>
      </form>
      <div className="max-w-[225px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-6 uppercase text-sm">
        Not Recived?{" "}
        <button
          className="text-slate-900 dark:text-white font-medium hover:underline"
          onClick={resendEmail}
        >
          Resend Email{" "}
        </button>
      </div>
    </>
  );
};

export default VerifyUserForm;
