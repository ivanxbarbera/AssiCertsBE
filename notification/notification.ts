// libraries
import { api, APIError, StreamOut } from 'encore.dev/api';
import { Subscription, Topic } from 'encore.dev/pubsub';
import log from 'encore.dev/log';
import { getAuthData } from '~encore/auth';
import locz from '../common/i18n';
// application module
import {
  NotificationHandshake,
  NotificationMessage,
  NotificationMessageListRequest,
  NotificationMessageListResponse,
  NotificationMessageReadAllRequest,
  NotificationMessageReadRequest,
} from './notification.model';
import { orm } from '../common/db/db';
import { userDetails } from '../user/user';
import { UserResponse } from '../user/user.model';
import { AuthenticationData } from '../authentication/authentication.model';

/**
 * Connected strams that listen for notifications.
 * Each time a new client connect to WebSocket it is added to this list.
 * On disconnect it is removed.
 */
const connectedStreams: Map<number, StreamOut<NotificationMessage>> = new Map();

/**
 * WebSocket that emits Notification.
 * Accept multiple client connections.
 * For each notification message, it check every client connected and verify if that client is a receipt.
 * If true send the notification, otherwise pass to the next client.
 */
export const notificationStream = api.streamOut<NotificationHandshake, NotificationMessage>(
  { expose: true, auth: false, path: '/notification/stream' },
  async (handshake, stream) => {
    // add new connection to connected list
    connectedStreams.set(handshake.userId, stream);
    // load user details
    const user: UserResponse = await userDetails({ id: handshake.userId });
    new Subscription(notify, 'send-notification', {
      handler: async (notificationMessage: NotificationMessage) => {
        try {
          // send the message to the clients
          for (const [id, stream] of connectedStreams) {
            // check if current client is allowed to receive the message
            try {
              if (notificationMessage.userId == id) {
                // send message
                await stream.send(notificationMessage);
              }
            } catch (err) {
              // send error, probably client disconnected
              // remove client from connected list
              connectedStreams.delete(id);
            }
          }
        } catch (err) {
          // general error
          // remove client from connected list
          connectedStreams.delete(handshake.userId);
        }
      },
    });
  }
); // notificationStream

/**
 * Notify a message to subscribed users.
 */
export const notify = new Topic<NotificationMessage>('notify', {
  deliveryGuarantee: 'at-least-once',
}); // notify

/**
 * Search for notification messages.
 * Apply filters and return a list of notification messages.
 */
export const resendNotificationMessageList = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/resend/:userId' },
  async (request: NotificationMessageListRequest): Promise<void> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.userId) {
      // user not allowed to access
      throw APIError.permissionDenied(locz().NOTIFICATION_USER_NOT_ALLOWED());
    }
    // load noitification messages
    const notificationMessageListResponse: NotificationMessageListResponse = await notificationMessageList(request);
    const notificationMessages: NotificationMessage[] = notificationMessageListResponse.notificationMessages;
    notificationMessages.reverse().forEach(async (notificationMessage: NotificationMessage) => {
      await notify.publish(notificationMessage);
    });
  }
); // resendNotificationMessageList

/**
 * Search for notification messages.
 * Apply filters and return a list of notification messages.
 */
export const notificationMessageList = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/:userId' },
  async (request: NotificationMessageListRequest): Promise<NotificationMessageListResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.userId) {
      // user not allowed to access
      throw APIError.permissionDenied(locz().NOTIFICATION_USER_NOT_ALLOWED());
    }
    // TODO add search filters
    // load noitification messages
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    const notificationMessages = await notificationMessageQry()
      .select()
      .where((whereBuilder) => {
        whereBuilder.where('userId', request.userId);
        if (request.onlyUnread) {
          whereBuilder.andWhere('readed', false);
        }
      })
      .orderBy('timestamp');
    // return notification messages
    return {
      notificationMessages,
    };
  }
); // notificationMessageList

/**
 * Mark all user notifications ad readed.
 */
export const notificationMessageAllRead = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/allread/:userId' },
  async (request: NotificationMessageReadAllRequest): Promise<void> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.userId) {
      // user not allowed to access
      throw APIError.permissionDenied(locz().NOTIFICATION_USER_NOT_ALLOWED());
    }
    // update all notification ad readed
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    await notificationMessageQry().update('readed', true).where('userId', request.userId);
  }
); // notificationMessageAllRead

/**
 * Mark a notification ad readed.
 */
export const notificationMessageRead = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/read/:userId/:notificationMessageId' },
  async (request: NotificationMessageReadRequest): Promise<void> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user permission
    if (userId !== request.userId) {
      // user not allowed to access
      throw APIError.permissionDenied(locz().NOTIFICATION_USER_NOT_ALLOWED());
    }
    // update specified notification ad readed
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    await notificationMessageQry().update('readed', true).where('userId', request.userId).andWhere('id', request.notificationMessageId);
  }
); // notificationMessageRead
