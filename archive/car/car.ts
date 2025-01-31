// libraries
import { api } from 'encore.dev/api';
// application modules
import {
  CarEquipmentList,
  CarEquipmentListResponse,
  CarManufacturerList,
  CarManufacturerListResponse,
  CarModelList,
  CarModelListResponse,
} from './car.model';
import { infocarGetAllestimenti, infocarGetMarche, infocarGetModelli } from '../../external/car/infocar';
import { InfocarDatoAllestimento, InfocarDatoMarca, InfocarDatoModello } from '../../external/car/infocar.model';

/**
 * Car manufacturer list.
 */
export const carManufacturerList = api(
  { expose: true, auth: false, method: 'GET', path: '/registry/car/manufacturer' },
  async (): Promise<CarManufacturerListResponse> => {
    // list manufacturers from InfoCar
    const infocarManufacturers: InfocarDatoMarca[] = await infocarGetMarche();
    // prepare response
    const carManufacturers: CarManufacturerList[] = infocarManufacturers.map((infocarManufacurer: InfocarDatoMarca) => {
      const carManufacturer: CarManufacturerList = {
        code: infocarManufacurer.codiceMarca,
        name: infocarManufacurer.descrizione,
      };
      return carManufacturer;
    });
    const response: CarManufacturerListResponse = {
      carManufacturers: carManufacturers,
    };
    // return response
    return response;
  }
); // carManufacturerList

/**
 * Car model list.
 */
export const carModelList = api(
  { expose: true, auth: false, method: 'GET', path: '/registry/car/model' },
  async (): Promise<CarModelListResponse> => {
    // list models from InfoCar
    const infocarModels: InfocarDatoModello[] = await infocarGetModelli();
    // prepare response
    const carModels: CarModelList[] = infocarModels.map((infocarModel: InfocarDatoModello) => {
      const carModel: CarManufacturerList = {
        code: infocarModel.codiceModello,
        name: infocarModel.descrizione,
      };
      return carModel;
    });
    const response: CarModelListResponse = {
      carModels: carModels,
    };
    // return response
    return response;
  }
); // carModelList

/**
 * Car equipment list.
 */
export const carEquipmentList = api(
  { expose: true, auth: false, method: 'GET', path: '/registry/car/equipment' },
  async (): Promise<CarEquipmentListResponse> => {
    // list equipments from InfoCar
    const infocarEquipments: InfocarDatoAllestimento[] = await infocarGetAllestimenti();
    // prepare response
    const carEquipments: CarEquipmentList[] = infocarEquipments.map((infocarEquipment: InfocarDatoAllestimento) => {
      const carEquipment: CarManufacturerList = {
        code: infocarEquipment.codiceInfocar,
        name: infocarEquipment.descrizione,
      };
      return carEquipment;
    });
    const response: CarEquipmentListResponse = {
      carEquipments: carEquipments,
    };
    // return response
    return response;
  }
); // carEquipmentList
