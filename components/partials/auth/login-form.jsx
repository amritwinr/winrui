import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react";
const schema = yup
  .object({
    email: yup.string(),
    password: yup.string().required("Password is Required"),
    newPassword: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters"),
    // confirm password
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  })
  .required();

const API_URL = 'http://18.209.171.138:8000' ;

const LoginForm = () => {
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
    let body = {
      username: data.email,
      password: data.password,
    };
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST", // or 'GET', 'PUT', etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Send the form data to the API
      });
      setLoading(false);

      if (response.status == 400) {
        const data = await response.json();
        toast.error("Please verify your E-Mail", {
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
        }, 1500);

        return;
      }

      if (response.status == 404) {
        const data = await response.json();
        toast.error("Invalid Username and Password", {
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
      }

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data?.data?.jwt) {
          dispatch(handleLogin(data.data));
          setTimeout(() => {
            router.push("/broker");
          }, 1500);
        } else if (data?.data?.newToken) {
          setNewData(data?.data);
        }
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
  const changePasswordSubmit = async (data) => {
    console.log(data);
    let body = {
      old_password: data.currentPassword,
      new_password: data.newPassword,
    };
    try {
      const response = await fetch(`${API_URL}/api/user/new_pass`, {
        method: "POST", // or 'GET', 'PUT', etc.
        headers: {
          "Content-Type": "application/json",
          newToken: newData?.newToken,
          userId: newData?.userId,
        },
        body: JSON.stringify(body), // Send the form data to the API
      });
      if (response.ok) {
        const data = await response.json();
        setChangePassword(false);
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
      {!changePassword ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="email"
            label="user name"
            type="text"
            placeholder="Enter User Name"
            register={register}
          />

          <Textinput
            name="password"
            label="password"
            type="password"
            placeholder="Enter Password"
            register={register}
            hasicon={true}
            error={errors.password}
          />

          <Button
            text="Sign in"
            className="btn btn-dark block w-full text-center "
            isLoading={loading}
            type="submit"
            icon="solar:login-2-outline"
          />
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(changePasswordSubmit)}
          className="space-y-4"
        >
          <Textinput
            name="currentPassword"
            label="Current Password"
            type="password"
            register={register}
            autoComplete="off"
            placeholder="Enter Current Password"
            error={errors.currentPassword}
          />

          <Textinput
            name="newPassword"
            label="New Password"
            type="password"
            register={register}
            autoComplete="off"
            placeholder="Enter New Password"
            error={errors.newPassword}
          />

          <Textinput
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            register={register}
            autoComplete="off"
            placeholder="Confirm New Password"
            error={errors.confirmNewPassword}
          />

          <button
            className="btn btn-dark block w-full text-center"
            type="submit"
          >
            Change Password
          </button>
        </form>
      )}
    </>
  );
};

export default LoginForm;
