/**
 * Info Car Manufacturer.
 */
export interface InfocarDatoMarca {
  // manufacturer code
  codiceMarca: string;
  // manufacturer name
  descrizione: string;
} // InfocarDatoMarca

/**
 * Info Car Model.
 */
export interface InfocarDatoModello {
  // manufacturer model code
  codiceModello: string;
  // manufacturer model name
  descrizione: string;
  // manufacturer model descritpion
  descrizioneComplessa: string;
} // InfocarDatoModello

/**
 * Info Car basic web service request.
 * Contains information for authentication
 */
export interface InfocarRequest {
  // Info Car authentiction username
  userName: string;
  // Info Car authentication password
  password: string;
} // InfocarRequest

/**
 * Info Car manufactorer list request.
 */
export interface InfocarGetMarcheRequest extends InfocarRequest {
  // Info Car manufacturer request filters
  filtro: {
    auto: string;
    veicoliCommerciali: string;
    fuoristrada: string;
    moto: string;
    microvetture: string;
    casUsername: string;
  };
} // InfocarGetMarcheRequest

/**
 * Info Car manufactorer list response.
 */
export interface InfocarGetMarcheResponse {
  GetMarcheResult: {
    list: {
      DatoMarca: [InfocarDatoMarca];
    };
  };
} // InfocarGetMarcheResponse

/**
 * Info Car model list request.
 */
export interface InfocarGetModelliRequest extends InfocarRequest {
  // Info Car manufacturer models request filters
  filtro: {
    immatricolazioneDa: string;
    immatricolazioneA: string;
    alimentazione: string;
    carrozzeria: string;
    categoria: string;
    codiceMarca: string;
    casUsername: string;
  };
} // InfocarGetModelliRequest

/**
 * Info Car model list response.
 */
export interface InfocarGetModelliResponse {
  GetModelliResult: {
    list: {
      DatoModello: [InfocarDatoModello];
    };
  };
} // InfocarGetModelliResponse
