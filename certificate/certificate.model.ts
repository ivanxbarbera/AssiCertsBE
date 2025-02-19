// application modules
import { CustomerList, CustomerResponse } from '../customer/customer.model';
import { AddressEditRequest, AddressResponse } from '../user/address/address.model';

/**
 * Allowed type of transaction.
 */
export enum TransactionType {
  NewEmission = 'NEW',
  PostSaleUpdate = 'END',
  PolicyCancellation = 'CAN',
} // TransactionType

/**
 * Allwed type of cancelltion.
 */
export enum CancellationType {
  WithdrawalStandard = 'REC',
  CancelNewRegistration = 'DWR_IMM',
  CancelMovingAbroad = 'DWR_EST',
  CancelDeath = 'DWR_DEC',
  CancelScrapping = 'DWR_RTT',
  CancelStadardNoRefund = 'DNR_STR',
  CancelTecnical = 'ANN',
} // CancellationType

/**
 * Allowed type of fulfillment.
 */
export enum FulfillmentType {
  Email = 'E',
} // FulfillmentType

/**
 * Allowed payment type.
 */
export enum PaymentType {
  Borderaux = 'B',
} // PaymentType

/**
 * Allowed payment type.
 */
export enum PaymentFrequency {
  OneTimeAdvance = 'U',
} // PaymentFrequency

// TODO MIC add relation certificate/user

/**
 * Emitted certificate data.
 */
export interface Certificate {
  // certificate unique identifier
  id?: number;
  // user identifier
  userId: number;
  // type of transaction
  transactionType: TransactionType;
  // type of cancellation
  cancellationType?: CancellationType;
  // contract code
  clientNumber: string;
  // caller code
  callerCode: string;
  // date of call
  dateOfCall: Date;
  // transation effective date
  effectiveDate: Date;
  // policy number
  policyNumber: string;
  // fulfillment type
  fulfillmentType: FulfillmentType;
  // payment type
  paymentType: PaymentType;
  // payment frequency
  paymentFrequency: PaymentFrequency;
  // main insured product A code
  mainInsuredProductCodeA: string;
  // main insured product A option
  mainInsuredProductOptionA: string;
  // car plate number
  carPlateNumber: string;
  // car chassis number
  carChassisNumber: string;
  // car model
  carModel: string;
  // policy duration in month
  policyDurationInMonth: number;
  // customer original json
  customerOriginal?: any;
} // Certificate

/**
 * Certificate-Address Association
 */
export interface CertificateCustomer {
  // certificate customer unique identifier
  id?: number;
  // certificate identifier
  certificateId: number;
  // customer identifier
  customerId: number;
} // CertificateAddress

/**
 * Emitted certificate data.
 */
export interface CertificateEditRequest {
  // certificate unique identifier
  id?: number;
  // transation effective date
  effectiveDate: Date;
  // car plate number
  carPlateNumber: string;
  // car chassis number
  carChassisNumber: string;
  // car model
  carModel: string;
  // customer identificator
  customerId: number;
} // CertificateEditRequest

/**
 * Certificate data request.
 * Request for certificate profile details.
 */
export interface CertificateRequest {
  // certificate identifier
  id: number;
} // CertificateRequest

/**
 * Emitted certificate data.
 */
export interface CertificateResponse {
  // certificate unique identifier
  id: number;
  // type of cancellation
  cancellationType?: CancellationType;
  // contract code
  clientNumber: string;
  // caller code
  callerCode: string;
  // transation effective date
  effectiveDate: Date;
  // policy number
  policyNumber: string;
  // customer
  customer: CustomerResponse;
  // main insured product A code
  mainInsuredProductCodeA: string;
  // main insured product A option
  mainInsuredProductOptionA: string;
  // car plate number
  carPlateNumber: string;
  // car chassis number
  carChassisNumber: string;
  // car model
  carModel: string;
  // policy duration in month
  policyDurationInMonth: number;
} // CertificateResponse

/**
 * Single certificate data returned in certificate search.
 * This is a single element of the CertificateListResponse.
 */
export interface CertificateList {
  // certificate unique identifier
  id: number;
  // contract code
  clientNumber: string;
  // effective date
  effectiveDate: Date;
  // customer first name
  customerFirstName: string;
  // customer last name
  custonerLastName: string;
  // car plate number
  carPlateNumber: string;
  // car model
  carModel: string;
} // CertificateList

/**
 * Certificate search list response.
 */
export interface CertificateListResponse {
  // certificate list
  certificates: CertificateList[];
} // CertificateListResponse
