import { test, expect } from '../fixtures/base-test.js';
import { JetpackBoostPage } from '../lib/pages/index.js';

let jetpackBoostPage;

test.describe( 'Speed Score feature', () => {
	test.beforeEach( async function ( { page } ) {
		jetpackBoostPage = await JetpackBoostPage.visit( page );
	} );

	test( 'The Speed Score section should display a mobile and desktop speed score greater than zero', async () => {
		expect( await jetpackBoostPage.getSpeedScore( 'mobile' ) ).toBeGreaterThan( 0 );
		expect( await jetpackBoostPage.getSpeedScore( 'desktop' ) ).toBeGreaterThan( 0 );
	} );

	test( 'The Speed Scores should start refreshing immidiately if refresh is clicked', async () => {
		await jetpackBoostPage.waitForScoreLoadingToFinish();
		await jetpackBoostPage.clickRefreshSpeedScore();
		expect( await jetpackBoostPage.isLoading() ).toBeTruthy();
		expect( await jetpackBoostPage.isScorebarLoading( 'mobile' ) ).toBeTruthy();
		expect( await jetpackBoostPage.isScorebarLoading( 'desktop' ) ).toBeTruthy();
	} );
} );
