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

import { systemTypeEnum } from "../../../types/system-type.enum";

import { DataTable } from "../../../core/data-table/DataTable";

import { yupResolver } from "@hookform/resolvers/yup";

import { Pencil, Plus } from "lucide-react";
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

function ElectricWork() {
  // ----------------- states -------------------------------->
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [currentPanelId, setCurrentPanelId] = useState();

  // ----------------- redux toolkit query --------------------------->

  const [deletePanel] = useDeleteMutation();
  const [editPanel] = useEditMutation();
  const [createPanel] = useCreateMutation();

  const {
    data: electricWork,
    isLoading,
    isError,
    error,
  } = useAllQuery({
    id: "",
  });

  // ----------------- react-form-hook -------------------------------->
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      system_type: systemTypeEnum.onGrid,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (isEdit && currentPanelId) {
      const _data = { ...data, id: currentPanelId };
      const response = await editPanel(_data);

      if ("data" in response) {
        if (response.data.success) {
          reset();
          addToast(response.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
        }
        setIsEdit(false);
        setCurrentPanelId("");
      }
    } else {
      const response = await createPanel(data);

      if ("data" in response) {
        if (response.data.success) {
          reset();
          addToast(response.data.message, {
            appearance: "success",
            autoDismiss: true,
          });
        }
      }
    }
  };

  const onError = () => {};

  // ----------------- functions ----------------------------->
  const onPriceListEditHandler = async (id) => {
    setIsEdit(true);
    setCurrentPanelId(id);
    const _electricWork = electricWork?.filter((fil) => fil.id === id)[0];

    if (_electricWork) {
      setValue("system_type", _electricWork.system_type);
      setValue("specification", _electricWork?.specification);
      setValue("unit", _electricWork?.unit);
      setValue("price", _electricWork?.price);
    }
  };

  const onPriceListDeleteHandler = async (id) => {
    const response = await deletePanel({ id });
    if ("data" in response) {
      addToast(response.data.message, {
        appearance: "info",
        autoDismiss: true,
      });
    }
  };

  useEffect(() => {}, []);

  // ----------------- render -------------------------------->

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    // addToast(JSON.stringify(error), { appearance: "error" });
    return <div>error is: {JSON.stringify(error)}</div>;
  }

  return (
    <AccordionItem
      value="electric work"
      className=" dark:bg-dark-surface-mixed-200 mb-4 border-b-0 rounded-[8px]"
    >
      <AccordionTrigger className="shadow-md border-bottom-0 dark:bg-dark-surface-mixed-300 rounded-[8px] px-4 text-decoration-none">
        Electric Work
      </AccordionTrigger>
      <AccordionContent className="p-4 bg-slate-50 rounded-[8px] dark:bg-dark-surface-mixed-200">
        <Tabs defaultValue={"onGrid"} className="w-full">
          <TabsList className="border-1 rounded-[8px] w-full">
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
          </TabsList>

          <TabsContent value="onGrid" className="">
            <Form
              errors={errors}
              isEdit={isEdit}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              handleSubmit={handleSubmit}
            />
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
            <Form
              errors={errors}
              isEdit={isEdit}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              handleSubmit={handleSubmit}
            />
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
            <Form
              errors={errors}
              isEdit={isEdit}
              onError={onError}
              onSubmit={onSubmit}
              register={register}
              handleSubmit={handleSubmit}
            />
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
  );
}

export default ElectricWork;

function Form({ errors, handleSubmit, isEdit, onError, onSubmit, register }) {
  return (
    <Fragment>
      <form
        className="flex flex-wrap gap-4 my-10 "
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Input
          className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.specification ? "true" : "false"}
          placeholder="specification"
          {...register("specification")}
          type="text"
        />
        <Input
          className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.unit ? "true" : "false"}
          placeholder="unit"
          {...register("unit")}
          type="text"
        />
        <Input
          className="flex-[17%] aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          aria-invalid={errors.price ? "true" : "false"}
          placeholder="price"
          {...register("price")}
          type="number"
        />

        <div className="w-full">
          <div className="w-full">
            <Button
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
            </Button>
          </div>
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
