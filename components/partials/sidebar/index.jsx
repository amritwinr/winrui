import React, { useRef, useEffect, useState } from "react"
import SidebarLogo from "./Logo"
import Navmenu from "./Navmenu"
import { menuItems } from "@/constant/data"
import SimpleBar from "simplebar-react"
import useSidebar from "@/hooks/useSidebar"
import useSemiDark from "@/hooks/useSemiDark"
import useSkin from "@/hooks/useSkin"
import { Switch } from "@headlessui/react"
import Swicth from "@/components/ui/Switch"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { url } from "@/constants"

const Sidebar = () => {
  const { isAuth } = useSelector((state) => state.auth)

  const scrollableNodeRef = useRef()
  const [scroll, setScroll] = useState(false)
  const [checked, setChecked] = useState(false)
  const [menuData, setMenuData] = useState("")
  const getData = async () => {
    try {
      const response = await fetch(
        `${url}/api/broker/side_bar`,
        {
          method: "GET", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        setMenuData(data?.data)
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
  }
  useEffect(() => {
    getData()
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true)
      } else {
        setScroll(false)
      }
    }
    scrollableNodeRef.current.addEventListener("scroll", handleScroll)
  }, [scrollableNodeRef])

  const [collapsed, setMenuCollapsed] = useSidebar()
  const [menuHover, setMenuHover] = useState(false)

  // semi dark option
  const [isSemiDark] = useSemiDark()
  // skin
  const [skin] = useSkin()
  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={`sidebar-wrapper bg-white dark:bg-slate-800     ${
          collapsed ? "w-[72px] close_sidebar" : "w-[248px]"
        }
      ${menuHover ? "sidebar-hovered" : ""}
      ${
        skin === "bordered"
          ? "border-r border-slate-200 dark:border-slate-700"
          : "shadow-base"
      }
      `}
        onMouseEnter={() => {
          setMenuHover(true)
        }}
        onMouseLeave={() => {
          setMenuHover(false)
        }}
      >
        <SidebarLogo menuHover={menuHover} />
        <div
          className={`h-[60px]  absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
            scroll ? " opacity-100" : " opacity-0"
          }`}
        ></div>

        <SimpleBar
          className="sidebar-menu px-4 h-[calc(100%-80px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          {menuData && <Navmenu menus={menuData.menu} />}
        </SimpleBar>
      </div>
    </div>
  )
}

export default Sidebar
