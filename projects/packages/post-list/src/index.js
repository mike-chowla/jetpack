/**
 * WordPress dependencies
 */
import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import './style.scss';
import FeaturedImage from './components/featured-image';

domReady( () => {
	// Data global containers.
	const posts = [ ...window.wpAdminPosts ];

	posts.forEach( post => {
		const postRow = document.getElementById( 'post-' + post.id );
		if ( ! postRow ) {
			return;
		}

		const postTitleElementWrapper = postRow.querySelector( '.column-title' );

		// Inject post-featured-image__container container just before post title.
		const postFeaturedImageElement = document.createElement( 'span' );
		postFeaturedImageElement.classList.add( 'post-featured-image__container' );
		postFeaturedImageElement.classList.add(
			post.featured_image.id ? 'has-featured-image' : 'no-featured-image'
		);

		postTitleElementWrapper.insertBefore(
			postFeaturedImageElement,
			postTitleElementWrapper.firstChild
		);

		render(
			<FeaturedImage { ...post.featured_image } postId={ post.id } />,
			postFeaturedImageElement
		);
	} );
} );