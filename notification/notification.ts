// libraries
import { api, APIError, StreamOut } from 'encore.dev/api';
import { Subscription, Topic } from 'encore.dev/pubsub';
import { getAuthData } from '~encore/auth';
import locz from '../common/i18n';
// application module
import {
  NotificationHandshake,
  NotificationMessage,
  NotificationMessageFull,
  NotificationMessageListRequest,
  NotificationMessageListResponse,
  NotificationMessageReadAllRequest,
  NotificationMessageReadUnreadRequest,
  NotificationMessageRequest,
  NotificationMessageSendRequest,
} from './notification.model';
import { orm } from '../common/db/db';
import { DbUtility } from './../common/utility/db.utility';
import { userDetail } from '../user/user';
import { UserResponse } from '../user/user.model';
import { AuthenticationData } from '../authentication/authentication.model';
import { fileEntryList } from '../file/file';
import { FileEntryResponse, FileEntryType } from '../file/file.model';
import { authorizationOperationUserCheck } from '../authorization/authorization';
import { AuthorizationOperationResponse } from '../authorization/authorization.model';

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
    const user: UserResponse = await userDetail({ id: handshake.userId });
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
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'resendNotificationMessageList',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
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
  { expose: true, auth: true, method: 'GET', path: '/notification' },
  async (request: NotificationMessageListRequest): Promise<NotificationMessageListResponse> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'notificationMessageList',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
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
    return {
      notificationMessages: DbUtility.removeNullFieldsList(notificationMessages),
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
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'notificationMessageAllRead',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
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
  async (request: NotificationMessageReadUnreadRequest): Promise<NotificationMessage> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'notificationMessageRead',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().NOTIFICATION_USER_NOT_ALLOWED());
    }
    // update specified notification ad readed
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    await notificationMessageQry().update('readed', true).where('userId', request.userId).andWhere('id', request.notificationMessageId);
    // load notification message
    return notificationMessageDetails({ id: request.notificationMessageId });
  }
); // notificationMessageRead

/**
 * Mark a notification ad unreaded.
 */
export const notificationMessageUnread = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/unread/:userId/:notificationMessageId' },
  async (request: NotificationMessageReadUnreadRequest): Promise<NotificationMessage> => {
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'notificationMessageUnread',
      requestingUserId: userId,
      destinationUserIds: [request.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().NOTIFICATION_USER_NOT_ALLOWED());
    }
    // update specified notification ad unreaded
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    await notificationMessageQry().update('readed', false).where('userId', request.userId).andWhere('id', request.notificationMessageId);
    // load notification message
    return notificationMessageDetails({ id: request.notificationMessageId });
  }
); // notificationMessageUnread

/**
 * Send a new notification message.
 * Add new notification message e send it to the corresponding user.
 */
export const sendNotificationMessage = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/send/:userId' },
  async (request: NotificationMessageSendRequest): Promise<void> => {
    // TODO MIC check for authorization
    // create new notification message
    const newNotificationMessage: NotificationMessage = {
      userId: request.userId,
      message: request.message,
      timestamp: new Date(),
      readed: false,
      type: request.type,
    };
    if (request.detail && request.detail != null) {
      newNotificationMessage.detail = request.detail;
    }
    if (request.entityId && request.entityId != null) {
      newNotificationMessage.entityId = request.entityId;
    }
    // save notification message
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    const notificationMessageRst = await notificationMessageQry().insert(newNotificationMessage, ['id']);
    newNotificationMessage.id = notificationMessageRst[0].id;
    // notify message
    await notify.publish(newNotificationMessage);
  }
); // sendNotificationMessage

/**
 * Load notification message details.
 */
export const notificationMessageDetails = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/:id' },
  async (request: NotificationMessageRequest): Promise<NotificationMessage> => {
    // load notification message
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    const notificationMessage = await notificationMessageQry().first().where('id', request.id);
    if (!notificationMessage) {
      // notification message not found
      throw APIError.notFound(locz().NOTIFICATION_NOTIFICATION_NOT_FOUND());
    }
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'notificationMessageDetails',
      requestingUserId: userId,
      destinationUserIds: [notificationMessage.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().NOTIFICATION_USER_NOT_ALLOWED());
    }
    // return notification message
    return DbUtility.removeNullFields(notificationMessage);
  }
); // notificationMessageDetails

/**
 * Load notification message details.
 */
export const notificationMessageDetailsFull = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/full/:id' },
  async (request: NotificationMessageRequest): Promise<NotificationMessageFull> => {
    // load notification message
    const notificationMessageQry = () => orm<NotificationMessage>('NotificationMessage');
    const notificationMessage = await notificationMessageQry().first().where('id', request.id);
    if (!notificationMessage) {
      // notification message not found
      throw APIError.notFound(locz().NOTIFICATION_NOTIFICATION_NOT_FOUND());
    }
    // get authentication data
    const authenticationData: AuthenticationData = getAuthData()!;
    const userId = parseInt(authenticationData.userID);
    // check user authorization
    const authorizationCheck: AuthorizationOperationResponse = authorizationOperationUserCheck({
      operationCode: 'notificationMessageDetailsFull',
      requestingUserId: userId,
      destinationUserIds: [notificationMessage.userId],
    });
    if (!authorizationCheck.canBePerformed) {
      // user not allowed to get status
      throw APIError.permissionDenied(locz().NOTIFICATION_USER_NOT_ALLOWED());
    }
    // load related notification user
    const user = await userDetail({ id: notificationMessage.userId });
    // prepare notificaion message full response
    const notificationMessageFull: NotificationMessageFull = {
      ...notificationMessage,
      user,
    };
    // load user profile image
    const fileEntries: FileEntryResponse[] = (await fileEntryList({ userId: user.id, type: FileEntryType.ProfileImage })).fileEntries;
    if (fileEntries && fileEntries.length > 0) {
      notificationMessageFull.userProfileImage = fileEntries[0];
    }
    // return full notification message
    return DbUtility.removeNullFields(notificationMessageFull);
  }
); // notificationMessageDetailsFull
