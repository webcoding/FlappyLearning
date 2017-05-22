
import Neuroevolution from './Neuroevolution'

/* GENERATION******************************************************************/
export default class Generation {
  /**
   * Generation class.
   * 后代类
   *
   * Composed of a set of Genomes.
   * 由一组基因组组成。
   *
   * @constructor
   */
  constructor() {
    this.genomes = []
  }

  /**
   * Add a genome to the generation.
   * 向这一代添加基因组。
   *
   * @param {genome} Genome to add.
   * @return void.
   */
  addGenome(genome) {
    // 定位插入基因组 留存下来的应该保持排序
    // Locate position to insert Genome into.
    // The gnomes should remain sorted.
    for (var i = 0; i < this.genomes.length; i++) {
      // Sort in descending order. 降序排序
      if (Neuroevolution.options.scoreSort < 0) {
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
  breed(g1, g2, nbChilds) {
    const datas = []
    for (let nb = 0; nb < nbChilds; nb++) {
      // Deep clone of genome 1. 基因组1的深克隆。
      const data = JSON.parse(JSON.stringify(g1))
      for (const i in g2.network.weights) {
        // Genetic crossover 遗传交叉
        // 0.5 is the crossover factor. 0.5 是遗传因素。
        // FIXME Really should be a predefined constant.
        if (Math.random() <= 0.5) {
          data.network.weights[i] = g2.network.weights[i]
        }
      }

      // Perform mutation on some weights.
      // 对某些权重执行突变。
      for (const i in data.network.weights) {
        if (Math.random() <= Neuroevolution.options.mutationRate) {
          data.network.weights[i] += Math.random() *
               Neuroevolution.options.mutationRange *
               2 -
               Neuroevolution.options.mutationRange
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
  generateNextGeneration() {
    const nexts = []

    for (let i = 0; i < Math.round(Neuroevolution.options.elitism * Neuroevolution.options.population); i++) {
      if (nexts.length < Neuroevolution.options.population) {
        // Push a deep copy of ith Genome's Nethwork.
        nexts.push(JSON.parse(JSON.stringify(this.genomes[i].network)))
      }
    }

    for (let i = 0; i < Math.round(Neuroevolution.options.randomBehaviour * Neuroevolution.options.population); i++) {
      const n = JSON.parse(JSON.stringify(this.genomes[0].network))
      for (const k in n.weights) {
        n.weights[k] = Neuroevolution.options.randomClamped()
      }
      if (nexts.length < Neuroevolution.options.population) {
        nexts.push(n)
      }
    }

    let max = 0
    while (true) {
      for (let i = 0; i < max; i++) {
        // Create the children and push them to the nexts array.
        const childs = this.breed(this.genomes[i], this.genomes[max], (Neuroevolution.options.nbChild > 0 ? Neuroevolution.options.nbChild : 1))
        for (const c in childs) {
          nexts.push(childs[c].network)
          if (nexts.length >= Neuroevolution.options.population) {
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
}
