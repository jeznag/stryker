'use strict';

var _ = require('lodash');
import BaseMutation from './BaseMutation';
import Mutant from '../Mutant';
import ParserUtils from '../utils/ParserUtils';

abstract class BaseOperatorMutation extends BaseMutation {
  _operators;
  
  /**
   * Represents a base class for all operator based mutations.
   * @class
   * @param {String} name - The name of the mutation.
   * @param {String[]} types - The types of mutation as expected by the parser.
   * @param {Object} operators - The object containing all operators and their counterparts.
   */
  constructor(name: string, types: string[], operators) {
    super(name, types);
    //TODO Create type for operators

    this._operators = operators;
  }

  applyMutation(filename: string, originalCode: string, node, ast) {
    var originalOperator = node.operator;
    var mutants: Mutant[] = [];
    node.operator = this.getOperator(node.operator);

    var parserUtils = new ParserUtils();
    var lineOfCode = parserUtils.generate(node, originalCode);
    // Use native indexOf because the operator may be multiple characters.
    var columnNumber = (lineOfCode.indexOf(node.operator) + 1) + node.loc.start.column;
    mutants.push(new Mutant(filename, originalCode, this, ast, node, columnNumber));

    node.operator = originalOperator;

    return mutants;
  }

  canMutate(node) {
    return !!(node && _.indexOf(this._types, node.type) >= 0 && this.getOperator(node.operator));
  }

  /**
   * Gets the mutated operator based on an unmutated operator.
   * @function
   * @param {String} operator - An umutated operator.
   * @returns {String} The mutated operator.
   */
  getOperator(operator: string): string {
    return this._operators[operator];
  }
}

export default BaseOperatorMutation;