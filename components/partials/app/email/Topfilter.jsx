import React from "react"
import Icon from "@/components/ui/Icon"
import Swicth from "@/components/ui/Switch"
const Topfilter = ({ filter, item, onClick, handleSwitchChange, enableSwitch }) => {
  return (
    <li>
      <label
        className={` flex items-center  px-2 py-3 rounded
                   ${filter === item.id
            ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-200"
            : "   "
          }
                   ${item.status == "ACTIVE"
            ? ""
            : "  text-slate-300 dark:text-slate-600 "
          }
                      `}
      >
        <div
          className={`flex-1 flex space-x-2 rtl:space-x-reverse ${item.status == "ACTIVE"
            ? "cursor-pointer"
            : "cursor-not-allowed pointer-events-none"
            }`}
          onClick={(e) => {
            if (item.status == "ACTIVE") {
              onClick(e)
              e.stopPropagation()
              e.preventDefault()
              // This line will never be executed because of "false"
            } else {
              e.stopPropagation()
              e.preventDefault()
            }
          }}
        >
          <span
            className={` text-xl
                        ${filter === item.id
                ? " text-slate-900 dark:text-slate-100"
                : " text-slate-400 dark:text-slate-400"
              }
                `}
          ></span>
          <span
            className={` capitalize text-sm
                        ${filter === item.id ? " font-medium" : "font-normal"}
                      `}
          >
            {item.name}
          </span>
        </div>
        {enableSwitch !== null &&
          <Swicth
            disabled={item.status == "ACTIVE" ? false : true}
            value={item.user_status == 1 ? true : false}
            onChange={() => handleSwitchChange(item.id, item.name, "toggle")}
          />
        }
      </label>
    </li>
  )
}

export default Topfilter
