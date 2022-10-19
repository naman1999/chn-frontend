/**
 * List of available end points to the swagger climate engine APIs
 */
export enum End_Points {
  /**
   * Verify if the provided token is valid
   */
  // VALIDATE_KEY = '/validate_key',
  VALIDATE_KEY = '/home/validate_key', // TODO: public API
  /**
   * Request map layers from a time period
   */
  RASTER_MAPID = '/raster/mapid',
  /**
   * Get the time series
   */
  TIMESERIES_POINTS = '/timeseries/native',
  /**
   * Get min and max time period
   */
  DATASET_DATES = '/metadata/dataset_dates',
  /**
   * Get dataset variables
   */
  DATASET_VARIABLES = '/metadata/dataset_variables',
}
