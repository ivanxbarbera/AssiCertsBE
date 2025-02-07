// application modules
import { Municipality, MunicipalityResponse } from '../../archive/municipality/municipality.model';

/**
 * Address type.
 */
export interface AddressType {
  // address type unique identifier
  id: number;
  // address type code
  code: string;
  // address type name
  name: string;
} // AddressType

/**
 * Address type list.
 */
export interface AddressTypeList {
  // address type unique identifier
  id: number;
  // address type code
  code: string;
  // address type name
  name: string;
} // AddressTypeList

/**
 * Address type list response.
 */
export interface AddressTypeListResponse {
  // address type list
  addressTypes: AddressTypeList[];
} // AddressTypeListResponse

/**
 * Request for address type details.
 */
export interface AddressTypeRequest {
  // address type unique identifier
  id: number;
} // AddressTypeRequest

/**
 * Address type returned to caller.
 */
export interface AddressTypeResponse {
  // address type unique identifier
  id: number;
  // address type code
  code: string;
  // address type name
  name: string;
} // AddressTypeResponse

/**
 * Address toponym.
 */
export interface AddressToponym {
  // address toponym unique identifier
  id: number;
  // address toponym code
  code: string;
  // address toponym name
  name: string;
} // AddressToponym

/**
 * Address toponym list item.
 */
export interface AddressToponymList {
  // address toponym unique identifier
  id: number;
  // address toponym code
  code: string;
  // address toponym name
  name: string;
} // AddressToponym

/**
 * Address toponym list response.
 */
export interface AddressToponymListResponse {
  // address toponym list
  addressToponyms: AddressToponymList[];
} // AddressToponymListResponse

/**
 * Request for address toponym details.
 */
export interface AddressToponymRequest {
  // address toponym unique identifier
  id: number;
} // AddressToponymRequest

/**
 * Address toponym returned to caller.
 */
export interface AddressToponymResponse {
  // address toponym unique identifier
  id: number;
  // address toponym code
  code: string;
  // address toponym name
  name: string;
} // AddressToponymResponse

/**
 * Address.
 */
export interface Address {
  // address unique identifier
  id: number;
  // address type identifier
  typeId: number;
  // address toponym identifier
  toponymId: number;
  // address, street
  address: string;
  // address house number
  houseNumber: string;
  // address postal codice
  postalCode: string;
  // address municipality identifier
  municipalityId: number;
} // Address

/**
 * Request for addresses associated to a user.
 */
export interface AddressUserListRequest {
  // user unique identifier
  userId: number;
} // AddressUserListRequest

/**
 * Response for addresses associated to a user.
 */
export interface AddressListResponse {
  // address liset
  addresses: AddressResponse[];
} // AddressListResponse

/**
 * Address response.
 */
export interface AddressResponse {
  // address unique identifier
  id: number;
  // address type
  type: AddressTypeResponse;
  // address toponym
  toponym: AddressToponymResponse;
  // address, street
  address: string;
  // address house number
  houseNumber: string;
  // address postal code
  postalCode: string;
  // address municipality
  municipality: MunicipalityResponse;
} // AddressResponse

/**
 * Phone type.
 */
export interface PhoneType {
  // phone type unique identifier
  id: number;
  // phone type code
  code: string;
  // phone type name
  name: string;
} // PhoneType

/**
 * Phone type list.
 */
export interface PhoneTypeList {
  // phone type unique identifier
  id: number;
  // phone type code
  code: string;
  // phone type name
  name: string;
} // PhoneTypeList

/**
 * Phone type list response.
 */
export interface PhoneTypeListResponse {
  // phone type list
  phoneTypes: PhoneTypeList[];
} // PhoneTypeListResponse

/**
 * Phone associated to user or address.
 */
export interface Phone {
  // phone unique identifier
  id: number;
  // phone type identifier
  typeId: number;
  //  phone international prefix
  internationalPrefix: string;
  // phone prefix
  prefix: string;
  // phone number
  number: string;
} // Phone

/**
 * Phone list associated to user or address.
 * To be used in list response.
 */
export interface PhoneList {
  // phone unique identifier
  id: number;
  // phone type identifier
  type: PhoneType;
  // phone prefix
  prefix: string;
  // phone number
  number: string;
  // default phone
  default: boolean;
} // PhoneList

/**
 * Email type.
 */
export interface EmailType {
  // email type unique identifier
  id: number;
  // email type code
  code: string;
  // email type name
  name: string;
} // EmailType

/**
 * Email type list.
 */
export interface EmailTypeList {
  // email type unique identifier
  id: number;
  // email type code
  code: string;
  // email type name
  name: string;
} // EmailTypeList

/**
 * Email type list response.
 */
export interface EmailTypeListResponse {
  // email type list
  emailTypes: EmailTypeList[];
} // EmailTypeListResponse

/**
 * Request for email type details.
 */
export interface EmailTypeRequest {
  // email type unique identifier
  id: number;
} // EmailTypeRequest

/**
 * Email type returned to caller.
 */
export interface EmailTypeResponse {
  // email type unique identifier
  id: number;
  // email type code
  code: string;
  // email type name
  name: string;
} // EmailTypeResponse

/**
 * Email associated to user or address.
 */
export interface Email {
  // email unique identifier
  id?: number;
  // email type identifier
  typeId: number;
  // email address
  email: string;
} // Email

/**
 * Request for emails associated to a user.
 */
export interface EmailUserListRequest {
  // user unique identifier
  userId: number;
} // EmailUserListRequest

/**
 * Email associated to user or address returned to client.
 */
export interface EmailResponse {
  // emil unique indentificator
  id: number;
  // email address
  email: string;
  // email type
  type: EmailType;
  // default email
  default: boolean;
  // authentication email
  authentication: boolean;
} // EmailRespose

/**
 * Email associated to user or address for updating.
 */
export interface EmailEditRequest {
  // emil unique indentificator
  id?: number;
  // email address
  email: string;
  // email type
  type: EmailType;
  // default email
  default: boolean;
  // authentication email
  authentication: boolean;
} // EmailEditRequest

/**
 * Response for emails associated to a user.
 */
export interface EmailListResponse {
  // user unique identifier
  emails: EmailResponse[];
} // EmailListResponse

/**
 * Email list associated to user or address.
 * To be used in list response
 */
export interface EmailList {
  // email unique identifier
  id: number;
  // email type identifier
  type: EmailType;
  // email address
  email: string;
  // default email
  default: boolean;
} // EmailList
