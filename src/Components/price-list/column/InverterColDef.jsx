"use client";
import { Button } from "../../../core/button/Button";

import moment from "moment";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../core/dropdownMenu/DropDownMenu";

export const getInverterColDef = ({ addNew, onEdit, onDelete }) => {
  const inverterDefCols = [
    {
      accessorKey: "id",
      header: () => <div className="text-center capitalize">Id</div>,
      cell: ({ row }) => {
        const id = row.getValue("id");
        return <div className="text-center font-medium">{id + "..."}</div>;
      },
    },

    {
      accessorKey: "brand_name",
      header: ({ column }) => {
        return (
          <div className="flex justify-center capitalize">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Brand Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const brand_name = row.getValue("brand_name");
        return <div className="text-center font-medium">{brand_name}</div>;
      },
    },

    {
      accessorKey: "system_type",
      header: () => <div className="text-center capitalize">System Type</div>,
      cell: ({ row }) => {
        const value = row.getValue("system_type");
        return <div className="text-center font-medium">{value}</div>;
      },
    },
    {
      accessorKey: "specification",
      header: () => <div className="text-center capitalize">specification</div>,
      cell: ({ row }) => {
        const capacity = row.getValue("specification");
        return <div className="text-center font-medium">{capacity}</div>;
      },
    },
    {
      accessorKey: "capacity",
      header: () => <div className="text-center capitalize">capacity</div>,
      cell: ({ row }) => {
        const capacity = row.getValue("capacity");
        return <div className="text-center font-medium">{capacity}</div>;
      },
    },

    {
      accessorKey: "price",
      header: () => <div className="text-center capitalize">price</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        // const formatted = new Intl.NumberFormat("en-US", {
        //   style: "price",
        //   currency: "usd",
        // }).format(amount);
        return <div className="text-center font-medium">{amount}</div>;
      },
    },
    {
      accessorKey: "system_type",
      header: () => (
        <div className="text-center capitalize">Battery Voltage Type</div>
      ),
      cell: ({ row }) => {
        const value = row.getValue("system_type");
        return (
          <div className="text-center font-medium">{value?.toUpperCase()}</div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: () => <div className="text-center capitalize">Creation Date</div>,
      cell: ({ row }) => {
        const created_at = row.getValue("created_at");
        return (
          <div className="text-center font-medium">
            {moment(created_at).format("DD-MM-YYYY")}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        // const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-dark-surface-mixed-300 border-none shadow-lg rounded-[4px] bg-white"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem className="hover:bg-dark-primary-300 cursor-pointer">
                <div
                  className="flex items-center gap-2"
                  onClick={() => {
                    const id = row.getValue("id");
                    onEdit(id);
                  }}
                >
                  <Pencil size={14} />
                  <span className="text-md">edit</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="hover:bg-dark-primary-300 cursor-pointer
              "
              >
                <div
                  className="flex items-center gap-2"
                  onClick={() => {
                    const id = row.getValue("id");
                    onDelete(id);
                  }}
                >
                  <Trash2 size={14} />
                  <span className="text-md">delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return inverterDefCols;
};
