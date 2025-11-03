import { pb } from 'src/boot/pocketbase';

export type NotificationAction =
  | 'new_request'
  | 'approved'
  | 'declined'
  | 'completed'
  | 'paid'
  | 'done';

interface NotificationParams {
  interestRequestId: string;
  action: NotificationAction;
  customMessage?: string;
}

export const useInterestRequestNotifications = () => {
  const sendNotification = async (params: NotificationParams): Promise<boolean> => {
    try {
      await pb.send('/api/interest-request/notify', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  return {
    sendNotification,
  };
};

