import { expect } from 'chai';
import { ObjectUtils } from './object.utils';

describe('ObjectUtils', () => {
    describe('getNestedProperty', () => {
        it('Returns nested property', () => {
            expect(ObjectUtils.getNestedProperty({name: 'Name'}, 'name')).to.be.equal('Name');
            expect(ObjectUtils.getNestedProperty({person: {name: 'Name'}}, 'person.name')).to.be.equal('Name');
            expect(ObjectUtils.getNestedProperty({person: {age: 23}}, 'person.age')).to.be.equal(23);
            expect(ObjectUtils.getNestedProperty({person: {name: 'Name'}}, 'person.name')).to.be.equal('Name');
            expect(ObjectUtils.getNestedProperty({person: {age: 23}}, 'person.age')).to.be.equal(23);
            expect(ObjectUtils.getNestedProperty({person: {name: 'Name'}}, 'person-name', '-')).to.be.equal('Name');
            expect(ObjectUtils.getNestedProperty({person: {age: 23}}, 'person/age', '/')).to.be.equal(23);
        });
    });
});
