/**
 * Publicize sharing form component.
 *
 * Displays text area and connection list to allow user
 * to select connections to share to and write a custom
 * sharing message.
 */

/**
 * WordPress dependencies
 */
import { PanelRow, Disabled } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import PublicizeConnection from '../connection';
import PublicizeSettingsButton from '../settings-button';
import MessageBoxControl from '../message-box-control';
import useSocialMediaConnections from '../../hooks/use-social-media-connections';
import useSocialMediaMessage from '../../hooks/use-social-media-message';

export default function PublicizeForm( {
	isPublicizeEnabled,
	isRePublicizeFeatureEnabled,
	isPublicizeDisabledBySitePlan,
} ) {
	const { connections, toggleById, hasConnections } = useSocialMediaConnections();
	const { message, updateMessage, maxLength } = useSocialMediaMessage();

	function isDisabled() {
		// Do not disable when RePublicize is enabled.
		if ( isRePublicizeFeatureEnabled ) {
			return false;
		}

		return connections.every( connection => ! connection.toggleable );
	}

	const Wrapper = isPublicizeDisabledBySitePlan ? Disabled : Fragment;

	return (
		<Wrapper>
			{ hasConnections && (
				<PanelRow>
					<ul className="jetpack-publicize__connections-list">
						{ connections.map(
							( { display_name, enabled, id, service_name, toggleable, profile_picture } ) => (
								<PublicizeConnection
									disabled={ isRePublicizeFeatureEnabled ? ! isPublicizeEnabled : ! toggleable }
									enabled={ enabled && ! isPublicizeDisabledBySitePlan }
									key={ id }
									id={ id }
									label={ display_name }
									name={ service_name }
									toggleConnection={ toggleById }
									profilePicture={ profile_picture }
								/>
							)
						) }
					</ul>
				</PanelRow>
			) }

			{ ! isPublicizeDisabledBySitePlan && (
				<Fragment>
					<PublicizeSettingsButton />

					{ connections.some( connection => connection.enabled ) && (
						<MessageBoxControl
							disabled={ isDisabled() }
							maxLength={ maxLength }
							onChange={ updateMessage }
							message={ message }
						/>
					) }
				</Fragment>
			) }
		</Wrapper>
	);
}
