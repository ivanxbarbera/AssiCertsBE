// libraries
import { api, APIError, StreamOut } from 'encore.dev/api';
import { Subscription, Topic } from 'encore.dev/pubsub';
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
  NotificationMessageSendRequest,
} from './notification.model';
import { orm } from '../common/db/db';
import { userDetails } from '../user/user';
import { UserResponse } from '../user/user.model';
import { AuthenticationData } from '../authentication/authentication.model';
import { General } from '../common/utility/general.utility';

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
 * Resend notification messages.
 * Apply filters and resend the notification messages list using websocket.
 * Before each resend there's a pause for preserving selected order.
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
    // set notification filters
    const orderBy = request.sortDesdending ? 'DESC' : 'ASC';
    // TODO add search filters
    // load noitification messages
    let notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    let notificationMessageQryPrep = notificationMessageQry()
      .select()
      .where((whereBuilder) => {
        whereBuilder.where('userId', request.userId);
        if (request.onlyUnread) {
          whereBuilder.andWhere('readed', false);
        }
      })
      .orderBy('timestamp', orderBy);
    if (request.maxMessages && request.maxMessages > 0) {
      notificationMessageQryPrep.limit(request.maxMessages);
    }
    const notificationMessages = await notificationMessageQryPrep;
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

/**
 * Send a new notification message.
 * Add new notification message e send it to the corresponding user.
 */
export const sendNotificationMessage = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/send/:userId' },
  async (request: NotificationMessageSendRequest): Promise<void> => {
    // create new notification message
    const newNotificationMessage: NotificationMessage = {
      userId: request.userId,
      message: request.message,
      timestamp: new Date(),
      readed: false,
      type: request.type,
    };
    // save notification message
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    const notificationMessageRst = await notificationMessageQry().insert(newNotificationMessage, ['id']);
    const id = notificationMessageRst[0].id;
    // notify message
    await notify.publish(newNotificationMessage);
  }
); // sendNotificationMessage
