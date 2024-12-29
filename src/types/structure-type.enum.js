// $table->enum('structure_type', ['iron_standard', 'aluminum_standard', 'ms_iron_standard'])->default('iron_standard');

const structureTypeObject = {
  ironStandard: "iron_standard",
  aluminumStandard: "aluminum_standard",
  msIronStandard: "ms_iron_standard",
};

export const structureTypeEnum = Object.freeze(structureTypeObject);
