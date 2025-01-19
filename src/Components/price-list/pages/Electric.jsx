import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../core/accordion/Accordion";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../core/tabs/Tabs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../core/dialog/Dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../core/dropdownMenu/DropDownMenu";

import { systemTypeEnum } from "../../../types/system-type.enum";

import { DataTable } from "../../../core/data-table/DataTable";

import { yupResolver } from "@hookform/resolvers/yup";

import { FilterIcon, Loader2, Pencil, Plus } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import * as yup from "yup";
import {
  useDeleteMutation,
  useAllQuery,
  useCreateMutation,
  useEditMutation,
} from "../../../service/priceList/electricWork";
import { getElectricWorkColDef } from "../column/ElectricColDef";
import { Input } from "../../../core/input/Input";
import { Button } from "../../../core/button/Button";

const schema = yup
  .object({
    system_type: yup.string().required(),
    specification: yup.string().required(),
    unit: yup.string().required(),
    price: yup.number().positive().integer().required(),
  })
  .required();

function ElectricWork({ setIsLoading }) {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentPanelId, setCurrentItemId] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeSystemType, changeSystemType] = useState(systemTypeEnum.onGrid);

  // ----------------- redux toolkit query --------------------------->

  // const [deletePanel, deleteStatus] = useDeleteMutation();
  const [editItem, editStatus] = useEditMutation();
  const [createItem, createStatus] = useCreateMutation();
  const [deleteItem, deleteItemStatus] = useDeleteMutation();

  const { data, isLoading, isError, error } = useAllQuery();
  const electricWork = data?.results;

  // ----------------- react-form-hook -------------------------------->
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      system_type: systemTypeEnum.hybrid,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const action = isEdit && currentPanelId ? editItem : createItem;
    const payload =
      isEdit && currentPanelId ? { ...data, id: currentPanelId } : data;
    const response = await action(payload);

    if ("error" in response) {
      addToast(Object.values(response.error.data).join(", "), {
        appearance: "error",
        autoDismiss: true,
      });
    }

    if ("data" in response) {
      await Promise.all([
        reset(),
        setIsEdit(false),
        setIsFormOpen(false),
        setCurrentItemId(""),
        addToast(`Electric Work ${isEdit ? "Updated" : "Added"} Successfully`, {
          appearance: "success",
          autoDismiss: true,
        }),
      ]);
    }
  };

  const onError = () => {};

  // ----------------- functions ----------------------------->
  const onPriceListEditHandler = async (id) => {
    await Promise.all([
      setIsEdit(true),
      setCurrentItemId(id),
      setIsFormOpen(true),
    ]);
    const _electricWork = electricWork?.filter((fil) => fil.id === id)[0];
    if (_electricWork) {
      setValue("system_type", _electricWork.system_type);
      setValue("specification", _electricWork?.specification);
      setValue("unit", _electricWork?.unit);
      setValue("price", _electricWork?.price);
    }
  };

  const onPriceListDeleteHandler = async (id) => {
    await Promise.all([setCurrentItemId(id), setIsDeleteOpen(true)]);
  };

  const onDeleteConfirm = async () => {
    // const response = await deletePanel({ id });
    const response = await deleteItem({ id: currentPanelId });
    if (response.error) {
      setIsDeleteOpen(false);
      addToast("Delete Failed: " + response.error.message, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    if (deleteItemStatus.status === "fulfilled") {
      await Promise.all([
        setCurrentItemId(""),
        setIsDeleteOpen(false),
        addToast("Deleted Successfully", {
          appearance: "info",
          autoDismiss: true,
        }),
      ]);
    }

    if (deleteItemStatus.status === "rejected") {
      addToast("Something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onCreateDialogClose = async () => {
    await Promise.all([
      reset(),
      setIsEdit(false),
      setIsFormOpen(false),
      setCurrentItemId(""),
    ]);
  };

  // ----------------- render -------------------------------->
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
        value="electric work"
        className=" bg-white border border-orange-primary mb-4 border-b-0 rounded-[8px]"
      >
        <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
          Electric Work
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-slate-50 rounded-[8px] dark:bg-dark-surface-mixed-200">
          <Tabs defaultValue={"onGrid"} className="w-full">
            <div className="flex items-center justify-between gap-x-4 mb-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="space-x-3 bg-orange-primary text-white  "
                  >
                    <span className="">Select Type</span>
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white border-none shadow-lg rounded-[4px] "
                >
                  {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}

                  <TabsList className="h-20 flex flex-col gap-y-2 border-1 rounded-[8px] w-full bg-orange-primary bg-opacity-10">
                    <TabsTrigger
                      value={"onGrid"}
                      onClick={() => changeSystemType(systemTypeEnum.onGrid)}
                      className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                    >
                      <p className="flex gap-x-2 items-center">
                        <span>On Grid</span>
                      </p>
                    </TabsTrigger>

                    <TabsTrigger
                      onClick={() => changeSystemType(systemTypeEnum.hybrid)}
                      value={"hybrid"}
                      className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                    >
                      <p className="flex gap-x-2 items-center">
                        <span>Hybrid</span>
                      </p>
                    </TabsTrigger>
                  </TabsList>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* <DialogTrigger asChild> */}
              <Button
                onClick={() => setIsFormOpen(true)}
                className="outline-orange-primary border border-orange-primary text-orange-primary"
              >
                Add
              </Button>
              {/* </DialogTrigger> */}
            </div>

            {/* <TabsList className="border-1 rounded-[8px] w-full">
            <TabsTrigger
              className="data-[state=active]:bg-dark-primary-100 rounded-[4px] flex-1"
              value={"onGrid"}
              onClick={() => {
                setValue("system_type", systemTypeEnum.onGrid);
              }}
            >
              <p className="flex gap-x-2 items-center">
                <span>On Grid</span>
              </p>
            </TabsTrigger>

            <TabsTrigger
              value={"hybrid"}
              className="data-[state=active]:bg-dark-primary-100 rounded-[4px] flex-1"
              onClick={() => {
                setValue("system_type", systemTypeEnum.hybrid);
              }}
            >
              <p className="flex gap-x-2 items-center">
                <span>Hybrid</span>
              </p>
            </TabsTrigger>

            <TabsTrigger
              value={"vfd"}
              className="data-[state=active]:bg-dark-primary-100 rounded-[4px] flex-1"
              onClick={() => {
                setValue("system_type", systemTypeEnum.vfd);
              }}
            >
              <p className="flex gap-x-2 items-center">
                <span>VFD</span>
              </p>
            </TabsTrigger>
          </TabsList> */}

            <TabsContent value="onGrid" className="">
              {electricWork && (
                <DataTable
                  columns={getElectricWorkColDef({
                    onDelete: onPriceListDeleteHandler,
                    onEdit: onPriceListEditHandler,
                  })}
                  data={electricWork.filter(
                    (item) => item.system_type === systemTypeEnum.onGrid
                  )}
                />
              )}
            </TabsContent>
            <TabsContent value="hybrid">
              {electricWork && (
                <DataTable
                  columns={getElectricWorkColDef({
                    onDelete: onPriceListDeleteHandler,
                    onEdit: onPriceListEditHandler,
                  })}
                  data={electricWork.filter(
                    (item) => item.system_type === systemTypeEnum.hybrid
                  )}
                />
              )}
            </TabsContent>
            <TabsContent value="vfd">
              {electricWork && (
                <DataTable
                  columns={getElectricWorkColDef({
                    onDelete: onPriceListDeleteHandler,
                    onEdit: onPriceListEditHandler,
                  })}
                  data={electricWork.filter(
                    (item) => item.system_type === systemTypeEnum.vfd
                  )}
                />
              )}
            </TabsContent>
          </Tabs>
        </AccordionContent>
      </AccordionItem>

      {/* Create Battery Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={onCreateDialogClose}>
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEdit.bool ? "Edit" : "Create"} Electrical Work
            </DialogTitle>
            <DialogDescription></DialogDescription>

            <Form
              isEdit={isEdit}
              errors={errors}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              handleSubmit={handleSubmit}
              isLoading={editStatus.isLoading || createStatus.isLoading}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/*  Delete Battery Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Delete Electrical Work</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Electrical Work ?
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

export default ElectricWork;

function Form({
  errors,
  isEdit,
  onError,
  onSubmit,
  register,
  isLoading,
  handleSubmit,
}) {
  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col flex-wrap gap-4 my-10"
      >
        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.specification ? "true" : "false"}
          placeholder="Specification i:e AC/DC Cable:Pakistan/Fast , Chint/ABB"
          {...register("specification")}
          type="text"
        />
        {/* TODO: Remove unit from list */}

        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.unit ? "true" : "false"}
          placeholder="unit"
          {...register("unit")}
          type="text"
        />
        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.price ? "true" : "false"}
          placeholder="Price PKR (please input per watt rate) i:e 10/12/15 etc"
          {...register("price")}
          type="number"
        />

        <select
          id=""
          // value={systemTypeEnum.hybrid}
          {...register("system_type")}
          className="px-2 py-2.5 flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500 border border-gray-500 rounded-sm bg-transparent"
        >
          <option value="on_grid">On Grid</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <div className="w-full">
          {isEdit && (
            <Button
              type="submit"
              variant="default"
              className="w-full flex flex-1 gap-x-2 bg-orange-primary text-neutral-50 rounded-full float-right items-center "
            >
              {isLoading ? (
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
              {isLoading ? (
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

          {/* <Button
            type="submit"
            variant="default"
            className="bg-dark-primary-100 hover:bg-dark-primary-200 rounded-full flex-[4%] max-w-[12%] float-right
              flex gap-x-2 items-center
              "
          >
            {isEdit ? (
              <Fragment>
                <span>
                  <Pencil size={14} />
                </span>
                <span> Edit</span>
              </Fragment>
            ) : (
              <Fragment>
                <span>
                  <Plus size={14} />
                </span>
                <span>Create</span>
              </Fragment>
            )}
          </Button> */}
        </div>
      </form>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-dark-primary-100" />
        <div className="flex-1">
          {/* <Divider orientation="horizontal" className=" bg-dark-primary-100" /> */}
        </div>
      </div>
    </Fragment>
  );
}
