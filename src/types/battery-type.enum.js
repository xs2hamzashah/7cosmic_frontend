// 'system_type' => 'required|in:on_grid,hybrid,vfd',

const batteryTypeObject = {
  lithium: "lithium",
  tubular: "tubular",
};

export const batteryTypeEnum = Object.freeze(batteryTypeObject);
