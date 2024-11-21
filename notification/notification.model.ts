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
  id: number;
  // destination user identifier
  userId: number;
  // notification message
  message: string;
  // notification timestamp
  timestamp: Date;
  // true if notification readed by user, false othewise
  readed: boolean;
} // NotificationMessage

/**
 * Nofitication messages search list request.
 */
export interface NotificationMessageListRequest {
  // user identfier
  userId: number;
} // NotificationMessageListRequest

/**
 * Nofitication messages search list response.
 */
export interface NotificationMessageListResponse {
  // notification message list
  notificationMessages: NotificationMessage[];
} // NotificationMessageListResponse
