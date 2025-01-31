// libraries
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Readable } from 'stream';
import { APIError } from 'encore.dev/api';
import { secret } from 'encore.dev/config';
// application modules
import locz from '../../common/i18n';
import { IstatMunicipality, IstatMunicipalitySync } from './istat.model';

/**
 * Process ISTAT excel file and update stored data.
 * @param filePath excel file input stream
 * @returns updating process results
 */
export const istatMunicipalityProcessFile = async (stream: Readable): Promise<IstatMunicipality[]> => {
  return new Promise((resolve, reject) => {
    // read excel stream data
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    // process stream data
    stream.on('end', async () => {
      try {
        const fileBuffer = Buffer.concat(chunks);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        // read data from the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // convert sheet to JSON excluding the first row (column headers)
        const header: string[] = Array.from(Array(26)).map((_, i) => String.fromCharCode(65 + i));
        const excelRows: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: header, range: 1 });
        // process excel data
        const istatMunicipalities: IstatMunicipality[] = [];
        for (const excelRow of excelRows) {
          // get data from row
          const istatMunicipality: IstatMunicipality = {
            nationName: 'Italia',
            nationCode: 'IT',
            regionName: excelRow['K']?.toString().trim(),
            provinceName: excelRow['L']?.toString().trim(),
            provinceCode: excelRow['O']?.toString().trim(),
            municipalityName: excelRow['F']?.toString().trim(),
            municipalityCode: excelRow['T']?.toString().trim(),
          };
          // check data
          if (
            !istatMunicipality.nationName ||
            !istatMunicipality.regionName ||
            !istatMunicipality.provinceName ||
            !istatMunicipality.provinceCode ||
            !istatMunicipality.municipalityName ||
            !istatMunicipality.municipalityCode
          ) {
            console.warn('Skipping row with missing data');
            continue;
          }
          // add municipality to list
          istatMunicipalities.push(istatMunicipality);
        }
        // return istat municipality list
        resolve(istatMunicipalities);
      } catch (error) {
        // error occurred, reject changes
        reject(APIError.internal(locz().EXTERNAL_ISTAT_MUNICIPALITY_FILE_PROCESS_ERROR()));
      }
    });
    stream.on('error', (error) => {
      reject(APIError.internal(locz().EXTERNAL_ISTAT_MUNICIPALITY_FILE_GET_ERROR()));
    });
  });
}; // istatMunicipalityProcessFile

/**
 * Fetch the ISTAT file from the given URL and process it.
 * @param url the url for downloading the ISTAT excel file
 * @returns updating process results
 */
export const istatMunicipalitySync = async (request: IstatMunicipalitySync): Promise<IstatMunicipality[]> => {
  try {
    // open url stream for downloading file
    const urlResponse = await axios.get(request.url, { responseType: 'stream' });
    // process file and update municipality
    return await istatMunicipalityProcessFile(urlResponse.data);
  } catch (error) {
    if (error instanceof APIError) {
      // error processing file
      throw error;
    }
    // error getting file
    throw APIError.internal(locz().EXTERNAL_ISTAT_MUNICIPALITY_FILE_GET_ERROR());
  }
}; // istatMunicipalitySync
