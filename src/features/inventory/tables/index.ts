export const INVENTORY_TABLE = Object.freeze({
  EMISSION_SOURCE: {
    NAME: 'emission_source',
    COLUMNS: {
      ID: 'id',
      DESCRIPTION: 'description',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at',
    },
  },
  EMISSION_CONSUMPTION: {
    NAME: 'emission_consumption',
    COLUMNS: {
      ID: 'id',
      YEAR: 'year',
      VALUE: 'value',
      FUEL_ID: 'fuel_id',
      UNIT_ID: 'unit_id',
      EMISSION_SOURCE_ID: 'emission_source_id',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at',
    },
  },
  EMISSION_REDUCTION: {
    NAME: 'emission_reduction',
    COLUMNS: {
      ID: 'id',
      DESCRIPTION: 'description',
      YEAR: 'year',
      VALUE: 'value',
      FUEL_ID: 'fuel_id',
      UNIT_ID: 'unit_id',
      EMISSION_SOURCE_ID: 'emission_source_id',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at',
    },
  },
});
