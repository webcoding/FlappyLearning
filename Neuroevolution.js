/**
 * Provides a set of classes and methods for handling Neuroevolution and
 * genetic algorithms.
 * 提供了一组类和方法处理神经进化和遗传算法。
 *
 * @param {options} An object of options for Neuroevolution.
 */
var Neuroevolution = function (options) {
  var self = this  // reference to the top scope of this module

  // Declaration of module parameters (options) and default values
  // 模块参数（选项）和默认值的声明
  self.options = {
    /**
     * Logistic activation function.
     * 逻辑激活函数。
     *
     * @param {a} Input value.
     * @return Logistic function output.
     */
    activation: function (a) {
      ap = (-a) / 1
      return (1 / (1 + Math.exp(ap)))
    },

    /**
     * Returns a random value between -1 and 1.
     *
     * @return Random value.
     */
    randomClamped: function () {
      return Math.random() * 2 - 1
    },

    // various factors and parameters (along with default values).
    // 各种因素和参数(联通默认值)
    // 感知器结构
    network: [1, [1], 1],    // Perceptron network structure (1 hidden layer).
    // 每代人口
    population: 50,          // Population by generation.
    // 精英 让最好的网络的下一代保持不变
    elitism: 0.2,            // Best networks kepts unchanged for the next generation (rate).
    randomBehaviour: 0.2,    // New random networks for the next generation (rate).
    // 突变权重
    mutationRate: 0.1,       // Mutation rate on the weights of synapses.
    // 突变范围
    mutationRange: 0.5,      // Interval of the mutation changes on the synapse weight.
    // 历史 最新世代保存
    historic: 0,             // Latest generations saved.
    lowHistoric: false,      // Only save score (not the network).
    // 排序
    scoreSort: -1,           // Sort order (-1 = desc, 1 = asc).
    // 育种数
    nbChild: 1,               // Number of children by breeding.

  }

  /**
   * Override default options.
   * 重写默认选项。
   *
   * @param {options} An object of Neuroevolution options.
   * @return void
   */
  self.set = function (options) {
    for (var i in options) {
      // Only override if the passed in value is actually defined.
      if (this.options[i] != undefined) {
        self.options[i] = options[i]
      }
    }
  }

  // Overriding default options with the pass in options
  self.set(options)


/*NEURON**********************************************************************/
  /**
   * Artificial Neuron class
   * 人工神经元类
   *
   * @constructor
   */
  var Neuron = function () {
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
  Neuron.prototype.populate = function (nb) {
    this.weights = []
    for (var i = 0; i < nb; i++) {
      this.weights.push(self.options.randomClamped())
    }
  }


/* LAYER***********************************************************************/
  /**
   * Neural Network Layer class.
   * 神经网络层类。
   *
   * @constructor
   * @param {index} Index of this Layer in the Network.
   */
  var Layer = function (index) {
    this.id = index || 0
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
  Layer.prototype.populate = function (nbNeurons, nbInputs) {
    this.neurons = []
    for (var i = 0; i < nbNeurons; i++) {
      var n = new Neuron()
      n.populate(nbInputs)
      this.neurons.push(n)
    }
  }


/* NEURAL NETWORK**************************************************************/
  /**
   * Neural Network class
   * 神经网络类
   *
   * Composed of Neuron Layers.
   *
   * @constructor
   */
  var Network = function () {
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
  Network.prototype.perceptronGeneration = function (input, hiddens, output) {
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
      // 重复相同的进程作为第一层为每个隐藏层。
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
  Network.prototype.getSave = function () {
    var datas = {
      // 每层神经元的数量及权重
      neurons: [], // Number of Neurons per layer.
      weights: [],  // Weights of each Neuron's inputs.
    }

    for (var i in this.layers) {
      datas.neurons.push(this.layers[i].neurons.length)
      for (var j in this.layers[i].neurons) {
        for (var k in this.layers[i].neurons[j].weights) {
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
  Network.prototype.setSave = function (save) {
    var previousNeurons = 0
    var index = 0
    var indexWeights = 0
    this.layers = []
    for (var i in save.neurons) {
      // Create and populate layers.
      // 创建和填充图层。
      var layer = new Layer(index)
      layer.populate(save.neurons[i], previousNeurons)
      for (var j in layer.neurons) {
        for (var k in layer.neurons[j].weights) {
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
  Network.prototype.compute = function (inputs) {
    // Set the value of each Neuron in the input layer.
    for (var i in inputs) {
      if (this.layers[0] && this.layers[0].neurons[i]) {
        this.layers[0].neurons[i].value = inputs[i]
      }
    }

    // Previous layer is input layer.
    // 前一层是输入层。
    var prevLayer = this.layers[0]
    for (var i = 1; i < this.layers.length; i++) {
      for (var j in this.layers[i].neurons) {
        // For each Neuron in each layer.
        // 对于每一层神经元。
        var sum = 0
        for (var k in prevLayer.neurons) {
          // Every Neuron in the previous layer is an input to each Neuron in the next layer.
          // 前一层的每一个神经元都是下一层神经元的输入。
          sum += prevLayer.neurons[k].value *
                     this.layers[i].neurons[j].weights[k]
        }

        // Compute the activation of the Neuron.
        // 计算神经元的激活。
        this.layers[i].neurons[j].value = self.options.activation(sum)
      }
      prevLayer = this.layers[i]
    }

    // All outputs of the Network.
    var out = []
    var lastLayer = this.layers[this.layers.length - 1]
    for (var i in lastLayer.neurons) {
      out.push(lastLayer.neurons[i].value)
    }
    return out
  }


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
  var Genome = function (score, network) {
    this.score = score || 0
    this.network = network || null
  }


/* GENERATION******************************************************************/
  /**
   * Generation class.
   * 后代类
   *
   * Composed of a set of Genomes.
   * 由一组基因组组成。
   *
   * @constructor
   */
  var Generation = function () {
    this.genomes = []
  }

  /**
   * Add a genome to the generation.
   * 向这一代添加基因组。
   *
   * @param {genome} Genome to add.
   * @return void.
   */
  Generation.prototype.addGenome = function (genome) {
    // 定位插入基因组 留存下来的应该保持排序
    // Locate position to insert Genome into.
    // The gnomes should remain sorted.
    for (var i = 0; i < this.genomes.length; i++) {
      // Sort in descending order. 降序排序
      if (self.options.scoreSort < 0) {
        if (genome.score > this.genomes[i].score) {
          break
        }
      // Sort in ascending order. 升序
      } else {
        if (genome.score < this.genomes[i].score) {
          break
        }
      }
    }

    // Insert genome into correct position.
    // 将基因组插入正确位置。
    this.genomes.splice(i, 0, genome)
  }

  /**
   * Breed to genomes to produce offspring(s).
   * 繁殖到基因组生产后代。
   *
   * @param {g1} Genome 1.
   * @param {g2} Genome 2.
   * @param {nbChilds} Number of offspring (children).
   */
  Generation.prototype.breed = function (g1, g2, nbChilds) {
    var datas = []
    for (var nb = 0; nb < nbChilds; nb++) {
      // Deep clone of genome 1. 基因组1的深克隆。
      var data = JSON.parse(JSON.stringify(g1))
      for (var i in g2.network.weights) {
        // Genetic crossover 遗传交叉
        // 0.5 is the crossover factor. 0.5 是遗传因素。
        // FIXME Really should be a predefined constant.
        if (Math.random() <= 0.5) {
          data.network.weights[i] = g2.network.weights[i]
        }
      }

      // Perform mutation on some weights.
      // 对某些权重执行突变。
      for (var i in data.network.weights) {
        if (Math.random() <= self.options.mutationRate) {
          data.network.weights[i] += Math.random() *
               self.options.mutationRange *
               2 -
               self.options.mutationRange
        }
      }
      datas.push(data)
    }

    return datas
  }

  /**
   * Generate the next generation. 下一代
   *
   * @return Next generation data array.
   */
  Generation.prototype.generateNextGeneration = function () {
    var nexts = []

    for (var i = 0; i < Math.round(self.options.elitism *
                                 self.options.population); i++) {
      if (nexts.length < self.options.population) {
        // Push a deep copy of ith Genome's Nethwork.
        nexts.push(JSON.parse(JSON.stringify(this.genomes[i].network)))
      }
    }

    for (var i = 0; i < Math.round(self.options.randomBehaviour *
                                 self.options.population); i++) {
      var n = JSON.parse(JSON.stringify(this.genomes[0].network))
      for (var k in n.weights) {
        n.weights[k] = self.options.randomClamped()
      }
      if (nexts.length < self.options.population) {
        nexts.push(n)
      }
    }

    var max = 0
    while (true) {
      for (var i = 0; i < max; i++) {
        // Create the children and push them to the nexts array.
        var childs = this.breed(this.genomes[i], this.genomes[max],
                    (self.options.nbChild > 0 ? self.options.nbChild : 1))
        for (var c in childs) {
          nexts.push(childs[c].network)
          if (nexts.length >= self.options.population) {
            // Return once number of children is equal to the
            // population by generatino value.
            // 返回第一次孩子数量等于生成值的数据
            return nexts
          }
        }
      }
      max++
      if (max >= this.genomes.length - 1) {
        max = 0
      }
    }
  }


/* GENERATIONS*****************************************************************/
  /**
   * Generations class.
   * 后代类
   *
   * Hold's previous Generations and current Generation.
   *
   * @constructor
   */
  var Generations = function () {
    this.generations = []
    var currentGeneration = new Generation()
  }

  /**
   * Create the first generation.
   *
   * @param {input} Input layer.
   * @param {input} Hidden layer(s).
   * @param {output} Output layer.
   * @return First Generation.
   */
  Generations.prototype.firstGeneration = function (input, hiddens, output) {
    // FIXME input, hiddens, output unused.

    var out = []
    for (var i = 0; i < self.options.population; i++) {
      // Generate the Network and save it.
      var nn = new Network()
      nn.perceptronGeneration(self.options.network[0],
            self.options.network[1], self.options.network[2])
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
  Generations.prototype.nextGeneration = function () {
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
  Generations.prototype.addGenome = function (genome) {
    // Can't add to a Generation if there are no Generations.
    if (this.generations.length === 0) return false

    // FIXME addGenome returns void.
    return this.generations[this.generations.length - 1].addGenome(genome)
  }


/* SELF************************************************************************/
  self.generations = new Generations()

  /**
   * Reset and create a new Generations object.
   * 重置并创建新世代对象。
   *
   * @return void.
   */
  self.restart = function () {
    self.generations = new Generations()
  }

  /**
   * Create the next generation.
   *
   * @return Neural Network array for next Generation.
   */
  self.nextGeneration = function () {
    var networks = []

    if (self.generations.generations.length == 0) {
      // If no Generations, create first.
      networks = self.generations.firstGeneration()
    } else {
      // Otherwise, create next one.
      networks = self.generations.nextGeneration()
    }

    // Create Networks from the current Generation.
    var nns = []
    for (var i in networks) {
      var nn = new Network()
      nn.setSave(networks[i])
      nns.push(nn)
    }

    if (self.options.lowHistoric) {
      // Remove old Networks.
      if (self.generations.generations.length >= 2) {
        var genomes =
          self.generations
            .generations[self.generations.generations.length - 2]
                        .genomes
        for (var i in genomes) {
          delete genomes[i].network
        }
      }
    }

    if (self.options.historic !== -1) {
      // Remove older generations.
      if (self.generations.generations.length > self.options.historic + 1) {
        self.generations.generations.splice(0,
              self.generations.generations.length - (self.options.historic + 1))
      }
    }

    return nns
  }

  /**
   * Adds a new Genome with specified Neural Network and score.
   * 用指定的神经网络和评分添加新的基因组。
   *
   * @param {network} Neural Network.
   * @param {score} Score value.
   * @return void.
   */
  self.networkScore = function (network, score) {
    self.generations.addGenome(new Genome(score, network.getSave()))
  }
}
