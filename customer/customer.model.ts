import { EmailEditRequest, EmailResponse, AddressResponse, AddressEditRequest } from '../user/address/address.model';

/**
 * Custoner data.
 */
export interface Customer {
  // customer unique identifier
  id?: number;
  // customer first name
  firstName: string;
  // customer middle name
  middleName?: string;
  // customer last
  lastName: string;
  // customer fiscal code
  fiscalCode: string;
  // customer date of birth
  dateOfBirth: boolean;
} // Customer

/**
 * Customer data request.
 * Request for customer details.
 */
export interface CustomerRequest {
  // identifier of the customer
  id: number;
} // CustomerRequest

/**
 * Customer data.
 */
export interface CustomerResponse {
  // customer unique identifier
  id: number;
  // customer first name
  firstName: string;
  // customer middle name
  middleName?: string;
  // customer last
  lastName: string;
  // customer fiscal code
  fiscalCode: string;
  // customer date of birth
  dateOfBirth: boolean;
  // customer emails
  emails: EmailResponse[];
  // customer addresses
  addresses: AddressResponse[];
} // CustomerResponse

/**
 * Customer create and update data.
 */
export interface CustomerEditRequest {
  // customer unique identifier
  id?: number;
  // customer first name
  firstName: string;
  // customer middle name
  middleName?: string;
  // customer last
  lastName: string;
  // customer fiscal code
  fiscalCode: string;
  // customer date of birth
  dateOfBirth: boolean;
  // customer emails
  emails: EmailEditRequest[];
  // customer addresses
  addresses: AddressEditRequest[];
} // CustomerEditRequest

/**
 * Single customer data returned in customer search.
 * This is a single element of the CustomerListResponse.
 */
export interface CustomerList {
  // customer unique identifier
  id: number;
  // customer first name
  firstName: string;
  // customer last
  lastName: string;
  // customer fiscal code
  fiscalCode: string;
  // customer email address
  email: string;
} // CustomerList

/**
 * Customer search list response.
 */
export interface CustomerListResponse {
  // customer list
  customers: CustomerList[];
} // CustomerListResponse

/**
 * Customer-User Association
 */
export interface CustomerUser {
  // customer user unique identifier
  id?: number;
  // customer identifier
  customerId: number;
  // user identifier
  userId: number;
} // CustomerUser

/**
 * Customer-Email Association
 */
export interface CustomerEmail {
  // customer email unique identifier
  id?: number;
  // customer identifier
  customerId: number;
  // email identifier
  emailId: number;
  // default email
  default: boolean;
} // CustomerEmail

/**
 * Customer-Address Association
 */
export interface CustomerAddress {
  // customer address unique identifier
  id?: number;
  // customer identifier
  customerId: number;
  // address identifier
  addressId: number;
} // CustomerAddress
