import React from "react"
import useSkin from "@/hooks/useSkin"
import Draggable from "react-draggable"

const Card = ({
  children,
  title,
  subtitle,
  style,
  headerslot,
  className = "custom-class   ",
  bodyClass = "p-6",
  noborder,
  titleClass = "custom-class ",
  isDraggable
}) => {
  const [skin] = useSkin()

  return (
    isDraggable ?
      <Draggable>
        <div

          className={`
        card rounded-md   ${skin === "bordered"
              ? " border border-slate-200 dark:border-slate-700"
              : "shadow-base"
            }
   
    ${className}
    `}
          style={style}
        >
          {(title || subtitle) && (
            <header className={`card-header ${noborder ? "no-border" : ""}`}>
              <div>
                {title && <div className={`card-title ${titleClass}`}>{title}</div>}
                {subtitle && <div className="card-subtitle">{subtitle}</div>}
              </div>
              {headerslot && <div className="card-header-slot">{headerslot}</div>}
            </header>
          )}
          <main className={`card-body ${bodyClass}`}>
            {children}
          </main>
        </div>
      </Draggable> :
      <div
        style={style}
        className={`
        card rounded-md   bg-background   ${skin === "bordered"
            ? " border border-slate-200 dark:border-slate-700"
            : "shadow-base"
          }
   
    ${className}
        `}
      >
        {(title || subtitle) && (
          <header className={`card-header ${noborder ? "no-border" : ""}`}>
            <div>
              {title && <div className={`card-title ${titleClass}`}>{title}</div>}
              {subtitle && <div className="card-subtitle">{subtitle}</div>}
            </div>
            {headerslot && <div className="card-header-slot">{headerslot}</div>}
          </header>
        )}
        <main className={`card-body ${bodyClass}`}>
          {children}
        </main>
      </div>
  )
}

export default Card
