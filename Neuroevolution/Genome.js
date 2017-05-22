/* GENOME**********************************************************************/

/**
 * Genome class.
 * 基因组类。
 *
 * Composed of a score and a Neural Network.
 * 由分数和神经网络组成。
 *
 * @constructor
 *
 * @param {score}
 * @param {network}
 */
export default class Genome {
  constructor(score = 0, network = null) {
    this.score = score
    this.network = network
  }
}
