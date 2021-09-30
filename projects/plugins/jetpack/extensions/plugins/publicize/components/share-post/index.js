/**
 * WordPress dependencies
 */
import { Button, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useSharePost } from '../../hooks/use-share-post';

export function SharePostButton( { disabled } ) {
	const [ isSharing, setIsSharing ] = useState( false );

	const onPostShareHander = useSharePost( function ( errors ) {
		if ( errors?.length ) {
			// console.error( errors );
		}

		setIsSharing( false );
	} );

	return (
		<Button
			isSecondary
			onClick={ function () {
				setIsSharing( true );
				onPostShareHander();
			} }
			disabled={ disabled || isSharing }
			isBusy={ isSharing }
		>
			{ __( 'Share this post', 'jetpack' ) }
		</Button>
	);
}

export function SharePostRow( { isPostPublished } ) {
	if ( ! isPostPublished ) {
		return null;
	}

	return (
		<PanelRow>
			<SharePostButton />
		</PanelRow>
	);
}