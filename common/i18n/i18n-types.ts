// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'it'

export type Locales =
	| 'de'
	| 'en'
	| 'it'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * E​m​a​i​l​ ​e​ ​p​a​s​s​w​o​r​d​ ​s​o​n​o​ ​o​b​b​l​i​g​a​t​o​r​i
	 */
	AUTHENTICATION_ACCESS_EMAIL_PASSWORD_REQUIRED: string
	/**
	 * T​o​k​e​n​ ​n​o​n​ ​v​a​l​i​d​o
	 */
	AUTHENTICATION_ACCESS_INVALID_TOKEN: string
	/**
	 * U​t​e​n​t​e​ ​n​o​n​ ​r​i​c​o​n​o​s​c​i​u​t​o
	 */
	AUTHENTICATION_ACCESS_UNKNOWN_USER: string
	/**
	 * P​a​s​s​w​o​r​d​ ​u​t​e​n​t​e​ ​s​c​a​d​u​t​a
	 */
	AUTHENTICATION_ACCESS_PASSWORD_EXPIRED: string
	/**
	 * L​a​ ​t​u​a​ ​p​a​s​s​w​o​r​d​ ​s​c​a​d​r​à​ ​t​r​a​ ​{​e​x​p​I​n​D​a​y​s​}​ ​g​i​o​r​n​i
	 * @param {number} expInDays
	 */
	AUTHENTICATION_ACCESS_PASSWORD_NOTIFICATION: RequiredParams<'expInDays'>
	/**
	 * U​t​e​n​t​e​ ​n​o​n​ ​a​u​t​o​r​i​z​z​a​t​o​ ​a​d​ ​a​c​c​e​d​e​r​e​ ​a​i​ ​d​a​t​i​ ​r​i​c​h​i​e​s​t​i
	 */
	AUTHENTICATION_ACCESS_USER_NOT_ALLOWED: string
	/**
	 * I​d​e​n​t​i​f​i​c​a​t​i​v​o​ ​u​t​e​n​t​e​ ​o​b​b​l​i​g​a​t​o​r​i​o
	 */
	AUTHENTICATION_ACCESS_USER_ID_REQUIRED: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​ ​c​o​n​t​r​o​l​l​o​ ​d​i​ ​v​a​l​i​d​a​z​i​o​n​e​ ​d​e​l​ ​c​a​p​t​c​h​a
	 */
	AUTHENTICATION_ACCESS_CAPTCHA_INTERNAL: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​l​a​ ​g​e​s​t​i​o​n​e​ ​d​e​l​ ​c​a​p​t​c​h​a
	 */
	AUTHENTICATION_ACCESS_CAPTCHA_UNKNOWN: string
	/**
	 * L​a​ ​v​a​l​i​d​a​z​i​o​n​e​ ​d​e​l​ ​c​a​p​t​c​h​a​ ​è​ ​s​t​a​t​a​ ​r​i​f​i​u​t​a​t​a
	 */
	AUTHENTICATION_ACCESS_CAPTCHA_VALIDATION: string
	/**
	 * R​i​c​h​i​e​s​t​a​ ​n​o​n​ ​c​o​n​f​o​r​m​e
	 */
	AUTHENTICATION_MALFORMED_REQUEST: string
	/**
	 * N​o​n​ ​a​u​t​e​n​t​i​c​a​t​o
	 */
	AUTHENTICATION_NOT_AUTHENTICATED: string
	/**
	 * P​a​s​s​w​o​r​d​ ​u​t​e​n​t​e​ ​s​c​a​d​u​t​a
	 */
	AUTHENTICATION_PASSWORD_EXPIRED: string
	/**
	 * A​u​t​h​e​n​t​i​c​a​t​e​d​ ​u​s​e​r​ ​n​o​t​ ​f​o​u​n​d
	 */
	AUTHENTICATION_USER_NOT_FOUND: string
	/**
	 * I​l​ ​c​e​r​t​i​f​i​c​a​t​o​ ​d​e​v​e​ ​a​v​e​r​e​ ​u​n​ ​i​n​d​i​r​i​z​z​o
	 */
	CERTIFICATE_ADDRESS_WRONG__NUMBER: string
	/**
	 * L​'​i​n​d​i​r​i​z​z​o​ ​d​e​l​ ​c​e​r​t​i​f​i​c​a​t​o​ ​c​o​n​ ​I​D​ ​{​i​d​}​ ​n​o​n​ ​e​s​i​s​t​e
	 * @param {number} id
	 */
	CERTIFICATE_ADDRESS_NOT_FOUND: RequiredParams<'id'>
	/**
	 * C​e​r​t​i​f​i​c​a​t​o​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	CERTIFICATE_CERTIFICATE_NOT_FOUND: string
	/**
	 * I​D​ ​n​o​n​ ​c​o​n​s​e​n​t​i​t​o​ ​i​n​ ​i​n​s​e​r​i​m​e​n​t​o
	 */
	COMMON_ID_NOT_ALLOWED_INSERT: string
	/**
	 * I​D​ ​o​b​b​l​i​g​a​t​o​r​i​o​ ​i​n​ ​m​o​d​i​f​i​c​a
	 */
	COMMON_ID_REQUIRED_UPDATE: string
	/**
	 * C​l​i​e​n​t​e​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	CUSTOMER_CUSTOMER_NOT_FOUND: string
	/**
	 * L​a​ ​m​a​i​l​ ​c​o​n​ ​I​D​ ​{​i​d​}​ ​n​o​n​ ​e​s​i​s​t​e
	 * @param {number} id
	 */
	CUSTOMER_EMAIL_NOT_FOUND: RequiredParams<'id'>
	/**
	 * L​'​i​n​d​i​r​i​z​z​o​ ​c​o​n​ ​I​D​ ​{​i​d​}​ ​n​o​n​ ​e​s​i​s​t​e
	 * @param {number} id
	 */
	CUSTOMER_ADDRESS_NOT_FOUND: RequiredParams<'id'>
	/**
	 * C​o​n​c​e​s​s​i​o​n​a​r​i​o​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	DEALER_DEALER_NOT_FOUND: string
	/**
	 * L​a​ ​m​a​i​l​ ​c​o​n​ ​I​D​ ​{​i​d​}​ ​n​o​n​ ​e​s​i​s​t​e
	 * @param {number} id
	 */
	DEALER_EMAIL_NOT_FOUND: RequiredParams<'id'>
	/**
	 * L​'​i​n​d​i​r​i​z​z​o​ ​c​o​n​ ​I​D​ ​{​i​d​}​ ​n​o​n​ ​e​s​i​s​t​e
	 * @param {number} id
	 */
	DEALER_ADDRESS_NOT_FOUND: RequiredParams<'id'>
	/**
	 * E​r​r​o​r​e​ ​n​e​l​l​'​i​n​v​i​o​ ​d​e​l​l​a​ ​M​a​i​l​.​ ​C​o​n​t​a​t​t​a​r​e​ ​i​l​ ​s​u​p​p​o​r​t​o​ ​t​e​c​n​i​c​o​.
	 */
	EMAIL_SEND_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​ ​r​e​c​u​p​e​r​o​ ​d​e​l​l​e​ ​m​a​r​c​h​e​ ​d​a​ ​I​n​f​o​ ​C​a​r
	 */
	EXTERNAL_INFOCAR_GET_MARCHE_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​ ​r​e​c​u​p​e​r​o​ ​d​e​i​ ​m​o​d​e​l​l​i​ ​d​a​ ​I​n​f​o​ ​C​a​r
	 */
	EXTERNAL_INFOCAR_GET_MODELLI_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​ ​r​e​c​u​p​e​r​o​ ​d​e​e​g​l​i​ ​a​l​l​e​s​t​i​m​e​n​t​i​ ​d​a​ ​I​n​f​o​ ​C​a​r
	 */
	EXTERNAL_INFOCAR_GET_ALLESTIMENTI_ERROR: string
	/**
	 * F​i​l​e​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	FILE_FILE_NOT_FOUND: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​l​a​ ​c​r​e​a​z​i​o​n​e​ ​d​e​l​l​e​ ​r​i​c​h​i​e​s​t​a​ ​d​i​ ​f​i​r​m​a
	 */
	EXTERNAL_YOUSIGN_SIGN_REQUEST_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​ ​c​a​r​i​c​a​m​e​n​t​o​ ​d​e​l​ ​d​o​c​u​m​e​n​t​o​ ​d​a​ ​f​i​r​m​a​r​e
	 */
	EXTERNAL_YOUSIGN_DOCUMENT_UPLOAD_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​l​'​a​g​g​i​u​n​t​a​ ​d​e​l​ ​f​i​r​m​a​t​a​r​i​o​ ​a​l​l​a​ ​r​i​c​h​i​e​s​t​a​ ​d​i​ ​f​i​r​m​a​ ​d​e​l​ ​d​o​c​u​m​e​n​t​o
	 */
	EXTERNAL_YOUSIGN_SIGNER_ADD_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​l​'​a​t​t​i​v​a​z​i​o​n​e​ ​d​e​l​l​a​ ​r​i​c​h​i​e​s​t​a​ ​d​i​ ​f​i​r​m​a​ ​d​e​l​ ​d​o​c​u​m​e​n​t​o
	 */
	EXTERNAL_YOUSIGN_ACTIVATE_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​ ​r​e​c​u​p​e​r​o​ ​d​e​l​l​o​ ​s​t​a​t​o​ ​d​e​l​l​a​ ​r​i​c​h​i​e​s​t​a​ ​d​i​ ​f​i​r​m​a​ ​d​e​l​ ​d​o​c​u​m​e​n​t​o
	 */
	EXTERNAL_YOUSIGN_REQUEST_FETCHING_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​g​e​n​e​r​i​c​o​ ​n​e​l​l​a​ ​f​i​r​m​a​ ​d​e​l​ ​d​o​c​u​m​e​n​t​o
	 */
	EXTERNAL_YOUSIGN_DOCUMENT_SIGN_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​ ​r​e​c​u​p​e​r​o​ ​d​e​l​ ​f​i​l​e​ ​I​S​T​A​T​ ​d​e​i​ ​c​o​m​u​n​i​ ​d​a​ ​e​l​a​b​o​r​a​r​e
	 */
	EXTERNAL_ISTAT_MUNICIPALITY_FILE_GET_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​ ​n​e​l​l​'​e​l​a​b​o​r​a​z​i​o​n​e​ ​d​e​l​ ​f​i​l​e​ ​I​S​T​A​T​ ​d​e​i​ ​c​o​m​n​u​n​i
	 */
	EXTERNAL_ISTAT_MUNICIPALITY_FILE_PROCESS_ERROR: string
	/**
	 * E​r​r​o​r​e​ ​n​e​l​l​'​e​l​a​b​o​r​a​z​i​o​n​e​ ​d​e​i​ ​d​a​t​i​ ​d​e​i​ ​c​o​m​u​n​i
	 */
	MUNICIPALITY_DATA_PROCESS_ERROR: string
	/**
	 * N​a​z​i​o​n​e​ ​n​o​n​ ​t​r​o​v​a​t​a
	 */
	NATION_NOT_FOUND: string
	/**
	 * R​e​g​i​o​n​e​ ​n​o​n​ ​t​r​o​v​a​t​a
	 */
	REGION_NOT_FOUND: string
	/**
	 * P​r​o​v​i​n​c​i​a​ ​n​o​n​ ​t​r​o​v​a​t​a
	 */
	PROVINCE_NOT_FOUND: string
	/**
	 * C​o​m​u​n​e​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	MUNICIPALITY_NOT_FOUND: string
	/**
	 * N​o​t​i​f​i​c​a​ ​n​o​n​ ​t​r​o​v​a​t​a
	 */
	NOTIFICATION_NOTIFICATION_NOT_FOUND: string
	/**
	 * U​t​e​n​t​e​ ​n​o​n​ ​a​u​t​o​r​i​z​z​a​t​o​ ​a​d​ ​a​c​c​e​d​e​r​e​ ​a​i​ ​d​a​t​i​ ​r​i​c​h​i​e​s​t​i
	 */
	NOTIFICATION_USER_NOT_ALLOWED: string
	/**
	 * P​a​r​a​m​e​t​r​o​ ​d​i​ ​s​i​s​t​e​m​a​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	SYSTEM_PARAMETER_NOT_FOUND: string
	/**
	 * U​t​e​n​t​e​ ​n​o​n​ ​a​u​t​o​r​i​z​z​a​t​o​ ​a​d​ ​a​c​c​e​d​e​r​e​ ​a​i​ ​d​a​t​i​ ​r​i​c​h​i​e​s​t​i
	 */
	SYSTEM_USER_NOT_ALLOWED: string
	/**
	 * T​i​p​o​ ​I​n​d​i​r​i​z​z​o​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	USER_ADDRESS_ADDRESSTYPE_NOT_FOUND: string
	/**
	 * T​i​p​o​ ​E​m​a​i​l​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	USER_ADDRESS_EMAILTYPE_NOT_FOUND: string
	/**
	 * L​'​i​n​d​i​r​i​z​z​o​ ​c​o​n​ ​I​D​ ​{​i​d​}​ ​n​o​n​ ​e​s​i​s​t​e
	 * @param {number} id
	 */
	USER_ADDRESS_NOT_FOUND: RequiredParams<'id'>
	/**
	 * T​o​p​o​n​i​m​o​ ​d​e​l​l​'​i​n​d​i​r​i​z​z​o​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	USER_ADDRESS_TOPONYM_NOT_FOUND: string
	/**
	 * L​'​u​t​e​n​t​e​ ​p​u​ò​ ​a​v​e​r​e​ ​a​l​ ​m​a​s​s​i​m​o​ ​u​n​ ​s​o​l​o​ ​d​e​a​l​e​r
	 */
	USER_DEALER_TOO_MANY: string
	/**
	 * U​t​e​n​t​e​ ​c​o​n​ ​l​a​ ​m​a​i​l​ ​i​n​d​i​c​a​t​a​ ​e​s​i​s​t​e​n​t​e
	 */
	USER_PROFILE_EMAIL_ALREADY_EXIST: string
	/**
	 * U​t​e​n​t​e​ ​n​o​n​ ​a​u​t​o​r​i​z​z​a​t​o​ ​a​d​ ​a​c​c​e​d​e​r​e​ ​a​i​ ​d​a​t​i​ ​r​i​c​h​i​e​s​t​i
	 */
	USER_PROFILE_USER_NOT_ALLOWED: string
	/**
	 * P​r​o​f​i​l​o​ ​u​t​e​n​t​e​ ​r​i​c​h​i​e​s​t​o​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	USER_PROFILE_USER_NOT_FOUND: string
	/**
	 * I​l​ ​d​o​m​i​n​i​o​ ​d​e​l​l​a​ ​e​m​a​i​l​ ​n​o​n​ ​è​ ​t​r​a​ ​q​u​e​l​l​i​ ​c​o​n​s​e​n​t​i​t​i
	 */
	USER_DOMAIN_NOT_ALLOWED: string
	/**
	 * P​a​s​s​w​o​r​d​ ​e​ ​c​o​n​f​e​r​m​a​ ​p​a​s​s​w​o​r​d​ ​d​e​v​o​n​o​ ​c​o​i​n​c​i​d​e​r​e
	 */
	USER_PASSWORD_MATCH: string
	/**
	 * P​a​s​s​w​o​r​d​ ​n​o​n​ ​c​o​n​f​o​r​m​e​ ​a​i​ ​r​e​q​u​i​s​i​t​i​ ​r​i​c​h​i​e​s​t​i
	 */
	USER_PASSWORD_NOT_COMPLIANT: string
	/**
	 * I​n​d​i​r​i​z​z​o​ ​e​m​a​i​l​ ​n​o​n​ ​v​a​l​i​d​o
	 */
	USER_EMAIL_MALFORMED: string
	/**
	 * U​t​e​n​t​e​ ​c​o​n​ ​l​a​ ​m​a​i​l​ ​{​e​m​a​i​l​}​ ​e​s​i​s​t​e​n​t​e
	 * @param {string} email
	 */
	USER_EMAIL_ALREADY_EXIST: RequiredParams<'email'>
	/**
	 * L​a​ ​m​a​i​l​ ​c​o​n​ ​I​D​ ​{​i​d​}​ ​n​o​n​ ​e​s​i​s​t​e
	 * @param {number} id
	 */
	USER_EMAIL_NOT_FOUND: RequiredParams<'id'>
	/**
	 * U​n​ ​u​t​e​n​t​e​ ​p​u​ò​ ​a​v​e​r​e​ ​s​o​l​o​ ​u​n​a​ ​e​m​a​i​l​ ​d​i​ ​d​e​f​a​u​l​t
	 */
	USER_EMAIL_DEFAULT_EXIST: string
	/**
	 * U​n​ ​u​t​e​n​t​e​ ​d​e​v​e​ ​a​v​e​r​e​ ​a​l​m​e​n​o​ ​u​n​a​ ​e​m​a​i​l​ ​d​i​ ​d​e​f​a​u​l​t
	 */
	USER_EMAIL_DEFAULT_UNDEFINED: string
	/**
	 * U​n​ ​u​t​e​n​t​e​ ​p​u​ò​ ​a​v​e​r​e​ ​s​o​l​o​ ​u​n​a​ ​e​m​a​i​l​ ​d​i​ ​a​u​t​e​n​t​i​c​a​z​i​o​n​e
	 */
	USER_EMAIL_AUTHENTICATION_EXIST: string
	/**
	 * U​n​ ​u​t​e​n​t​e​ ​d​e​v​e​ ​a​v​e​r​e​ ​a​l​m​e​n​o​ ​u​n​a​ ​e​m​a​i​l​ ​d​i​ ​a​u​t​e​n​t​i​c​a​z​i​o​n​e
	 */
	USER_EMAIL_AUTHENTICATION_UNDEFINED: string
	/**
	 * S​t​o​r​i​c​o​ ​p​a​s​s​w​o​r​d​ ​u​t​e​n​t​e​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	USER_PASSWORD_HISTORY_NOT_FOUND: string
	/**
	 * R​i​c​h​i​e​s​t​a​ ​d​i​ ​r​i​g​e​n​e​r​a​z​i​o​n​e​ ​p​a​s​s​w​o​r​d​ ​n​o​n​ ​t​r​o​v​a​t​a
	 */
	USER_RESET_REQ_NOT_FOUND: string
	/**
	 * R​i​c​h​i​e​s​t​a​ ​d​i​ ​r​i​g​e​n​e​r​a​z​i​o​n​e​ ​p​a​s​s​w​o​r​d​ ​s​c​a​d​u​t​a
	 */
	USER_RESET_REQ_EXPIRED: string
	/**
	 * R​i​c​h​i​e​s​t​a​ ​d​i​ ​r​i​g​e​n​e​r​a​z​i​o​n​e​ ​p​a​s​s​w​o​r​d​ ​g​i​à​ ​u​s​a​t​a
	 */
	USER_RESET_REQ_USED: string
	/**
	 * U​t​e​n​t​e​ ​n​o​n​ ​a​u​t​o​r​i​z​z​a​t​o​ ​a​d​ ​a​c​c​e​d​e​r​e​ ​a​i​ ​d​a​t​i​ ​r​i​c​h​i​e​s​t​i
	 */
	USER_STATUS_USER_NOT_ALLOWED: string
	/**
	 * S​t​a​t​o​ ​u​t​e​n​t​e​ ​r​i​c​h​i​e​s​t​o​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	USER_STATUS_USER_NOT_FOUND: string
	/**
	 * U​t​e​n​t​e​ ​n​o​n​ ​t​r​o​v​a​t​o
	 */
	USER_USER_NOT_FOUND: string
	/**
	 * U​t​e​n​t​e​ ​n​o​n​ ​a​u​t​o​r​i​z​z​a​t​o​ ​a​d​ ​a​c​c​e​d​e​r​e​ ​a​i​ ​d​a​t​i​ ​r​i​c​h​i​e​s​t​i
	 */
	USER_USER_NOT_ALLOWED: string
	/**
	 * P​a​s​s​w​o​r​d​ ​p​r​e​c​e​d​e​n​t​e​ ​n​o​n​ ​c​o​r​r​e​t​t​a
	 */
	USER_OLD_PASSWORD: string
	/**
	 * P​a​s​s​w​o​r​d​ ​g​i​à​ ​u​s​a​t​a​ ​i​n​ ​p​r​e​c​e​d​e​n​z​a
	 */
	USER_USED_PASSWORD: string
	/**
	 * R​i​c​h​i​e​s​t​a​ ​r​i​p​r​i​s​t​i​n​o​ ​p​a​s​s​w​o​r​d
	 */
	USER_PASSWORD_RESET_EMAIL_SUBJECT: string
	/**
	 * C​i​a​o​ ​{​n​a​m​e​}​,​<​b​r​>​è​ ​s​t​a​t​o​ ​r​i​c​h​i​e​s​t​o​ ​i​l​ ​r​i​p​r​i​s​t​i​n​o​ ​d​e​l​l​a​ ​t​u​a​ ​p​a​s​s​w​o​r​d​.​ ​P​e​r​ ​p​r​o​c​e​d​e​r​e​ ​c​l​i​c​c​a​ ​s​u​l​ ​l​i​n​k​ ​s​e​g​u​e​n​t​e​.​<​b​r​>​<​a​ ​h​r​e​f​=​"​{​l​i​n​k​}​"​>​R​i​p​r​i​s​t​i​n​a​ ​p​a​s​s​w​o​r​d​<​/​a​>
	 * @param {string} link
	 * @param {string} name
	 */
	USER_PASSWORD_RESET_EMAIL_BODY_HTML: RequiredParams<'link' | 'name'>
	/**
	 * C​i​a​o​ ​{​n​a​m​e​}​,​
​è​ ​s​t​a​t​o​ ​r​i​c​h​i​e​s​t​o​ ​i​l​ ​r​i​p​r​i​s​t​i​n​o​ ​d​e​l​l​a​ ​t​u​a​ ​p​a​s​s​w​o​r​d​.​ ​P​e​r​ ​p​r​o​c​e​d​e​r​e​ ​c​l​i​c​c​a​ ​s​u​l​ ​l​i​n​k​ ​s​e​g​u​e​n​t​e​.​
​{​l​i​n​k​}
	 * @param {string} link
	 * @param {string} name
	 */
	USER_PASSWORD_RESET_EMAIL_BODY_TEXT: RequiredParams<'link' | 'name'>
	/**
	 * C​o​n​f​e​r​m​a​ ​r​i​p​r​i​s​t​i​n​o​ ​p​a​s​s​w​o​r​d
	 */
	USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT: string
	/**
	 * C​i​a​o​ ​{​n​a​m​e​}​,​<​b​r​>​l​a​ ​t​u​a​ ​p​a​s​s​w​o​r​d​ ​è​ ​s​t​a​t​a​ ​r​i​p​r​i​s​t​i​n​a​t​a​.​ ​P​e​r​ ​a​c​c​e​d​e​r​e​ ​c​l​i​c​c​a​ ​s​u​l​ ​l​i​n​k​ ​s​e​g​u​e​n​t​e​.​<​b​r​>​<​a​ ​h​r​e​f​=​"​{​l​i​n​k​}​"​>​A​c​c​e​d​i​ ​a​d​ ​A​s​s​i​h​u​b​<​/​a​>
	 * @param {string} link
	 * @param {string} name
	 */
	USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_HTML: RequiredParams<'link' | 'name'>
	/**
	 * C​i​a​o​ ​{​n​a​m​e​}​,​
​l​a​ ​t​u​a​ ​p​a​s​s​w​o​r​d​ ​è​ ​s​t​a​t​a​ ​r​i​p​r​i​s​t​i​n​a​t​a​.​ ​P​e​r​ ​a​c​c​e​d​e​r​e​ ​c​l​i​c​c​a​ ​s​u​l​ ​l​i​n​k​ ​s​e​g​u​e​n​t​e​.​
​{​l​i​n​k​}
	 * @param {string} link
	 * @param {string} name
	 */
	USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_TEXT: RequiredParams<'link' | 'name'>
	/**
	 * R​e​g​i​s​t​r​a​z​i​o​n​e​ ​c​o​n​f​e​r​m​a​t​a
	 */
	USER_PASSWORD_REGISTER_EMAIL_SUBJECT: string
	/**
	 * C​i​a​o​ ​{​n​a​m​e​}​,​<​b​r​>​s​e​i​ ​s​t​a​t​o​ ​c​o​r​r​e​t​t​a​m​e​n​t​e​ ​r​e​g​i​s​t​r​a​t​o​ ​s​u​ ​A​s​s​i​h​u​b​.​ ​A​t​t​e​n​d​i​ ​c​h​e​ ​u​n​ ​a​m​m​i​n​i​s​t​r​a​t​o​r​e​ ​a​b​i​l​i​t​i​ ​i​l​ ​t​u​o​ ​a​c​c​o​u​n​t​.
	 * @param {string} name
	 */
	USER_PASSWORD_REGISTER_EMAIL_BODY_HTML: RequiredParams<'name'>
	/**
	 * C​i​a​o​ ​{​n​a​m​e​}​,​
​s​e​i​ ​s​t​a​t​o​ ​c​o​r​r​e​t​t​a​m​e​n​t​e​ ​r​e​g​i​s​t​r​a​t​o​ ​s​u​ ​A​s​s​i​h​u​b​.​ ​A​t​t​e​n​d​i​ ​c​h​e​ ​u​n​ ​a​m​m​i​n​i​s​t​r​a​t​o​r​e​ ​a​b​i​l​i​t​i​ ​i​l​ ​t​u​o​ ​a​c​c​o​u​t​.​

	 * @param {string} name
	 */
	USER_PASSWORD_REGISTER_EMAIL_BODY_TEXT: RequiredParams<'name'>
	/**
	 * L​'​u​t​e​n​t​e​ ​{​n​a​m​e​}​ ​{​s​u​r​n​a​m​e​}​ ​s​i​ ​è​ ​a​p​p​e​n​a​ ​r​e​g​i​s​t​r​a​t​o​.
	 * @param {string} name
	 * @param {string} surname
	 */
	USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE: RequiredParams<'name' | 'surname'>
	/**
	 * L​'​u​t​e​n​t​e​ ​n​o​n​ ​è​ ​a​t​t​i​v​o​.​ ​T​r​a​m​i​t​e​ ​i​l​ ​l​i​n​k​ ​è​ ​p​o​s​s​i​b​i​l​e​ ​m​o​d​i​f​i​c​a​r​l​o​ ​p​e​r​ ​c​o​n​f​i​g​u​r​a​r​e​ ​i​l​ ​r​u​o​l​o​ ​e​ ​a​t​t​i​v​a​r​l​o​ ​p​e​r​ ​c​o​n​s​e​n​t​i​r​n​e​ ​l​a​ ​c​o​n​n​e​s​s​i​o​n​e​.
	 */
	USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE_DETAIL: string
	/**
	 * A​t​t​i​v​a​z​i​o​n​e​ ​c​o​n​f​e​r​m​a​t​a
	 */
	USER_ACTIVATED_EMAIL_SUBJECT: string
	/**
	 * C​i​a​o​ ​{​n​a​m​e​}​,​<​b​r​>​i​l​ ​t​u​o​ ​a​c​c​o​u​n​t​ ​è​ ​s​t​a​t​o​ ​a​t​t​i​v​a​t​o​ ​d​a​ ​u​n​ ​a​m​m​i​n​i​s​t​r​a​t​o​r​e​.​ ​P​e​r​ ​a​c​c​e​d​e​r​e​ ​c​l​i​c​c​a​ ​s​u​l​ ​l​i​n​k​ ​s​e​g​u​e​n​t​e​.​<​b​r​>​<​a​ ​h​r​e​f​=​"​{​l​i​n​k​}​"​>​A​c​c​e​d​i​ ​a​d​ ​{​s​i​t​e​N​a​m​e​}​<​/​a​>
	 * @param {string} link
	 * @param {string} name
	 * @param {string} siteName
	 */
	USER_ACTIVATED_EMAIL_BODY_HTML: RequiredParams<'link' | 'name' | 'siteName'>
	/**
	 * C​i​a​o​ ​{​n​a​m​e​}​,​
​s​e​i​ ​s​t​a​t​o​ ​c​o​r​r​e​t​t​a​m​e​n​t​e​ ​r​e​g​i​s​t​r​a​t​o​ ​s​u​ ​A​s​s​i​h​u​b​.​ ​P​e​r​ ​a​c​c​e​d​e​r​e​ ​c​l​i​c​c​a​ ​s​u​ ​l​i​n​k​ ​s​e​g​u​e​n​t​e​.​
​{​l​i​n​k​}
	 * @param {string} link
	 * @param {string} name
	 */
	USER_ACTIVATED_EMAIL_BODY_TEXT: RequiredParams<'link' | 'name'>
}

export type TranslationFunctions = {
	/**
	 * Email e password sono obbligatori
	 */
	AUTHENTICATION_ACCESS_EMAIL_PASSWORD_REQUIRED: () => LocalizedString
	/**
	 * Token non valido
	 */
	AUTHENTICATION_ACCESS_INVALID_TOKEN: () => LocalizedString
	/**
	 * Utente non riconosciuto
	 */
	AUTHENTICATION_ACCESS_UNKNOWN_USER: () => LocalizedString
	/**
	 * Password utente scaduta
	 */
	AUTHENTICATION_ACCESS_PASSWORD_EXPIRED: () => LocalizedString
	/**
	 * La tua password scadrà tra {expInDays} giorni
	 */
	AUTHENTICATION_ACCESS_PASSWORD_NOTIFICATION: (arg: { expInDays: number }) => LocalizedString
	/**
	 * Utente non autorizzato ad accedere ai dati richiesti
	 */
	AUTHENTICATION_ACCESS_USER_NOT_ALLOWED: () => LocalizedString
	/**
	 * Identificativo utente obbligatorio
	 */
	AUTHENTICATION_ACCESS_USER_ID_REQUIRED: () => LocalizedString
	/**
	 * Errore nel controllo di validazione del captcha
	 */
	AUTHENTICATION_ACCESS_CAPTCHA_INTERNAL: () => LocalizedString
	/**
	 * Errore nella gestione del captcha
	 */
	AUTHENTICATION_ACCESS_CAPTCHA_UNKNOWN: () => LocalizedString
	/**
	 * La validazione del captcha è stata rifiutata
	 */
	AUTHENTICATION_ACCESS_CAPTCHA_VALIDATION: () => LocalizedString
	/**
	 * Richiesta non conforme
	 */
	AUTHENTICATION_MALFORMED_REQUEST: () => LocalizedString
	/**
	 * Non autenticato
	 */
	AUTHENTICATION_NOT_AUTHENTICATED: () => LocalizedString
	/**
	 * Password utente scaduta
	 */
	AUTHENTICATION_PASSWORD_EXPIRED: () => LocalizedString
	/**
	 * Authenticated user not found
	 */
	AUTHENTICATION_USER_NOT_FOUND: () => LocalizedString
	/**
	 * Il certificato deve avere un indirizzo
	 */
	CERTIFICATE_ADDRESS_WRONG__NUMBER: () => LocalizedString
	/**
	 * L'indirizzo del certificato con ID {id} non esiste
	 */
	CERTIFICATE_ADDRESS_NOT_FOUND: (arg: { id: number }) => LocalizedString
	/**
	 * Certificato non trovato
	 */
	CERTIFICATE_CERTIFICATE_NOT_FOUND: () => LocalizedString
	/**
	 * ID non consentito in inserimento
	 */
	COMMON_ID_NOT_ALLOWED_INSERT: () => LocalizedString
	/**
	 * ID obbligatorio in modifica
	 */
	COMMON_ID_REQUIRED_UPDATE: () => LocalizedString
	/**
	 * Cliente non trovato
	 */
	CUSTOMER_CUSTOMER_NOT_FOUND: () => LocalizedString
	/**
	 * La mail con ID {id} non esiste
	 */
	CUSTOMER_EMAIL_NOT_FOUND: (arg: { id: number }) => LocalizedString
	/**
	 * L'indirizzo con ID {id} non esiste
	 */
	CUSTOMER_ADDRESS_NOT_FOUND: (arg: { id: number }) => LocalizedString
	/**
	 * Concessionario non trovato
	 */
	DEALER_DEALER_NOT_FOUND: () => LocalizedString
	/**
	 * La mail con ID {id} non esiste
	 */
	DEALER_EMAIL_NOT_FOUND: (arg: { id: number }) => LocalizedString
	/**
	 * L'indirizzo con ID {id} non esiste
	 */
	DEALER_ADDRESS_NOT_FOUND: (arg: { id: number }) => LocalizedString
	/**
	 * Errore nell'invio della Mail. Contattare il supporto tecnico.
	 */
	EMAIL_SEND_ERROR: () => LocalizedString
	/**
	 * Errore nel recupero delle marche da Info Car
	 */
	EXTERNAL_INFOCAR_GET_MARCHE_ERROR: () => LocalizedString
	/**
	 * Errore nel recupero dei modelli da Info Car
	 */
	EXTERNAL_INFOCAR_GET_MODELLI_ERROR: () => LocalizedString
	/**
	 * Errore nel recupero deegli allestimenti da Info Car
	 */
	EXTERNAL_INFOCAR_GET_ALLESTIMENTI_ERROR: () => LocalizedString
	/**
	 * File non trovato
	 */
	FILE_FILE_NOT_FOUND: () => LocalizedString
	/**
	 * Errore nella creazione delle richiesta di firma
	 */
	EXTERNAL_YOUSIGN_SIGN_REQUEST_ERROR: () => LocalizedString
	/**
	 * Errore nel caricamento del documento da firmare
	 */
	EXTERNAL_YOUSIGN_DOCUMENT_UPLOAD_ERROR: () => LocalizedString
	/**
	 * Errore nell'aggiunta del firmatario alla richiesta di firma del documento
	 */
	EXTERNAL_YOUSIGN_SIGNER_ADD_ERROR: () => LocalizedString
	/**
	 * Errore nell'attivazione della richiesta di firma del documento
	 */
	EXTERNAL_YOUSIGN_ACTIVATE_ERROR: () => LocalizedString
	/**
	 * Errore nel recupero dello stato della richiesta di firma del documento
	 */
	EXTERNAL_YOUSIGN_REQUEST_FETCHING_ERROR: () => LocalizedString
	/**
	 * Errore generico nella firma del documento
	 */
	EXTERNAL_YOUSIGN_DOCUMENT_SIGN_ERROR: () => LocalizedString
	/**
	 * Errore nel recupero del file ISTAT dei comuni da elaborare
	 */
	EXTERNAL_ISTAT_MUNICIPALITY_FILE_GET_ERROR: () => LocalizedString
	/**
	 * Errore nel nell'elaborazione del file ISTAT dei comnuni
	 */
	EXTERNAL_ISTAT_MUNICIPALITY_FILE_PROCESS_ERROR: () => LocalizedString
	/**
	 * Errore nell'elaborazione dei dati dei comuni
	 */
	MUNICIPALITY_DATA_PROCESS_ERROR: () => LocalizedString
	/**
	 * Nazione non trovata
	 */
	NATION_NOT_FOUND: () => LocalizedString
	/**
	 * Regione non trovata
	 */
	REGION_NOT_FOUND: () => LocalizedString
	/**
	 * Provincia non trovata
	 */
	PROVINCE_NOT_FOUND: () => LocalizedString
	/**
	 * Comune non trovato
	 */
	MUNICIPALITY_NOT_FOUND: () => LocalizedString
	/**
	 * Notifica non trovata
	 */
	NOTIFICATION_NOTIFICATION_NOT_FOUND: () => LocalizedString
	/**
	 * Utente non autorizzato ad accedere ai dati richiesti
	 */
	NOTIFICATION_USER_NOT_ALLOWED: () => LocalizedString
	/**
	 * Parametro di sistema non trovato
	 */
	SYSTEM_PARAMETER_NOT_FOUND: () => LocalizedString
	/**
	 * Utente non autorizzato ad accedere ai dati richiesti
	 */
	SYSTEM_USER_NOT_ALLOWED: () => LocalizedString
	/**
	 * Tipo Indirizzo non trovato
	 */
	USER_ADDRESS_ADDRESSTYPE_NOT_FOUND: () => LocalizedString
	/**
	 * Tipo Email non trovato
	 */
	USER_ADDRESS_EMAILTYPE_NOT_FOUND: () => LocalizedString
	/**
	 * L'indirizzo con ID {id} non esiste
	 */
	USER_ADDRESS_NOT_FOUND: (arg: { id: number }) => LocalizedString
	/**
	 * Toponimo dell'indirizzo non trovato
	 */
	USER_ADDRESS_TOPONYM_NOT_FOUND: () => LocalizedString
	/**
	 * L'utente può avere al massimo un solo dealer
	 */
	USER_DEALER_TOO_MANY: () => LocalizedString
	/**
	 * Utente con la mail indicata esistente
	 */
	USER_PROFILE_EMAIL_ALREADY_EXIST: () => LocalizedString
	/**
	 * Utente non autorizzato ad accedere ai dati richiesti
	 */
	USER_PROFILE_USER_NOT_ALLOWED: () => LocalizedString
	/**
	 * Profilo utente richiesto non trovato
	 */
	USER_PROFILE_USER_NOT_FOUND: () => LocalizedString
	/**
	 * Il dominio della email non è tra quelli consentiti
	 */
	USER_DOMAIN_NOT_ALLOWED: () => LocalizedString
	/**
	 * Password e conferma password devono coincidere
	 */
	USER_PASSWORD_MATCH: () => LocalizedString
	/**
	 * Password non conforme ai requisiti richiesti
	 */
	USER_PASSWORD_NOT_COMPLIANT: () => LocalizedString
	/**
	 * Indirizzo email non valido
	 */
	USER_EMAIL_MALFORMED: () => LocalizedString
	/**
	 * Utente con la mail {email} esistente
	 */
	USER_EMAIL_ALREADY_EXIST: (arg: { email: string }) => LocalizedString
	/**
	 * La mail con ID {id} non esiste
	 */
	USER_EMAIL_NOT_FOUND: (arg: { id: number }) => LocalizedString
	/**
	 * Un utente può avere solo una email di default
	 */
	USER_EMAIL_DEFAULT_EXIST: () => LocalizedString
	/**
	 * Un utente deve avere almeno una email di default
	 */
	USER_EMAIL_DEFAULT_UNDEFINED: () => LocalizedString
	/**
	 * Un utente può avere solo una email di autenticazione
	 */
	USER_EMAIL_AUTHENTICATION_EXIST: () => LocalizedString
	/**
	 * Un utente deve avere almeno una email di autenticazione
	 */
	USER_EMAIL_AUTHENTICATION_UNDEFINED: () => LocalizedString
	/**
	 * Storico password utente non trovato
	 */
	USER_PASSWORD_HISTORY_NOT_FOUND: () => LocalizedString
	/**
	 * Richiesta di rigenerazione password non trovata
	 */
	USER_RESET_REQ_NOT_FOUND: () => LocalizedString
	/**
	 * Richiesta di rigenerazione password scaduta
	 */
	USER_RESET_REQ_EXPIRED: () => LocalizedString
	/**
	 * Richiesta di rigenerazione password già usata
	 */
	USER_RESET_REQ_USED: () => LocalizedString
	/**
	 * Utente non autorizzato ad accedere ai dati richiesti
	 */
	USER_STATUS_USER_NOT_ALLOWED: () => LocalizedString
	/**
	 * Stato utente richiesto non trovato
	 */
	USER_STATUS_USER_NOT_FOUND: () => LocalizedString
	/**
	 * Utente non trovato
	 */
	USER_USER_NOT_FOUND: () => LocalizedString
	/**
	 * Utente non autorizzato ad accedere ai dati richiesti
	 */
	USER_USER_NOT_ALLOWED: () => LocalizedString
	/**
	 * Password precedente non corretta
	 */
	USER_OLD_PASSWORD: () => LocalizedString
	/**
	 * Password già usata in precedenza
	 */
	USER_USED_PASSWORD: () => LocalizedString
	/**
	 * Richiesta ripristino password
	 */
	USER_PASSWORD_RESET_EMAIL_SUBJECT: () => LocalizedString
	/**
	 * Ciao {name},<br>è stato richiesto il ripristino della tua password. Per procedere clicca sul link seguente.<br><a href="{link}">Ripristina password</a>
	 */
	USER_PASSWORD_RESET_EMAIL_BODY_HTML: (arg: { link: string, name: string }) => LocalizedString
	/**
	 * Ciao {name},
è stato richiesto il ripristino della tua password. Per procedere clicca sul link seguente.
{link}
	 */
	USER_PASSWORD_RESET_EMAIL_BODY_TEXT: (arg: { link: string, name: string }) => LocalizedString
	/**
	 * Conferma ripristino password
	 */
	USER_PASSWORD_RESET_CONFIRM_EMAIL_SUBJECT: () => LocalizedString
	/**
	 * Ciao {name},<br>la tua password è stata ripristinata. Per accedere clicca sul link seguente.<br><a href="{link}">Accedi ad Assihub</a>
	 */
	USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_HTML: (arg: { link: string, name: string }) => LocalizedString
	/**
	 * Ciao {name},
la tua password è stata ripristinata. Per accedere clicca sul link seguente.
{link}
	 */
	USER_PASSWORD_RESET_CONFIRM_EMAIL_BODY_TEXT: (arg: { link: string, name: string }) => LocalizedString
	/**
	 * Registrazione confermata
	 */
	USER_PASSWORD_REGISTER_EMAIL_SUBJECT: () => LocalizedString
	/**
	 * Ciao {name},<br>sei stato correttamente registrato su Assihub. Attendi che un amministratore abiliti il tuo account.
	 */
	USER_PASSWORD_REGISTER_EMAIL_BODY_HTML: (arg: { name: string }) => LocalizedString
	/**
	 * Ciao {name},
sei stato correttamente registrato su Assihub. Attendi che un amministratore abiliti il tuo accout.

	 */
	USER_PASSWORD_REGISTER_EMAIL_BODY_TEXT: (arg: { name: string }) => LocalizedString
	/**
	 * L'utente {name} {surname} si è appena registrato.
	 */
	USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE: (arg: { name: string, surname: string }) => LocalizedString
	/**
	 * L'utente non è attivo. Tramite il link è possibile modificarlo per configurare il ruolo e attivarlo per consentirne la connessione.
	 */
	USER_PASSWORD_REGISTER_NOTIFICATION_MESSAGE_DETAIL: () => LocalizedString
	/**
	 * Attivazione confermata
	 */
	USER_ACTIVATED_EMAIL_SUBJECT: () => LocalizedString
	/**
	 * Ciao {name},<br>il tuo account è stato attivato da un amministratore. Per accedere clicca sul link seguente.<br><a href="{link}">Accedi ad {siteName}</a>
	 */
	USER_ACTIVATED_EMAIL_BODY_HTML: (arg: { link: string, name: string, siteName: string }) => LocalizedString
	/**
	 * Ciao {name},
sei stato correttamente registrato su Assihub. Per accedere clicca su link seguente.
{link}
	 */
	USER_ACTIVATED_EMAIL_BODY_TEXT: (arg: { link: string, name: string }) => LocalizedString
}

export type Formatters = {}
