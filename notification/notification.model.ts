/**
 * Notification handshake.
 * Passed at connection time.
 */
export interface NotificationHandshake {
  // user identfier of websocket connection
  userId: number;
} // NotificationHandshake

/**
 * Notification message.
 * Message to be sent to connected client.
 */
export interface NotificationMessage {
  // notification identifier
  id?: number;
  // destination user identifier
  userId: number;
  // notification message
  message: string;
  // notification timestamp
  timestamp: Date;
  // true if notification readed by user, false othewise
  readed: boolean;
  // notification message type
  type: NotificationMessageType;
} // NotificationMessage

/**
 * Nofitication messages search list request.
 */
export interface NotificationMessageListRequest {
  // user identfier
  userId: number;
  // list only unread notification messages
  onlyUnread?: boolean;
  // order notification messages cronologically descending, otherwise ascending
  sortDesdending?: boolean;
  // max number of returned notification messages
  maxMessages?: number;
} // NotificationMessageListRequest

/**
 * Nofitication messages search list response.
 */
export interface NotificationMessageListResponse {
  // notification message list
  notificationMessages: NotificationMessage[];
} // NotificationMessageListResponse

/**
 * Nofitication messages mark read all request.
 */
export interface NotificationMessageReadAllRequest {
  // user identfier
  userId: number;
} // NotificationMessageReadAllRequest

/**
 * Nofitication messages mark read or unread request.
 */
export interface NotificationMessageReadUnreadRequest {
  // user identfier
  userId: number;
  // notification identifier
  notificationMessageId: number;
} // NotificationMessageReadRequest

/**
 * Notification message to be sended to user.
 */
export interface NotificationMessageSendRequest {
  // user identfier
  userId: number;
  // notification message
  message: string;
  // notification message type
  type: NotificationMessageType;
} // NotificationMessageSendRequest

/**
 * Notification message types.
 */
export enum NotificationMessageType {
  Generic = 'GENERIC',
  PasswordExpiration = 'PASSWORD_EXPIRATION',
  UserMaintenance = 'USER_MAINTENANCE',
} // NotificationMessageType

/**
 * Nofitication messages details request.
 */
export interface NotificationMessageRequest {
  // notification message identfier
  id: number;
} // NotificationMessageRequest
