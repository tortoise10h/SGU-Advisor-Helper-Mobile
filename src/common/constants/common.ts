enum APIRequestSetting {
  CALL_API_TIMEOUT = 15000,
}

enum APIRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export { APIRequestSetting, APIRequestMethod };

export const TIME_DISPLAY_FORMAT = 'DD/MM/YYYY h:mm a';

export enum NotificationChannel {
  POST_NOTIFICATION_CHANNEL = 'post-notification-channel',
  MESSAGE_NOTIFICATION_CHANNEL = 'message-notification-channel',
}
