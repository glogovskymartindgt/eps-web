import { expect } from 'chai';
import { HazelnutConfig, initHazelnutConfig } from './hazelnut-config';

describe('HazelnutConfig', () => {
    describe('setAppConfig', () => {
        it('Return config values from options', () => {
            expect(() => HazelnutConfig.URL_API).to.throw(Error);
            expect(() => HazelnutConfig.BROWSE_LIMIT).to.throw(Error);

            initHazelnutConfig({
                BROWSE_LIMIT: 233,
                URL_API: 'https://aahaaa.com',
                VERSION: '1.0.0',
                LANGUAGE: 'SK',
            });

            expect(HazelnutConfig.URL_API).to.be.equal('https://aahaaa.com');
            expect(HazelnutConfig.BROWSE_LIMIT).to.be.equal(233);
            expect(HazelnutConfig.VERSION).to.be.equal('1.0.0');
            expect(HazelnutConfig.LANGUAGE).to.be.equal('SK');

            const config = initHazelnutConfig({
                BROWSE_LIMIT: 332,
                URL_API: 'https://huraaaaaa.com',
                VERSION: '1.0.0',
                LANGUAGE: 'SK',
            });

            expect(() => config.URL_API = '/').to.throw('Cannot rewrite config');
            expect(() => config.VERSION = '0.0.1').to.throw('Cannot rewrite config');

            expect(HazelnutConfig.URL_API).to.be.equal('https://huraaaaaa.com');
            expect(HazelnutConfig.BROWSE_LIMIT).to.be.equal(332);

            expect(() => initHazelnutConfig(null as any)).to.throw('Cannot create proxy with a non-object as target or handler');

            initHazelnutConfig({} as any, true);

            expect(HazelnutConfig.URL_API).to.be.undefined;
            expect(HazelnutConfig.BROWSE_LIMIT).to.be.undefined;

            expect(() => initHazelnutConfig(null as any)).to.throw('Cannot call function initHazelnutConfig after calling this function with \'lastInit\' flag set on true');
        });
    });
});
