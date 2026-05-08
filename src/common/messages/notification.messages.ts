export const NotificationMessages = {
  success: {
    fetched: (count?: number) =>
      count ? `${count} notifications fetched successfully` : 'Notifications fetched successfully',
    markedRead: 'Notification marked as read',
    allMarkedRead: 'All notifications marked as read',
    deleted: 'Notification deleted successfully',
    unreadCount: 'Unread count fetched successfully',
  },
  error: {
    notFound: 'Notification not found',
    notAuthorized: 'You are not authorized to access this notification',
  },
};