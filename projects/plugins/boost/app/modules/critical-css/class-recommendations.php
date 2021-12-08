<?php
/**
 * Recommendations.
 *
 * @package automattic/jetpack-boost
 */

namespace Automattic\Jetpack_Boost\Modules\Critical_CSS;

use Automattic\Jetpack_Boost\Lib\Notifications;

/**
 * Recommendations.
 */
class Recommendations extends Notifications {
	const NOTIFICATIONS_KEY   = 'jb-critical-css-dismissed-recommendations';
	const NOTIFICATIONS_NONCE = 'dismiss_notice';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
		add_filter( 'jetpack_boost_js_constants', array( $this, 'always_add_recommendations_constants' ) );
	}

	/**
	 * On initialize.
	 */
	public function on_initialize() {
		add_filter( 'jetpack_boost_js_constants', array( $this, 'add_dismissed_recommendations_constants' ) );
	}

	/**
	 * Register the Recommendations REST routes.
	 */
	public function register_rest_routes() {
		register_rest_route(
			JETPACK_BOOST_REST_NAMESPACE,
			JETPACK_BOOST_REST_PREFIX . '/recommendations/dismiss',
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'dismiss_recommendations' ),
					'permission_callback' => array( $this, 'current_user_can_manage_notifications' ),
				),
			)
		);

		register_rest_route(
			JETPACK_BOOST_REST_NAMESPACE,
			JETPACK_BOOST_REST_PREFIX . '/recommendations/reset',
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'reset_recommendations' ),
					'permission_callback' => array( $this, 'current_user_can_manage_notifications' ),
				),
			)
		);
	}

	/**
	 * Add all Critical CSS dismissed recommendations constants.
	 *
	 * @param  array $constants Jetpack Boost JS constants.
	 * @return array
	 */
	public function add_dismissed_recommendations_constants( $constants ) {
		$constants['criticalCssDismissedRecommendations'] = \get_option( self::NOTIFICATIONS_KEY, array() );

		return $constants;
	}

	/**
	 * Add Critical CSS related constants to be passed to JavaScript whether or not the module is enabled.
	 *
	 * @param array $constants Constants to be passed to JavaScript.
	 * @return array
	 */
	public function always_add_recommendations_constants( $constants ) {
		$constants['criticalCssDismissRecommendationsNonce'] = wp_create_nonce( self::NOTIFICATIONS_NONCE );

		return $constants;
	}

	/**
	 * Check if user can manage notifications.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return bool
	 */
	public function current_user_can_manage_notifications( $request ) {
		return ( wp_verify_nonce( $request['nonce'], self::NOTIFICATIONS_NONCE ) && current_user_can( 'manage_options' ) );
	}

	/**
	 * Dismiss recommendations.
	 *
	 * @param \WP_REST_Request $request The request object.
	 */
	public function dismiss_recommendations( $request ) {
		$provider_key = filter_var( $request['providerKey'], FILTER_SANITIZE_STRING );
		if ( empty( $provider_key ) ) {
			wp_send_json_error();
		}

		$this->add( $provider_key );
		wp_send_json_success();
	}

	/**
	 * Reset recommendations.
	 */
	public function reset_recommendations() {
		$this->clear();
		wp_send_json_success();
	}
}
