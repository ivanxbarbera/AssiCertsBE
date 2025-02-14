// application modules
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
  // customer first name
  customerFirstName: string;
  // customer middle name
  customerMiddleName: string;
  // customer last name
  customerLastName: string;
  // customer mobile telephone number
  customerMobileTelephone: string;
  // customer email address
  customerEmailAddress: string;
  // customer fiscal code
  customerFiscalCode: string;
  // customer dat of birth
  customerDateOfBirth: Date;
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
} // Certificate

/**
 * Certificate-Address Association
 */
export interface CertificateAddress {
  // certificate address unique identifier
  id?: number;
  // certificate identifier
  certificateId: number;
  // address identifier
  addressId: number;
} // CertificateAddress

/**
 * Emitted certificate data.
 */
export interface CertificateEditRequest {
  // certificate unique identifier
  id?: number;
  // transation effective date
  effectiveDate: Date;
  // customer first name
  customerFirstName: string;
  // customer middle name
  customerMiddleName: string;
  // customer last name
  customerLastName: string;
  // customer address
  customerAddress: AddressEditRequest;
  // customer mobile telephone number
  customerMobileTelephone: string;
  // customer email address
  customerEmailAddress: string;
  // customer fiscal code
  customerFiscalCode: string;
  // customer dat of birth
  customerDateOfBirth: Date;
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
  // customer first name
  customerFirstName: string;
  // customer middle name
  customerMiddleName: string;
  // customer last name
  customerLastName: string;
  // customer address
  customerAddress: AddressResponse;
  // customer mobile telephone number
  customerMobileTelephone: string;
  // customer email address
  customerEmailAddress: string;
  // customer fiscal code
  customerFiscalCode: string;
  // customer dat of birth
  customerDateOfBirth: Date;
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
} // CertificateResponse
