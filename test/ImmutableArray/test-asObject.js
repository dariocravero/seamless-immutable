var Immutable = require("../../seamless-immutable.js");
var JSC       = require("jscheck");
var TestUtils = require("../TestUtils.js");
var assert    = require("chai").assert;
var _         = require("lodash")
var check     = TestUtils.check;

module.exports = function() {
  describe("#asObject", function() {
    it("works on arrays of various lengths", function() {
      check(100, [TestUtils.ComplexObjectSpecifier()], function(obj) {
        var keys   = _.keys(obj);
        var values = _.values(obj);
        var array  = Immutable(_.map(obj, function(value, key) {
          return [key, value];
        }));

        var result = array.asObject(function(value, index) {
          // Check that the index argument we receive works as expected.
          assert.deepEqual(value, array[index], "Expected array[" + index + "] to be " + value);

          return [keys[index], values[index]]
        });

        assert.deepEqual(result, obj);
      });
    });

    it("works without an iterator on arrays that are already organized properly", function() {
      check(100, [TestUtils.ComplexObjectSpecifier()], function(obj) {
        var keys  = _.keys(obj);
        var array = Immutable(_.map(obj, function(value, key) {
          return [key, value];
        }));

        var result = array.asObject();

        assert.deepEqual(result, obj);
      });
    });

    // Sanity check to make sure our QuickCheck logic isn't off the rails.
    it("passes a basic sanity check on canned input", function() {
      var expected = Immutable({all: "your base", are: {belong: "to us"}});
      var actual   = Immutable([{key: "all", value: "your base"}, {key: "are", value: {belong: "to us"}}]).asObject(function(elem) {
        return [elem.key, elem.value];
      });

      assert.deepEqual(actual, expected);
    });
  });
};