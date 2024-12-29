import { Plus, Pencil, FilterIcon, Loader2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import * as yup from "yup";
import {
  useAllQuery,
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
} from "../../../service/priceList/battery";

import { batteryTypeEnum } from "../../../types/battery-type.enum";
import { Input } from "../../../core/input/Input";
import { Button } from "../../../core/button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { DataTable } from "../../../core/data-table/DataTable";
import { getBatteryColDef } from "../column/BatteryColDef";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../core/dropdownMenu/DropDownMenu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../core/dialog/Dialog";

const schema = yup
  .object({
    brand_name: yup.string().required(),
    system_type: yup.string().required(),
    specification: yup.string().required(),
    capacity: yup.number().positive().integer().required(),
    unit: yup.string().required(),
    price: yup.number().positive().integer().required(),
    // voltage_type: yup.mixed().oneOf(Object.values(voltageTypeEnum)).required(),
  })
  .required();

function Battery({ setIsLoading }) {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentItemId, setCurrentItemId] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // const [batteryType, setBatteryType] = useState(batteryTypeEnum.tubular);
  // ----------------- redux toolkit query --------------------------->

  const [deleteItem, deleteItemStatus] = useDeleteMutation();
  const [editPanel, editStatus] = useEditMutation();
  const [addNewBattery, createStatus] = useCreateMutation();
  const { data, isLoading, isError, error } = useAllQuery();
  const batteries = data?.results;

  // ----------------- react-form-hook -------------------------------->
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      system_type: batteryTypeEnum.tubular,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (isEdit && currentItemId) {
      const _data = { ...data, id: currentItemId };
      const response = await editPanel(_data);

      if ("data" in response) {
        reset();
        addToast("Battery Updated Successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      }
      await Promise.all([
        setIsEdit(false),
        setIsFormOpen(false),
        setCurrentItemId(""),
      ]);
    } else {
      const response = await addNewBattery(data);

      if ("error" in response) {
        addToast(Object.values(response.error.data).join(", "), {
          appearance: "error",
          autoDismiss: true,
        });
      }

      if ("data" in response) {
        reset();
        addToast("Battery Added Successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        await Promise.all([
          setIsEdit(false),
          setIsFormOpen(false),
          setCurrentItemId(""),
        ]);
      } else {
        // console.log(response.error);
      }
    }
  };

  const onError = () => {
    // console.log(errors);
    console.log("🚀 ~ onError ~ errors:", errors);
  };

  // ----------------- functions ----------------------------->
  const onPriceListEditHandler = async (id) => {
    await Promise.all([
      setIsEdit(true),
      setCurrentItemId(id),
      setIsFormOpen(true),
    ]);
    const battery = batteries?.filter((fil) => fil.id === id)[0];
    if (battery) {
      setValue("price", battery?.price);
      setValue("brand_name", battery?.brand_name);
      setValue("capacity", battery?.capacity);
      setValue("specification", battery?.specification);
      setValue("unit", battery?.unit);
      setValue("system_type", battery.system_type);
      setValue("voltage_type", battery.voltage_type);
    }
  };

  const deletePriceListRow = async (id) => {
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
        value="battery"
        className=" border border-orange-primary  bg-white  mb-4 border-b-0 rounded-[8px]"
      >
        <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
          Battery
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-neutral-50 rounded-[8px]  ">
          <Tabs defaultValue={"tubular"} className="w-full">
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
                      value={"tubular"}
                      className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                      onClick={() => {
                        setValue("system_type", batteryTypeEnum.tubular);
                      }}
                    >
                      <p className="flex gap-x-2 items-center">
                        <span>Tubular</span>
                      </p>
                    </TabsTrigger>

                    <TabsTrigger
                      value={"lithium"}
                      className="w-full data-[state=active]:bg-orange-primary data-[state=active]:text-neutral-50 rounded-[4px] flex-1"
                      onClick={() => {
                        setValue("system_type", batteryTypeEnum.lithium);
                      }}
                    >
                      <p className="flex gap-x-2 items-center">
                        <span>Lithium</span>
                      </p>
                    </TabsTrigger>
                  </TabsList>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Create Battery Button */}
              <Button
                onClick={() => setIsFormOpen(true)}
                className="outline-orange-primary border border-orange-primary text-orange-primary"
              >
                Add
              </Button>
            </div>

            <TabsContent value="tubular" className="">
              {batteries && (
                <DataTable
                  columns={getBatteryColDef({
                    onDelete: deletePriceListRow,
                    onEdit: onPriceListEditHandler,
                  })}
                  data={batteries.filter(
                    (item) => item.system_type === "tubular"
                  )}
                />
              )}
            </TabsContent>
            <TabsContent value="lithium">
              {batteries && (
                <DataTable
                  columns={getBatteryColDef({
                    onDelete: deletePriceListRow,
                    onEdit: onPriceListEditHandler,
                  })}
                  data={batteries.filter(
                    (item) => item.system_type === "lithium"
                  )}
                />
              )}
            </TabsContent>
          </Tabs>
        </AccordionContent>
      </AccordionItem>
      {/* Create Battery Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={onCreateDialogClose}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="max-w-[600px] sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEdit.bool ? "Edit" : "Create"} Inverter
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
            <DialogTitle>Delete Battery</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Battery
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

export default Battery;

function Form({
  register,
  onSubmit,
  onError,
  errors,
  isEdit,
  handleSubmit,
  isLoading,
}) {
  return (
    <Fragment>
      <form
        className="flex flex-col flex-wrap gap-4 my-10"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.brand_name ? "true" : "false"}
          placeholder="brand_name"
          {...register("brand_name")}
        />

        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="specification"
          {...register("specification")}
          aria-invalid={errors.specification ? "true" : "false"}
        />

        <Input
          type="number"
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="capacity"
          {...register("capacity")}
          aria-invalid={errors.capacity ? "true" : "false"}
        />
        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="unit"
          {...register("unit")}
          aria-invalid={errors.unit ? "true" : "false"}
        />

        <Input
          type="number"
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="price"
          {...register("price")}
          aria-invalid={errors.price ? "true" : "false"}
        />

        <select
          id=""
          {...register("system_type")}
          className="px-2 py-2.5 flex-1 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500 border border-gray-500 rounded-sm bg-transparent"
        >
          <option value="lithium">lithium</option>
          <option value="tubular">tubular</option>
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
