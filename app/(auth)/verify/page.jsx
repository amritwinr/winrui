"use client";

import React from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import VerifyUserForm from "@/components/partials/auth/verify-user";
import Social from "@/components/partials/auth/social";
import { ToastContainer } from "react-toastify";

const Verify = () => {
  const [isDark] = useDarkMode();

  return (
    <>
      <ToastContainer />
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
              <h4 className="mb-10">Winr</h4>

              <h4>
                Unlock your Project
                <span className="text-slate-800 dark:text-slate-400 font-bold uppercase">
                  {" "}
                  Performance
                </span>
              </h4>
            </div>
            <div className="absolute left-0 bottom-[-130px] h-full w-full z-[-1]">
              <img
                src="/assets/images/auth/ils1.svg"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="right-column relative bg-white dark:bg-slate-800">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link href="/">
                    <img
                      src={
                        isDark
                          ? "/assets/images/logo/logo-white.svg"
                          : "/assets/images/logo/logo.svg"
                      }
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-5">
                  <h4 className="font-medium">Verify E-mail</h4>
                  <div className="text-slate-500 dark:text-slate-400 text-base">
                    We sent OTP to your email address for verification{" "}
                  </div>
                </div>
                <VerifyUserForm />

               
              </div>
              <div className="auth-footer text-center">
                Copyright 2023, WinR All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verify;
