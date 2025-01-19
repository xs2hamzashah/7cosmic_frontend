import { yupResolver } from "@hookform/resolvers/yup";

import { Divider } from "@nextui-org/react";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { Fragment, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import * as yup from "yup";
import { systemTypeEnum } from "../../../types/system-type.enum";
import {
  useAllQuery,
  useCreateMutation,
  useEditMutation,
} from "../../../service/priceList/inverter";
import { Input } from "../../../core/input/Input";
import { Button } from "../../../core/button/Button";
import { voltageTypeEnum } from "../../../types/voltage-type.enum";

const schema = yup
  .object({
    brand_name: yup.string().required(),
    specification: yup.string().required(),
    price: yup.number().positive().integer().required(),
    capacity: yup.number().positive().integer().required(),
    system_type: yup.mixed().oneOf(Object.values(systemTypeEnum)).required(),
    // voltage_type: yup.mixed().oneOf(Object.values(voltageTypeEnum)).required(),
    unit: yup
      .string()
      .lowercase()
      .oneOf(["watt", "kw"], "Unit must be either 'watt' or 'kw'")
      .required("Unit is required"),
    // unit: yup
    //   .string()
    //   .matches(/^[A-Za-z\s]+$/, "Unit must contain only letters")
    //   .required(),
  })
  .required();

function InverterForm({ currentId, isEdit, setIsEdit, systemType, closeForm }) {
  const [edit, editStatus] = useEditMutation();
  const { addToast } = useToasts();
  const [create, createStatus] = useCreateMutation();
  const { data: inverters } = useAllQuery({ id: "" });
  // ----------------- react-form-hook -------------------------------->
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      system_type: systemType,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit && currentId) {
        const _data = { ...data, id: currentId };
        const response = await edit(_data);

        if ("data" in response) {
          if (response.data.success) {
            reset();
            addToast(response.data.message, {
              appearance: "success",
              autoDismiss: true,
            });
          }
          setIsEdit({ bool: false, id: "" });
        } else {
          setIsEdit({ bool: false, id: "" });
        }
      } else {
        const response = await create(data);
        if ("error" in response) {
          addToast(Object.values(response.error.data).join(", "), {
            appearance: "error",
            autoDismiss: true,
          });
        }
        if ("data" in response) {
          if (response.data.success) {
            reset();
            addToast(response.data.message, {
              appearance: "success",
              autoDismiss: true,
            });
          }
        } else {
          throw new Error("Something went wrong");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeForm();
    }
  };

  const onError = () => {
    console.log(errors);
  };

  const setValues = useCallback(() => {
    const inverter = inverters?.filter((item) => item.id === currentId)[0];
    if (inverter) {
      setValue("brand_name", inverter?.brand_name);
      setValue("capacity", inverter?.capacity);
      setValue("price", inverter?.price);
      setValue("specification", inverter?.specification);
      setValue("unit", inverter?.unit);
      setValue("voltage_type", voltageTypeEnum[inverter.voltage_type]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentId]);

  useEffect(() => {
    if (isEdit) {
      setValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentId]);

  return (
    <Fragment>
      <form
        className="flex flex-col flex-wrap gap-4"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500 "
          placeholder="Brand Name i:e Huawei/Sungrow/Sofar/Solis etc"
          {...register("brand_name")}
          aria-invalid={errors.brand_name ? "true" : "false"}
        />

        <Input
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="Specification i:e SUN2000-10KTL/SH15T/10KTL-HYD TP"
          {...register("specification")}
          aria-invalid={errors.specification ? "true" : "false"}
        />

        <Input
          type="number"
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="Capacity (kW) i:e 10 / 20 / 50 / 110 etc "
          {...register("capacity")}
          aria-invalid={errors.capacity ? "true" : "false"}
        />
        <Input
          placeholder="unit"
          {...register("unit")}
          aria-invalid={errors.unit ? "true" : "false"}
          className="flex-1 py-2 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
        />

        <Input
          type="number"
          className="flex-1 py-2.5 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-100 aria-[invalid=true]:placeholder:text-red-500"
          placeholder="Enter price of Inverter in PKR i:e 320000 or 610000 etc "
          {...register("price")}
          aria-invalid={errors.price ? "true" : "false"}
        />

        <select
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

      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-dark-primary-100" />
        <div className="flex-1">
          <Divider orientation="horizontal" className=" bg-dark-primary-100" />
        </div>
      </div>
    </Fragment>
  );
}

export default InverterForm;
