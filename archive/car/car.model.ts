/**
 * Car manufacturer list item.
 */
export interface CarManufacturerList {
  // car manufactorer code
  code: string;
  // car manufacturer string
  name: string;
} // CarManufacturerList

/**
 * Car manufacture response for loaded values.
 */
export interface CarManufacturerListResponse {
  // car manufacturer list
  carManufacturers: CarManufacturerList[];
} // CarManufacturerListResponse

/**
 * Car model list item.
 */
export interface CarModelList {
  // car manufactorer code
  code: string;
  // car manufacturer string
  name: string;
} // CarModelList

/**
 * Car model response for loaded values.
 */
export interface CarModelListResponse {
  // car manufacturer list
  carModels: CarModelList[];
} // CarModelListResponse

/**
 * Car equiment list item.
 */
export interface CarEquipmentList {
  // car manufactorer code
  code: string;
  // car manufacturer string
  name: string;
} // CarEquipmentList

/**
 * Car model response for loaded values.
 */
export interface CarEquipmentListResponse {
  // car manufacturer list
  carEquipments: CarEquipmentList[];
} // CarEquipmentListResponse
