
import Layer from './Layer'

/* NEURAL NETWORK**************************************************************/
export default class Network {
  /**
   * Neural Network class
   * 神经网络类
   *
   * Composed of Neuron Layers.
   *
   * @constructor
   */
  constructor() {
    this.layers = []
  }

  /**
   * Generate the Network layers.
   * 生成网络层。
   *
   * @param {input} Number of Neurons in Input layer.
   * @param {hidden} Number of Neurons per Hidden layer.
   * @param {output} Number of Neurons in Output layer.
   * @return void
   */
  perceptronGeneration(input, hiddens, output) {
    var index = 0
    var previousNeurons = 0
    var layer = new Layer(index)

    // Number of Inputs will be set to 0 since it is an input layer.
    // 输入的数量将被设置为0，因为它是一个输入层。
    layer.populate(input, previousNeurons)

    // number of input is size of previous layer.
    // 输入的数目是上一层的大小。
    previousNeurons = input

    this.layers.push(layer)
    index++
    for (var i in hiddens) {
      // Repeat same process as first layer for each hidden layer.
      // 为每个隐藏层重复相同的进程作为第一层。
      var layer = new Layer(index)
      layer.populate(hiddens[i], previousNeurons)
      previousNeurons = hiddens[i]
      this.layers.push(layer)
      index++
    }
    var layer = new Layer(index)

    // Number of input is equal to the size of the last hidden layer.
    // 输入的数目等于最后一个隐藏层的大小。
    layer.populate(output, previousNeurons)

    this.layers.push(layer)
  }

  /**
   * Create a copy of the Network (neurons and weights).
   * 创建网络副本（神经元和权值）。
   *
   * Returns number of neurons per layer and a flat array of all weights.
   * 返回每个层的神经元数和所有权值的平坦数组。
   *
   * @return Network data.
   */
  getSave() {
    const datas = {
      // 每层神经元的数量及权重
      neurons: [], // Number of Neurons per layer.
      weights: [],  // Weights of each Neuron's inputs.
    }

    for (const i in this.layers) {
      datas.neurons.push(this.layers[i].neurons.length)
      for (const j in this.layers[i].neurons) {
        for (const k in this.layers[i].neurons[j].weights) {
          // push all input weights of each Neuron of each Layer into a flat array.
          // 将每个层的每个神经元的输入权值推入一个平面数组。
          datas.weights.push(this.layers[i].neurons[j].weights[k])
        }
      }
    }
    return datas
  }

  /**
   * Apply network data (neurons and weights).
   *
   * @param {save} Copy of network data (neurons and weights).
   * @return void
   */
  setSave(save) {
    let previousNeurons = 0
    let index = 0
    let indexWeights = 0
    this.layers = []
    for (const i in save.neurons) {
      // Create and populate layers.
      // 创建和填充图层。
      const layer = new Layer(index)
      layer.populate(save.neurons[i], previousNeurons)
      for (const j in layer.neurons) {
        for (const k in layer.neurons[j].weights) {
            // Apply neurons weights to each Neuron.
            // 每个神经元应用神经元权值。
          layer.neurons[j].weights[k] = save.weights[indexWeights]

          // Increment index of flat array.
          // 增量索引平面阵列。
          indexWeights++
        }
      }
      previousNeurons = save.neurons[i]
      index++
      this.layers.push(layer)
    }
  }

  /**
   * Compute the output of an input.
   *
   * @param {inputs} Set of inputs.
   * @return Network output.
   */
  compute(inputs) {
    // Set the value of each Neuron in the input layer.
    for (const i in inputs) {
      if (this.layers[0] && this.layers[0].neurons[i]) {
        this.layers[0].neurons[i].value = inputs[i]
      }
    }

    // Previous layer is input layer.
    // 前一层是输入层。
    var prevLayer = this.layers[0]
    for (let i = 1; i < this.layers.length; i++) {
      for (const j in this.layers[i].neurons) {
        // For each Neuron in each layer.
        // 对于每一层神经元。
        var sum = 0
        for (const k in prevLayer.neurons) {
          // Every Neuron in the previous layer is an input to each Neuron in the next layer.
          // 前一层的每一个神经元都是下一层神经元的输入。
          sum += prevLayer.neurons[k].value * this.layers[i].neurons[j].weights[k]
        }

        // Compute the activation of the Neuron.
        // 计算神经元的激活。
        this.layers[i].neurons[j].value = self.options.activation(sum)
      }
      prevLayer = this.layers[i]
    }

    // All outputs of the Network.
    const out = []
    const lastLayer = this.layers[this.layers.length - 1]
    for (const i in lastLayer.neurons) {
      out.push(lastLayer.neurons[i].value)
    }
    return out
  }
}

