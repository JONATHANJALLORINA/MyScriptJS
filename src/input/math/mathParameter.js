/**
 *
 * @param scope
 */
(function (scope) {

    /**
     * Parameters used for math recognition
     * @constructor
     */
    function MathParameter () {
        scope.AbstractParameter.call(this);
        this.resultTypes = [];
        this.userResources = [];
    }

    /**
     *
     * @type {AbstractParameter}
     */
    MathParameter.prototype = new scope.AbstractParameter();

    /**
     *
     * @type {Array}
     */
    MathParameter.prototype.resultTypes = null;

    /**
     *
     * @type {Array}
     */
    MathParameter.prototype.userResources = null;

    /**
     *
     * @type {number}
     */
    MathParameter.prototype.scratchOutDetectionSensitivity = null;

    /**
     *
     */
    MathParameter.prototype.getResultTypes = function () {
        return this.resultTypes;
    };

    /**
     *
     */
    MathParameter.prototype.getUserResources = function () {
        return this.userResources;
    };

    /**
     *
     */
    MathParameter.prototype.getScratchOutDetectionSensitivity = function () {
        return this.scratchOutDetectionSensitivity;
    };

    /**
     *
     * @type {MathParameter}
     */
    scope.MathParameter = MathParameter;
})(MyScript);