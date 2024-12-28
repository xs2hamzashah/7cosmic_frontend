import React, { forwardRef } from "react";

import { cn } from "../../lib/utils";
import { FilterItemHeading } from "./FilterItemHeading";

const SizeDropdown = (
  {
    label,
    className,
    selectClassName,
    list: values,
    defaultValue,
    onChange,
    isLabel = true,
  },
  ref
) => {
  const handleOnChange = (event) => {
    onChange(event.target.value);
  };

  function isListItem(obj) {
    return typeof obj === "object" && "name" in obj && "value" in obj;
  }

  if (Array.isArray(values)) {
    // values is an array
    if (values.length > 0) {
      if (isListItem(values[0])) {
        return (
          <div
            className={cn(
              "relative bg-transparent flex flex-col justify-end",
              className
            )}
          >
            {isLabel && <FilterItemHeading title={label} className="mb-2" />}
            <select
              id="sizeDropdown"
              ref={ref}
              value={defaultValue}
              onChange={handleOnChange}
              className={cn(
                "block w-full pr-4 border-b-1 border-sky-100 focus:outline-none focus:border-sky-500 bg-transparent text-sm lowercase text-slate-700/90",
                selectClassName
              )}
            >
              <option value="" disabled>
                {defaultValue}
              </option>
              {values.map((item, _idx) => (
                <option
                  key={item.name + _idx}
                  value={item.name}
                  className="text-xs"
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (typeof values[0] === "number") {
        // values is number[]

        return (
          <div className={cn("relative bg-transparent", className)}>
            {isLabel && <FilterItemHeading title={label} className="" />}
            <select
              id="sizeDropdown"
              ref={ref}
              value={defaultValue}
              onChange={handleOnChange}
              className={cn(
                "block w-full pr-4 border-b-1 border-sky-100 focus:outline-none focus:border-sky-500 bg-transparent text-sm lowercase text-slate-700/90",
                selectClassName
              )}
            >
              <option value="" disabled>
                {defaultValue}
              </option>
              {values.map((item, _idx) => (
                <option key={_idx} value={item} className="text-xs">
                  {item}
                </option>
              ))}
            </select>
          </div>
        );
      }
    } else {
      // values is an empty array
      // console.log("values is an empty array");
    }
  } else {
    // values is neither listItem[] nor number[]
    // console.log("values is neither listItem array nor number array");
  }
};

const Dropdown = forwardRef(SizeDropdown);
export default Dropdown;
