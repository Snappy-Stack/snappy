import * as migration_20260303_130919_initial_schema from './20260303_130919_initial_schema';
import * as migration_20260304_154308_add_seo_fields from './20260304_154308_add_seo_fields';

export const migrations = [
  {
    up: migration_20260303_130919_initial_schema.up,
    down: migration_20260303_130919_initial_schema.down,
    name: '20260303_130919_initial_schema',
  },
  {
    up: migration_20260304_154308_add_seo_fields.up,
    down: migration_20260304_154308_add_seo_fields.down,
    name: '20260304_154308_add_seo_fields'
  },
];
