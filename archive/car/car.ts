// libraries
import { api } from 'encore.dev/api';
// application modules
import { CarManufacturerList, CarManufacturerListResponse, CarModelList, CarModelListResponse } from './car.model';
import { infocarGetMarche, infocarGetModelli } from '../../external/car/infocar';
import { InfocarDatoMarca, InfocarDatoModello } from '../../external/car/infocar.model';

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
