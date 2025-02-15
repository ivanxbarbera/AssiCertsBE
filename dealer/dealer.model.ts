import { AddressEditRequest, AddressResponse, EmailEditRequest, EmailResponse } from '../user/address/address.model';

/**
 * Dealer data.
 */
export interface Dealer {
  // user unique identifier
  id?: number;
  // comapny name
  companyName: string;
  // vat number
  vatNumber: string;
  // fiscal code
  fiscalCode?: string;
} // Dealer

/**
 * Dealer data request.
 * Request for dealer profile details.
 */
export interface DealerRequest {
  // dealer identifier
  id: number;
} // DealerRequest

/**
 * Dealer data in respose.
 */
export interface DealerResponse {
  // dealer unique identifier
  id: number;
  // dealer emails
  emails: EmailResponse[];
  // company name
  companyName: string;
  // vat number
  vatNumber: string;
  // fiscal code
  fiscalCode?: string;
  // dealer addresses
  addresses: AddressResponse[];
} // DealerResponse

/**
 * Dealer create and update data.
 */
export interface DealerEditRequest {
  // dealer unique identifier
  id?: number;
  // dealer emails
  emails: EmailEditRequest[];
  // company name
  companyName: string;
  // vat number
  vatNumber: string;
  // fiscal code
  fiscalCode?: string;
  // dealer addresses
  addresses: AddressEditRequest[];
} // DealerEditRequest

/**
 * Single dealer data returned in dealer search.
 * This is a single element of the DealerListResponse.
 */
export interface DealerList {
  // dealer unique identifier
  id: number;
  // company name
  companyName: string;
  // dealer default email
  email: string;
  // vat number
  vatNumber: string;
} // DealerList

/**
 * Dealer search list response.
 */
export interface DealerListResponse {
  // dealer list
  dealers: DealerList[];
} // DealerListResponse

/**
 * Dealer-Email Association
 */
export interface DealerEmail {
  // dealer email unique identifier
  id?: number;
  // dealer identifier
  dealerId: number;
  // email identifier
  emailId: number;
  // default email
  default: boolean;
} // DealerEmail

/**
 * Dealer-Address Association
 */
export interface DealerAddress {
  // dealer address unique identifier
  id?: number;
  // dealer identifier
  dealerId: number;
  // address identifier
  addressId: number;
} // DealerAddress
