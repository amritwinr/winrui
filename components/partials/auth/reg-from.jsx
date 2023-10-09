import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const schema = yup.object({
  username: yup.string(),
  email: yup.string(),
  phone: yup.string(),
});

const API_URL = 'http://3.87.109.137:8000';

const RegForm = () => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    let body = {
      email: data?.email,
      phone: data?.phone,
      username: data?.username,
      password: data?.password,
    };
    try {
      const response = await fetch(`${API_URL}/api/user/user_request`, {
        method: "POST", // or 'GET', 'PUT', etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Send the form data to the API
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data.errorCode === 1) {
          toast.error("Email Already Registerd. Please Login", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          return;
        } else if (data.data.errorCode === 2) {
          toast.error("Username Already Taken. ", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          return;
        } else if (data.data.errorCode === 3) {
          toast.error("Phone Number Already Registerd. ", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          return;
        } else {
          toast.success("Registartion Successfully", {
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
            router.push("/verify");
            localStorage.setItem("email", body.email);
          }, 1500);
        }
      } else {
        const errorResponse = await response.json();
        const { errorCode, errorMessage } = errorResponse;
        throw new Error("An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error( "An error occurred. Please try again.", {
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
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <Textinput
        name="username"
        label="Username"
        type="text"
        placeholder=" Enter your User Name"
        register={register}
      />{" "}
      <Textinput
        name="email"
        label="email"
        type="email"
        placeholder=" Enter your email"
        register={register}
      />
      <Textinput
        name="phone"
        label="phone"
        type="text"
        placeholder=" Enter your phone"
        register={register}
      />
      <Textinput
        name="password"
        label="Password"
        type="password"
        hasicon={true}
        placeholder="Enter Your Password"
        register={register}
      />
      <button className="btn btn-dark block w-full text-center">
        Create an account
      </button>
    </form>
  );
};

export default RegForm;
