
import Neuroevolution from './Neuroevolution'

/* NEURON**********************************************************************/
export default class Neuron {
  /**
   * Artificial Neuron class
   * 人工神经元类
   *
   * @constructor
   */
  constructor() {
    this.value = 0
    this.weights = []
  }

  /**
   * Initialize number of neuron weights to random clamped values.
   * 随机固定值的神经元权值初始化。
   *
   * @param {nb} Number of neuron weights (number of inputs).
   * @return void
   */
  populate(nb) {
    this.weights = []
    for (let i = 0; i < nb; i++) {
      this.weights.push(Neuroevolution.options.randomClamped())
    }
  }
}
