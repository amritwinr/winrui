"use client"
import ListLoading from "@/components/skeleton/ListLoading"
import Badge from "@/components/ui/Badge"
import Card from "@/components/ui/Card"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import SimpleBar from "simplebar-react"

const UserRequests = () => {
  const [data, setData] = useState("")
  const { isAuth } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const getData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `http://3.87.109.137:8000/api/user/admin_user_request`,
        {
          method: "GET", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
        }
      )
      setIsLoading(false)

      if (response.ok) {
        const data = await response.json()
        setData(data?.data)
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
  }, [])
  const postData = async (value) => {
    try {
      const response = await fetch(
        `http://3.87.109.137:8000/api/user/admin_user_request`,
        {
          method: "POST", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
          body: JSON.stringify(value),
        }
      )
      if (response.ok) {
        const data = await response.json()
        getData()
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
  }, [])
  return (
    <div className=" md:space-x-5 app_height overflow-hidden relative rtl:space-x-reverse">
      {/* overlay */}

      <div className="h-full ">
        <SimpleBar className="h-full all-todos overflow-x-hidden">
          <Card noborder title="User Requests" className="app_height ">
            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
              <thead className=" border-t border-slate-100 dark:border-slate-800">
                <tr>
                  <th scope="col" className=" table-th ">
                    S.no
                  </th>
                  <th scope="col" className=" table-th ">
                    Email
                  </th>
                  <th scope="col" className=" table-th ">
                    Phone
                  </th>

                  <th scope="col" className=" table-th ">
                    User Name
                  </th>

                  <th scope="col" className=" table-th ">
                    Message.
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700 ">
                {!isLoading &&
                  data &&
                  data?.map((value, index) => (
                    <tr>
                      <td className="table-td">{index + 1}</td>
                      <td className="table-td">{value.email}</td>
                      <td className="table-td">{value.phone}</td>
                      <td className="table-td">{value.username}</td>
                      <td className="table-td">{value.message || "None"}</td>
                      <td className="table-td">
                        <Badge
                          className="bg-success-500 text-white cursor-pointer mr-2"
                          onClick={() => postData(value)}
                        >
                          accept
                        </Badge>
                        <Badge className="cursor-pointer bg-danger-500 text-white">
                          reject
                        </Badge>
                      </td>
                    </tr>
                  ))}

                {isLoading && (
                  <td colSpan={"5"}> {true && <ListLoading count={4} />}</td>
                )}
              </tbody>
            </table>
          </Card>
        </SimpleBar>
      </div>
    </div>
  )
}

export default UserRequests
