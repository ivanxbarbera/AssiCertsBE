import {
  InfocarDatoAllestimento,
  InfocarDatoModello,
  InfocarGetAllestimentiRequest,
  InfocarGetAllestimentiResponse,
  InfocarGetMarcheResponse,
  InfocarGetModelliRequest,
  InfocarGetModelliResponse,
} from './infocar.model';
// libraries
import soap from 'soap';
// application modules
import { InfocarDatoMarca, InfocarGetMarcheRequest } from './infocar.model';
import { APIError } from 'encore.dev/api';
import locz from '../../common/i18n';

// TODO MIC convert to paramter
const SOAP_URL = 'http://localhost:8000/?wsdl';
const userName = '';
const password = '';

/**
 * List Manufacturers from Info Car.
 */
export const infocarGetMarche = async (): Promise<InfocarDatoMarca[]> => {
  try {
    // connect to Info Car web service
    const client = await soap.createClientAsync(SOAP_URL);
    // prepare Info Car manufacturer list request
    const args: InfocarGetMarcheRequest = {
      userName,
      password,
      filtro: {
        auto: 'true',
        veicoliCommerciali: 'true',
        fuoristrada: 'true',
        moto: 'false',
        microvetture: 'false',
        casUsername: '',
      },
    };
    // call Info Car
    const [result]: [InfocarGetMarcheResponse] = await client.GetMarcheAsync(args);
    // prepare response
    const response: InfocarDatoMarca[] = result.GetMarcheResult.list.DatoMarca;
    // return response
    return response;
  } catch (error) {
    if (error instanceof APIError) {
      // error getting infocar data
      throw error;
    }
    // error comunicating with infocar
    throw APIError.internal(locz().EXTERNAL_INFOCAR_GET_MARCHE_ERROR());
  }
}; // infocarGetMarche

/**
 * List Manufacturers Models from Info Car.
 */
export const infocarGetModelli = async (): Promise<InfocarDatoModello[]> => {
  try {
    // connect to Info Car web service
    const client = await soap.createClientAsync(SOAP_URL);
    // prepare Info Car manufacturer model list request
    const args: InfocarGetModelliRequest = {
      userName,
      password,
      filtro: {
        immatricolazioneDa: '',
        immatricolazioneA: '',
        alimentazione: '',
        carrozzeria: '',
        categoria: '',
        codiceMarca: '',
        casUsername: '',
      },
    };
    // call Info Car
    const [result]: [InfocarGetModelliResponse] = await client.GetModelliAsync(args);
    // prepare response
    const response: InfocarDatoModello[] = result.GetModelliResult.list.DatoModello;
    // return response
    return response;
  } catch (error) {
    if (error instanceof APIError) {
      // error getting infocar data
      throw error;
    }
    // error comunicating with infocar
    throw APIError.internal(locz().EXTERNAL_INFOCAR_GET_MODELLI_ERROR());
  }
}; // infocarGetModelli

/**
 * List Model Equipments from Info Car.
 */
export const infocarGetAllestimenti = async (): Promise<InfocarDatoAllestimento[]> => {
  try {
    // connect to Info Car web service
    const client = await soap.createClientAsync(SOAP_URL);
    // prepare Info Car equipment list request
    const args: InfocarGetAllestimentiRequest = {
      userName,
      password,
      filtro: {
        immatricolazioneDa: '',
        immatricolazioneA: '',
        alimentazione: '',
        carrozzeria: '',
        categoria: '',
        codiceModello: '',
        casUsername: '',
      },
    };
    // call Info Car
    const [result]: [InfocarGetAllestimentiResponse] = await client.GetAllestimentiAsync(args);
    // prepare response
    const response: InfocarDatoAllestimento[] = result.GetAllestimentiResult.list.DatoAllestimento;
    // return response
    return response;
  } catch (error) {
    if (error instanceof APIError) {
      // error getting infocar data
      throw error;
    }
    // error comunicating with infocar
    throw APIError.internal(locz().EXTERNAL_INFOCAR_GET_ALLESTIMENTI_ERROR());
  }
}; // infocarGetAllestimenti
