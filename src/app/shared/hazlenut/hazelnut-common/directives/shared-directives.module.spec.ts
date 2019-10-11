import { SharedDirectivesModule } from './shared-directives.module';

describe('SharedDirectivesModule', () => {
    let sharedDirectivesModule: SharedDirectivesModule;

    beforeEach(() => {
        sharedDirectivesModule = new SharedDirectivesModule();
    });

    it('should create an instance', () => {
        expect(sharedDirectivesModule)
            .toBeTruthy();
    });
});
