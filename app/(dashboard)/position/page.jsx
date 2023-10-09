"use client"
import Badge from "@/components/ui/Badge"
import Card from "@/components/ui/Card"
import React from "react"
import SimpleBar from "simplebar-react"

const Position = () => {
  return (
    <div className=" md:space-x-5 app_height overflow-hidden relative rtl:space-x-reverse">
      {/* overlay */}

      <div className="h-full ">
        <SimpleBar className="h-full all-todos overflow-x-hidden">
          <Card noborder title="Positions" className="app_height ">
            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
              <thead className=" border-t border-slate-100 dark:border-slate-800">
                <tr>
                  <th scope="col" className=" table-th ">
                    Instrument
                  </th>
                  <th scope="col" className=" table-th ">
                    Type
                  </th>

                  <th scope="col" className=" table-th ">
                    Qty
                  </th>

                  <th scope="col" className=" table-th ">
                    Buy Avg.
                  </th>
                  <th scope="col" className=" table-th ">
                    Sell Avg.
                  </th>

                  <th scope="col" className=" table-th ">
                    LTP
                  </th>
                  <th scope="col" className=" table-th ">
                    Net P&L
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700 ">
                <tr className="hover:bg-hover ">
                  <td className="table-td">
                    ITC-EQ<sub>NSE</sub>
                  </td>
                  <td className="table-td">
                    <Badge>MSI</Badge>
                  </td>

                  <td className="table-td">1</td>

                  <td className="table-td">453.85</td>
                  <td className="table-td">453.85</td>

                  <td className="table-td">453.85</td>

                  <td className="table-td text-red-400">-0.19</td>
                </tr>
                <tr className="hover:bg-hover ">
                  <td className="table-td">
                    ITC-EQ<sub>NSE</sub>
                  </td>
                  <td className="table-td">
                    <Badge>MSI</Badge>
                  </td>

                  <td className="table-td">1</td>

                  <td className="table-td">453.85</td>
                  <td className="table-td">453.85</td>

                  <td className="table-td">453.85</td>

                  <td className="table-td text-red-400">-0.19</td>
                </tr>
                <tr className="hover:bg-hover ">
                  <td className="table-td">
                    ITC-EQ<sub>NSE</sub>
                  </td>
                  <td className="table-td">
                    <Badge>MSI</Badge>
                  </td>

                  <td className="table-td">1</td>

                  <td className="table-td">453.85</td>
                  <td className="table-td">453.85</td>

                  <td className="table-td">453.85</td>

                  <td className="table-td text-red-400">-0.19</td>
                </tr>
                <tr>
                  <td className="table-td" colspan="5"></td>
                  <td className="table-td">Total</td>
                  <td className="table-td">1</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </SimpleBar>
      </div>
    </div>
  )
}

export default Position
