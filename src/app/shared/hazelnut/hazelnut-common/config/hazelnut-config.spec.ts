import { expect } from 'chai';
import { hazelnutConfig, initHazelnutConfig } from './hazelnut-config';

describe('HazelnutConfig', () => {
    describe('setAppConfig', () => {
        it('Return config values from options', () => {
            const ahaBrowseLimit = 233;
            const huraBrowseLimit = 233;
            expect(() => hazelnutConfig.URL_API)
                .to
                .throw(Error);
            expect(() => hazelnutConfig.BROWSE_LIMIT)
                .to
                .throw(Error);

            initHazelnutConfig({
                BROWSE_LIMIT: ahaBrowseLimit,
                URL_API: 'https://aahaaa.com',
                VERSION: '1.0.0',
                LANGUAGE: 'SK',
            });

            expect(hazelnutConfig.URL_API)
                .to
                .be
                .equal('https://aahaaa.com');
            expect(hazelnutConfig.BROWSE_LIMIT)
                .to
                .be
                .equal(ahaBrowseLimit);
            expect(hazelnutConfig.VERSION)
                .to
                .be
                .equal('1.0.0');
            expect(hazelnutConfig.LANGUAGE)
                .to
                .be
                .equal('SK');

            const config = initHazelnutConfig({
                BROWSE_LIMIT: huraBrowseLimit,
                URL_API: 'https://huraaaaaa.com',
                VERSION: '1.0.0',
                LANGUAGE: 'SK',
            });

            expect(() => config.URL_API = '/')
                .to
                .throw('Cannot rewrite config');
            expect(() => config.VERSION = '0.0.1')
                .to
                .throw('Cannot rewrite config');

            expect(hazelnutConfig.URL_API)
                .to
                .be
                .equal('https://huraaaaaa.com');
            expect(hazelnutConfig.BROWSE_LIMIT)
                .to
                .be
                .equal(huraBrowseLimit);

            expect(() => initHazelnutConfig(null as any))
                .to
                .throw('Cannot create proxy with a non-object as target or handler');

            initHazelnutConfig({} as any, true);

            expect(hazelnutConfig.URL_API).to.be.undefined;
            expect(hazelnutConfig.BROWSE_LIMIT).to.be.undefined;

            expect(() => initHazelnutConfig(null as any))
                .to
                .throw('Cannot call function initHazelnutConfig after calling this function with \'lastInit\' flag set on true');
        });
    });
});
