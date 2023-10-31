import { useRouter, usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Collapse } from "react-collapse"
import Icon from "@/components/ui/Icon"
import { toggleActiveChat } from "@/components/partials/app/chat/store"
import { useDispatch } from "react-redux"
import useMobileMenu from "@/hooks/useMobileMenu"
import { Switch } from "@headlessui/react"
import useSemiDark from "@/hooks/useSemiDark"
import SwitchDark from "../header/Tools/SwitchDark"
import Swicth from "@/components/ui/Switch"
import useDarkmode from "@/hooks/useDarkMode"
import styles from '@/Styles/sidebar.module.css'

const Navmenu = ({ menus }) => {
  const router = useRouter()
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [checked, setChecked] = useState(false)
  const toggleSubmenu = (i) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null)
    } else {
      setActiveSubmenu(i)
    }
  }

  const location = usePathname()
  const locationName = location.replace("/", "")
  const [isDark, setDarkMode] = useDarkmode()

  const [mobileMenu, setMobileMenu] = useMobileMenu()
  const dispatch = useDispatch()
  const [isSemiDark, setSemiDark] = useSemiDark()

  useEffect(() => {
    let submenuIndex = null
    menus.map((item, i) => {
      if (!item.child) return
      if (item.link === locationName) {
        submenuIndex = null
      } else {
        const ciIndex = item.child.findIndex(
          (ci) => ci.childlink === locationName
        )
        if (ciIndex !== -1) {
          submenuIndex = i
        }
      }
    })

    setActiveSubmenu(submenuIndex)
    dispatch(toggleActiveChat(false))
    if (mobileMenu) {
      setMobileMenu(false)
    }
  }, [router, location])

  const links = [
    {
      icon: "mdi:home",
      title: "Dashboard",
      link: "/dashboard"
    },
    {
      icon: "ion:card-sharp",
      title: "Position",
      link: "/position"
    },
    {
      icon: "mingcute:alert-fill",
      title: "Alerts",
      link: "/alerts"
    },
    {
      icon: "bxl:telegram",
      title: "Telegram",
      link: "/Telegram"
    },
    {
      icon: "octicon:graph-24",
      title: "Chartlink",
      link: "/chartlink"
    },
    {
      icon: "solar:link-linear",
      title: "Broker",
      link: "/broker"
    },
    {
      icon: "material-symbols:tab-group",
      title: "Indicator Store",
      link: "/indicator_store"
    },
    {
      icon: "mdi:graph-box",
      title: "My Strategies",
      link: "/strategies"
    },
    {
      icon: "clarity:group-line",
      title: "Group",
      link: "/group"
    },
    {
      icon: "bx:rupee",
      title: "Subscribe",
      link: "/subscribe"
    },
    {
      icon: "ion:call",
      title: "Contact Us",
      link: "/contact"
    },
  ]

  return (
    <>
      <ul>

        {menus.map((item, i) => (
          <li
            key={i}
            className={` single-sidebar-menu 
              ${item.child ? "item-has-children" : ""}
              ${activeSubmenu === i ? "open" : ""}
              ${locationName === item.link ? "menu-item-active" : ""}`}
          >
            {/* single menu with no childred*/}

            <Link className="menu-link" href={item.link}>
              <span className="menu-icon flex-grow-0">
                <Icon icon={item.icon} />
              </span>
              <div className="text-box flex-grow">{item.title}</div>
              {item.badge && <span className="menu-badge">{item.badge}</span>}
            </Link>

            {/* only for menulabel */}
            {item.isHeadr && !item.child && (
              <div className="menulabel">{item.title}</div>
            )}
            {/*    !!sub menu parent   */}
            {item.child && (
              <div
                className={`menu-link ${activeSubmenu === i
                  ? "parent_active not-collapsed"
                  : "collapsed"
                  }`}
                onClick={() => toggleSubmenu(i)}
              >
                <div className="flex-1 flex items-start">
                  <span className="menu-icon">
                    <Icon icon={item.icon} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
                <div className="flex-0">
                  <div
                    className={`menu-arrow transform transition-all duration-300 ${activeSubmenu === i ? " rotate-90" : ""
                      }`}
                  >
                    <Icon icon="heroicons-outline:chevron-right" />
                  </div>
                </div>
              </div>
            )}
            <Collapse isOpened={activeSubmenu === i}>
              <ul className="sub-menu ">
                {item.child?.map((subItem, j) => (
                  <li key={j} className="block pl-4 pr-1 mb-4 first:mt-4">
                    <Link href={subItem.childlink}>
                      <span
                        className={`${locationName === subItem.childlink
                          ? " text-black dark:text-white font-medium"
                          : "text-slate-600 dark:text-slate-300"
                          } text-sm flex space-x-3 items-center transition-all duration-150`}
                      >
                        <span
                          className={`${locationName === subItem.childlink
                            ? " bg-slate-900 dark:bg-slate-300 ring-4 ring-opacity-[15%] ring-black-500 dark:ring-slate-300 dark:ring-opacity-20"
                            : ""
                            } h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none`}
                        ></span>
                        <span className="flex-1">{subItem.childtitle}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Collapse>
          </li>
        ))}

        {links?.map((item, i) => {
          return (
            <li className={`single-sidebar-menu ${styles.link}`}>
              <span className="menu-link">
                <span className="menu-icon">
                  <Icon icon={item?.icon} />
                </span>
                <Link href={item?.link} className="flex">
                  {item?.title}
                </Link>
              </span>
            </li>
          )
        })}

        <li className="single-sidebar-menu">
          <span className="menu-link">
            <span className="menu-icon">
              <Icon icon="mdi:circle-half-full" />
            </span>
            <div className="flex">
              Paper Trade{" "}
              <span className="ml-2">
                <Swicth value={isDark} onChange={() => setDarkMode(!isDark)} />
              </span>
            </div>
          </span>
        </li>
        <li className="single-sidebar-menu">
          <span className="menu-link">
            <span className="menu-icon">
              <Icon icon="mdi:circle-half-full" />
            </span>
            <div className="flex">
              Dark Mode{" "}
              <span className="ml-2">
                <Swicth value={isDark} onChange={() => setDarkMode(!isDark)} />
              </span>
            </div>
          </span>
        </li>
      </ul>
    </>
  )
}

export default Navmenu
