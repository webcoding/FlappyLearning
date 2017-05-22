
import Neuroevolution from './Neuroevolution'
import Network from './Network'
import Generation from './Generation'

/* GENERATIONS*****************************************************************/
export default class Generations {
  /**
   * Generations class.
   * 后代类
   *
   * Hold's previous Generations and current Generation.
   *
   * @constructor
   */
  constructor() {
    this.generations = []
    // var currentGeneration = new Generation()
  }

  /**
   * Create the first generation.
   *
   * @param {input} Input layer.
   * @param {input} Hidden layer(s).
   * @param {output} Output layer.
   * @return First Generation.
   */
  firstGeneration(input, hiddens, output) {
    // FIXME input, hiddens, output unused.

    var out = []
    for (var i = 0; i < Neuroevolution.options.population; i++) {
      // Generate the Network and save it.
      var nn = new Network()
      nn.perceptronGeneration(Neuroevolution.options.network[0],
            Neuroevolution.options.network[1], Neuroevolution.options.network[2])
      out.push(nn.getSave())
    }

    this.generations.push(new Generation())
    return out
  }

  /**
   * Create the next Generation.
   * 生成下一代
   *
   * @return Next Generation.
   */
  nextGeneration() {
    if (this.generations.length === 0) {
      // Need to create first generation.
      return false
    }

    var gen = this.generations[this.generations.length - 1]
        .generateNextGeneration()
    this.generations.push(new Generation())
    return gen
  }

  /**
   * Add a genome to the Generations.
   *
   * @param {genome}
   * @return False if no Generations to add to.
   */
  addGenome(genome) {
    // Can't add to a Generation if there are no Generations.
    if (this.generations.length === 0) return false

    // FIXME addGenome returns void.
    return this.generations[this.generations.length - 1].addGenome(genome)
  }

}
