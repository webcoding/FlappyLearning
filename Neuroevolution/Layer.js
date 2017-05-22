
import Neuron from './Neuron'

/* LAYER***********************************************************************/
export default class Layer {
  /**
   * Neural Network Layer class.
   * 神经网络层类。
   *
   * @constructor
   * @param {index} Index of this Layer in the Network.
   */
  constructor(index = 0) {
    this.id = index
    this.neurons = []
  }

  /**
   * Populate the Layer with a set of randomly weighted Neurons.
   * 用一组随机加权神经元填充层。
   *
   * Each Neuron be initialied with nbInputs inputs with a random clamped value.
   *
   * @param {nbNeurons} Number of neurons.
   * @param {nbInputs} Number of inputs.
   * @return void
   */
  populate(nbNeurons, nbInputs) {
    this.neurons = []
    for (let i = 0; i < nbNeurons; i++) {
      const n = new Neuron()
      n.populate(nbInputs)
      this.neurons.push(n)
    }
  }
}
