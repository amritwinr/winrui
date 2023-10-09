import React, { useEffect, useState } from "react"
import Icon from "@/components/ui/Icon"
import SwitchDark from "./Tools/SwitchDark"
import HorizentalMenu from "./Tools/HorizentalMenu"
import useWidth from "@/hooks/useWidth"
import useSidebar from "@/hooks/useSidebar"
import useNavbarType from "@/hooks/useNavbarType"
import useMenulayout from "@/hooks/useMenulayout"
import useSkin from "@/hooks/useSkin"
import Logo from "./Tools/Logo"
import SearchModal from "./Tools/SearchModal"
import Profile from "./Tools/Profile"
import Notification from "./Tools/Notification"
import Message from "./Tools/Message"
import Language from "./Tools/Language"
import useRtl from "@/hooks/useRtl"
import useMobileMenu from "@/hooks/useMobileMenu"
import MonoChrome from "./Tools/MonoChrome"
import { useDispatch } from "react-redux"
import { handleLogout } from "@/components/partials/auth/store"
import { useSelector } from "react-redux"

const Header = ({ className = "custom-class" }) => {
  const dispatch = useDispatch()

  const [collapsed, setMenuCollapsed] = useSidebar()
  const { width, breakpoints } = useWidth()
  const [navbarType] = useNavbarType()
  const navbarTypeClass = () => {
    switch (navbarType) {
      case "floating":
        return "floating"
      case "sticky":
        return "sticky top-0 z-[999]"
      case "static":
        return "static"
      case "hidden":
        return "hidden"
      default:
        return "sticky top-0 z-[999]"
    }
  }
  const [menuType] = useMenulayout()
  const [skin] = useSkin()
  const [isRtl] = useRtl()

  const [mobileMenu, setMobileMenu] = useMobileMenu()
  const { isAuth, isAdmin } = useSelector((state) => state.auth)

  const [name, setName] = useState("")
  useEffect(() => {
    setName(isAuth.userName)
  }, [])
  const handleOpenMobileMenu = () => {
    setMobileMenu(!mobileMenu)
  }

  const borderSwicthClass = () => {
    if (skin === "bordered" && navbarType !== "floating") {
      return "border-b border-slate-200 dark:border-slate-700"
    } else if (skin === "bordered" && navbarType === "floating") {
      return "border border-slate-200 dark:border-slate-700"
    } else {
      return "dark:border-b dark:border-slate-700 dark:border-opacity-60"
    }
  }
  return (
    <header className={className + " " + navbarTypeClass()}>
      <div
        className={` app-header md:px-6 px-[15px]  dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white
        ${borderSwicthClass()}
             ${
               menuType === "horizontal" && width > breakpoints.xl
                 ? "py-1"
                 : "md:py-6 py-3"
             }
        `}
      >
        <div className="flex justify-between items-center h-full">
          {/* For Vertical  */}

          {menuType === "vertical" && (
            <div className="flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse">
              {collapsed && width >= breakpoints.xl && (
                <button
                  className="text-xl text-slate-900 dark:text-white"
                  onClick={() => setMenuCollapsed(!collapsed)}
                >
                  {isRtl ? (
                    <Icon icon="akar-icons:arrow-left" />
                  ) : (
                    <Icon icon="akar-icons:arrow-right" />
                  )}
                </button>
              )}
              {width < breakpoints.xl && <Logo />}
              {/* open mobile menu handlaer*/}
              {width < breakpoints.xl && width >= breakpoints.md && (
                <div
                  className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                  onClick={handleOpenMobileMenu}
                >
                  <Icon icon="heroicons-outline:menu-alt-3" />
                </div>
              )}
              {/* <SearchModal /> */}
            </div>
          )}
          {/* For Horizontal  */}
          {menuType === "horizontal" && (
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Logo />
              {/* open mobile menu handlaer*/}
              {width <= breakpoints.xl && (
                <div
                  className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                  onClick={handleOpenMobileMenu}
                >
                  <Icon icon="heroicons-outline:menu-alt-3" />
                </div>
              )}
            </div>
          )}
          {/*  Horizontal  Main Menu */}
          {menuType === "horizontal" && width >= breakpoints.xl ? (
            <HorizentalMenu />
          ) : null}
          {/* Nav Tools  */}
          <div className="nav-tools flex items-center  rtl:space-x-reverse">
            {/* <Language /> */}
            {/* <MonoChrome /> */}
            <div className="flex items-center">
              <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
                <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
                  <Icon
                    className="block w-full h-full object-cover  "
                    icon="mingcute:user-2-fill"
                  ></Icon>
                </div>
              </div>
              <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
                  {name}
                </span>
              </div>
            </div>
            <span>
              <div
                className="lg:h-[32px] lg:w-[32px] lg:bg-slate-100 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
                onClick={() => dispatch(handleLogout(false))}
              >
                <Icon icon="heroicons-outline:login" />
              </div>
            </span>
            {width <= breakpoints.md && (
              <div
                className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                onClick={handleOpenMobileMenu}
              >
                <Icon icon="heroicons-outline:menu-alt-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
