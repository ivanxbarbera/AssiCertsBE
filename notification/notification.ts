import { api, StreamOut } from 'encore.dev/api';
import { NotificationHandshake, NotificationMessage, NotificationMessageListRequest, NotificationMessageListResponse } from './notification.model';
import { Subscription, Topic } from 'encore.dev/pubsub';
import { userDetails } from '../user/user';
import { UserResponse } from '../user/user.model';
import log from 'encore.dev/log';
import { orm } from '../common/db/db';

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
  { expose: true, auth: false, path: '/notification' },
  async (handshake, stream) => {
    // add new connection to connected list
    connectedStreams.set(handshake.userId, stream);
    // load user details
    const user: UserResponse = await userDetails({ id: handshake.userId });
    new Subscription(notify, 'send-notification', {
      handler: async (notificationMessage: NotificationMessage) => {
        log.debug('After: ' + JSON.stringify(notificationMessage));
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
              log.debug('error');
              connectedStreams.delete(id);
            }
          }
        } catch (err) {
          // general error
          // remove client from connected list
          log.debug('error2');
          connectedStreams.delete(handshake.userId);
        }
      },
    });
  }
);

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
    // load noitification messages
    const notificationMessageListResponse: NotificationMessageListResponse = await notificationMessageList(request);
    const notificationMessages: NotificationMessage[] = notificationMessageListResponse.notificationMessages;
    notificationMessages.reverse().forEach(async (notificationMessage: NotificationMessage) => {
      log.debug('Before: ' + JSON.stringify(notificationMessage));
      await notify.publish(notificationMessage);
    });
  }
); // notificationMessageList

/**
 * Search for notification messages.
 * Apply filters and return a list of notification messages.
 */
export const notificationMessageList = api(
  { expose: true, auth: true, method: 'GET', path: '/notification/:userId' },
  async (request: NotificationMessageListRequest): Promise<NotificationMessageListResponse> => {
    // TODO add search filters
    // load noitification messages
    const usersQry = () => orm<NotificationMessage>('NotificationMessage');
    const notificationMessages = await usersQry().select().where('userId', request.userId).orderBy('timestamp');
    // return notification messages
    return {
      notificationMessages,
    };
  }
); // notificationMessageList

// setInterval(() => {
//   log.debug('START');
//   notify.publish({
//     id: 1,
//     message: 'prova',
//     readed: false,
//     timestamp: new Date(),
//     userId: 3,
//   });
// }, 5000);
