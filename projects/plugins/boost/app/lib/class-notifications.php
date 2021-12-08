<?php
/**
 * Notifications.
 *
 * @package automattic/jetpack-boost
 */

namespace Automattic\Jetpack_Boost\Lib;

/**
 * Notifications.
 */
class Notifications {
	const NOTIFICATIONS_KEY = 'jb-notifications';

	/**
	 * Add notifications by notification_key.
	 *
	 * @param string $notification_key Notification key.
	 */
	public function add( $notification_key ) {
		$all_notifications = \get_option( self::NOTIFICATIONS_KEY, array() );

		if ( ! in_array( $notification_key, $all_notifications, true ) ) {
			$all_notifications[] = $notification_key;
			\update_option( self::NOTIFICATIONS_KEY, $all_notifications );
		}
	}

	/**
	 * Clear all the notifications.
	 */
	public function clear() {
		\delete_option( self::NOTIFICATIONS_KEY );
	}
}
