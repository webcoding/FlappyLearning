
import Network from './Network'
import Genome from './Genome'
import Generations from './Generations'

/**
 * Provides a set of classes and methods for handling Neuroevolution and
 * genetic algorithms.
 * 提供了一组类和方法处理神经进化和遗传算法。
 *
 * @param {options} An object of options for Neuroevolution.
 */
var self = this  // reference to the top scope of this module
// Declaration of module parameters (options) and default values
// 模块参数（选项）和默认值的声明
var defaultOptions = {
  /**
   * Logistic activation function.
   * 逻辑激活函数。
   *
   * @param {a} Input value.
   * @return Logistic function output.
   */
  activation(a) {
    const ap = (-a) / 1
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
export default class Neuroevolution {
  constructor(options = defaultOptions) {
    // Overriding default options with the pass in options
    this.set(options)
    this.generations = new Generations()
  }

  /**
   * Override default options.
   * 重写默认选项。
   *
   * @param {options} An object of Neuroevolution options.
   * @return void
   */
  set(options) {
    for (var i in options) {
      // Only override if the passed in value is actually defined.
      if (this.options[i] !== undefined) {
        this.options[i] = options[i]
      }
    }
  }


  // import ...


/* SELF************************************************************************/
  // generations: new Generations()

  /**
   * Reset and create a new Generations object.
   * 重置并创建新世代对象。
   *
   * @return void.
   */
  restart() {
    self.generations = new Generations()
  }

  /**
   * Create the next generation.
   *
   * @return Neural Network array for next Generation.
   */
  nextGeneration() {
    var networks = []

    if (self.generations.generations.length === 0) {
      // If no Generations, create first.
      networks = self.generations.firstGeneration()
    } else {
      // Otherwise, create next one.
      networks = self.generations.nextGeneration()
    }

    // Create Networks from the current Generation.
    var nns = []
    for (const i in networks) {
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
        for (const i in genomes) {
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
  networkScore(network, score) {
    self.generations.addGenome(new Genome(score, network.getSave()))
  }
}
