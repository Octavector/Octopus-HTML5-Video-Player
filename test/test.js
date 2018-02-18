require('jsdom-global')()
let octopus = require('../octopus.js')
let assert = require('assert');


describe('Octopus Video Player', function() {
    describe('getPercent | Returns the percentage difference between \'num1\' and \'num2\'', function() {
      it('TEST: 1' , function() {
        assert.equal(50, octopus.getPercent(20,40));
      });
      it('TEST: 2', function() {
        assert.equal(12, octopus.getPercent(0.22524,1.877));
      });
    });
    describe('percentOff | Returns decimal thats \'percent\' of \'target\'', function() {
        it('TEST: 1' , function() {
          assert.equal(120, octopus.percentOff(50,240));
        });
        it('TEST: 2', function() {
          assert.equal(0.22524, octopus.percentOff(12,1.877));
        });
      });
      describe('convertToMinutes | Convert video duration in seconds \'total\' to minutes and seconds', function() {
        it('TEST: 1' , function() {
          assert.equal('25:46', octopus.convertToMinutes(1546));
        });
        it('TEST: 2', function() {
          assert.equal('08:08', octopus.convertToMinutes(488));
        });
      });
});

