"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../core/dropdownMenu/DropDownMenu";
import { Button } from "../../../core/button/Button";

export const getBmsColDef = ({ onEdit, onDelete }) => {
  const bmsDefCols = [
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
      header: () => <div className="text-center capitalize">Brand Name</div>,
      cell: ({ row }) => {
        const value = row.getValue("brand_name");
        return <div className="text-center font-medium">{value}</div>;
      },
    },

    {
      accessorKey: "specification",
      header: () => <div className="text-center capitalize">Specification</div>,
      cell: ({ row }) => {
        const value = row.getValue("specification");
        return <div className="text-center font-medium">{value}</div>;
      },
    },
    {
      accessorKey: "capacity",
      header: () => <div className="text-center capitalize">Capacity</div>,
      cell: ({ row }) => {
        const value = row.getValue("capacity");
        return <div className="text-center font-medium">{value}</div>;
      },
    },

    {
      accessorKey: "unit",
      header: () => <div className="text-center capitalize">unit</div>,
      cell: ({ row }) => {
        const capacity = row.getValue("unit");
        return <div className="text-center font-medium">{capacity}</div>;
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-center capitalize">price</div>,
      cell: ({ row }) => {
        const value = row.getValue("price");
        return <div className="text-center font-medium">{value}</div>;
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
              className="bg-dark-surface-mixed-300 border-none shadow-lg rounded-[4px] "
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

              <DropdownMenuItem className="hover:bg-dark-primary-300 cursor-pointer">
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

  return bmsDefCols;
};
