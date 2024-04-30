export const FACTOR_TABLE = Object.freeze({
  FUEL: {
    NAME: 'fuel',
    COLUMNS: {
      ID: 'id',
      NAME: 'name',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at',
    },
  },
  UNIT: {
    NAME: 'unit',
    COLUMNS: {
      ID: 'id',
      NAME: 'name',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at',
    },
  },
  FUEL_UNIT: {
    NAME: 'fuel_unit',
    COLUMNS: {
      FUEL_ID: 'fuel_id',
      UNIT_ID: 'unit_id',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at',
    },
  },
});
