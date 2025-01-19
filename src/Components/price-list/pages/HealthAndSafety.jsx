import { Divider } from "@nextui-org/react";
import { Loader2, Pencil, Plus } from "lucide-react";
import * as yup from "yup";

import { useToasts } from "react-toast-notifications";
import { Fragment, useEffect, useState } from "react";
import {
  useDeleteMutation,
  useAllQuery,
  useCreateMutation,
  useEditMutation,
} from "../../../service/priceList/HealthAndSafetyApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCommonColDef } from "../column/CommonColDef";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../core/accordion/Accordion";
import { Button } from "../../../core/button/Button";
import { Input } from "../../../core/input/Input";
import { DataTable } from "../../../core/data-table/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../core/dialog/Dialog";

const schema = yup
  .object({
    specification: yup.string().required(),
    unit: yup.string().required(),
price: yup
                  .number()
                  .positive("Price must be a positive number")
                  .required("Price is required")
                  .min(0, "Price must be at least 1000"),
    //price: yup.number().positive().integer().required(),
    capacity: yup.number().positive().integer().required(),
  })
  .required();

function HealthAndSafety({ setIsLoading }) {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentItemId, setCurrentItemId] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ----------------- redux toolkit query --------------------------->

  const [deleteItem, deleteItemStatus] = useDeleteMutation();
  const [editPanel, editStatus] = useEditMutation();
  const [createPanel, createStatus] = useCreateMutation();
  const { data, isLoading, isError, error } = useAllQuery();
  const records = data?.results;

  // ----------------- react-form-hook -------------------------------->
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const action = isEdit && currentItemId ? editPanel : createPanel;
    const payload = isEdit ? { ...data, id: currentItemId } : data;
    const response = await action(payload);

    if ("data" in response) {
      await Promise.all([
        reset(),
        setIsEdit(false),
        setCurrentItemId(""),
        setIsFormOpen(false),
        addToast(
          isEdit
            ? "HSE Equipment Edited Successfully"
            : "HSE Equipment Added Successfully",
          {
            appearance: "success",
            autoDismiss: true,
          }
        ),
      ]);
    }
  };

  const onError = () => {};

  // ----------------- functions ----------------------------->
  const onPriceListEditHandler = async (id) => {
    const [_result] = await Promise.all([
      records?.filter((fil) => fil.id === id)[0],
      setIsEdit(true),
      setCurrentItemId(id),
      setIsFormOpen(true),
    ]);
    if (_result) {
      setValue("capacity", _result.capacity);
      setValue("specification", _result?.specification);
      setValue("unit", _result?.unit);
      setValue("price", _result?.price);
    }
  };

  const onPriceListDeleteHandler = async (id) => {
    await Promise.all([setIsDeleteOpen(true), setCurrentItemId(id)]);
  };

  const onDeleteConfirm = async () => {
    const response = await deleteItem({ id: currentItemId });
    if (response.error) {
      setIsDeleteOpen(false);
      addToast("Delete Failed: " + response.error.message, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    await Promise.all([
      setCurrentItemId(""),
      setIsDeleteOpen(false),
      addToast("Deleted Successfully", {
        appearance: "info",
        autoDismiss: true,
      }),
    ]);
  };

  const onCreateDialogClose = async () => {
    await Promise.all([
      reset(),
      setIsEdit(false),
      setIsFormOpen(false),
      setCurrentItemId(""),
    ]);
  };

  // ----------------- useEffect ----------------------------->
  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);
  // ----------------- render -------------------------------->

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    // addToast(JSON.stringify(error), { appearance: "error" });
    return <div>error is: {JSON.stringify(error)}</div>;
  }
  return (
    <Fragment>
      <AccordionItem
        value="hSEEquipment"
        className="bg-white border border-orange-primary mb-4 border-b-0 rounded-[8px]"
      >
        <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
          Health Safety Equipment
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-slate-50 rounded-[8px] dark:bg-dark-surface-mixed-200">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="mb-3 bg-orange-primary text-stone-50"
          >
            Add
          </Button>

          {records && (
            <DataTable
              columns={getCommonColDef({
                onEdit: onPriceListEditHandler,
                onDelete: onPriceListDeleteHandler,
              })}
              data={records}
            />
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Create Battery Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={onCreateDialogClose}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEdit.bool ? "Edit" : "Create"} Health, Safety and Environment
              Service
            </DialogTitle>
            <DialogDescription></DialogDescription>

            <form
              className="flex flex-col flex-wrap gap-4 my-10"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <Input
                className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
                aria-invalid={errors.specification ? "true" : "false"}
                placeholder="Specification i:e Fire Extinguisher, Safety Stickers ,Tags  "
                {...register("specification")}
                type="text"
                onDoubleClick={(e) => {
                  setValue("specification", "Fire Extinguisher, Safety Labels & Tags");
                }}
              />
              {/* TODO: Remove capacity */}

              <Input
                className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
                aria-invalid={errors.capacity ? "true" : "false"}
                placeholder="capacity"
                {...register("capacity")}
                type="number"
              />
              {/* <Input
             className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
             aria-invalid={errors.unit ? "true" : "false"}
             placeholder="unit"
             {...register("unit")}
             type="text"
           /> */}

              {/* TODO: Change unit from watt to SVC in the main list */}

              <select
                {...register("unit")}
                defaultValue={"watt"}
                aria-invalid={errors.unit ? "true" : "false"}
                className="px-2 py-2.5 flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500 border border-gray-500 rounded-sm bg-transparent"
              >
                {/* <option value="kw">kw</option> */}

                <option value="watt">SVC</option>
              </select>

              {/* <Input
                className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
                aria-invalid={errors.price ? "true" : "false"}
                placeholder="Price PKR (please input service price) i:e 5000 or 10000"
                {...register("price")}
                type="number"
              /> */}
                 <Input
                className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
                aria-invalid={errors.price ? "true" : "false"}
                placeholder="Price PKR (please input service price) i:e 5000 or 10000"
                {...register("price", {
                  required: "Price is required",
                  validate: (value) => {
                    if (value === "" || isNaN(value)) {
                      return "Price must be a valid number";
                    }
                    return /^\d+(\.\d{1})?$/.test(value) || "Price must have up to 1 decimal place";
                  },
                })}
                type="number"
                step="1000"
                onDoubleClick={() => {
                  setValue("price", 5000); // Set default value on double click
                }}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setValue("price", Math.round(value * 10) / 10); // Restrict to 1 decimal place
                  }
                }}
              />

              <div className="w-full">
                {isEdit && (
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full flex flex-1 gap-x-2 bg-orange-primary text-neutral-50 rounded-full float-right items-center "
                  >
                    {editStatus.isLoading ? (
                      <Fragment>
                        <span>
                          <Loader2 size={14} className="animate-spin" />
                        </span>
                        <span>Loading...</span>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <span>
                          <Pencil size={14} />
                        </span>
                        <span> Edit</span>
                      </Fragment>
                    )}
                  </Button>
                )}

                {!isEdit && (
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full flex flex-1 gap-x-2 bg-orange-primary text-neutral-50 rounded-full float-right items-center "
                  >
                    {createStatus.isLoading ? (
                      <Fragment>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Loading...</span>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Plus size={14} />
                        <span>Add</span>
                      </Fragment>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/*  Delete Battery Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Delete HSE Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this HSE Service ?
            </DialogDescription>
            <div className="flex gap-x-3 items-center">
              <Button
                varian="outline"
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 border border-orange-primary text-orange-primary"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={onDeleteConfirm}
                className="flex-1 bg-orange-primary text-neutral-50"
              >
                {deleteItemStatus.isLoading ? (
                  <Fragment>
                    <Loader2 className="animate-spin" />
                    <span>Loading...</span>
                  </Fragment>
                ) : (
                  <span>Delete</span>
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default HealthAndSafety;
