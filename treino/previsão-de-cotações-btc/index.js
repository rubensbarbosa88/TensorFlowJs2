import * as tf from '@tensorflow/tfjs'
import { train } from '@tensorflow/tfjs'
import fs from 'fs'
import path from 'path'
const dir = path.resolve()

const file = await fs.readFileSync(`${dir}/docs/cotacao-do-bitcoin.csv`, { encoding: 'utf8' })

const dataFile = file.split('\r\n')
delete dataFile.shift();

let xData = []
let yData = []

const itemsNumber = (arr = []) => {
    delete arr.shift();
    return arr.map((inner, i) => Number(inner))
}

dataFile.forEach((item, index, arr) => {
    const before = arr[index+1]
    const currentSplit = item.split(';')
    const currentData = itemsNumber(currentSplit)

    if (before) {
        const beforeSplit = before.split(';')
        const beforeData = itemsNumber(beforeSplit)
        xData.push(beforeData)
    } else {
        xData.push([3709.4, 3815.1, 3819.6, 3658.8])
    }

    yData.push(currentData)
})

const buildTraning = async () => {
    const x = tf.tensor(xData, [xData.length, 4])
    const y = tf.tensor(yData, [yData.length, 4])

    const model = tf.sequential()
    const inputLayer = tf.layers.dense({ units: 4, inputShape: [4] })

    model.add(inputLayer)

    // Taxa de aprendizagem
    // quanto maior, a maquina vai tentar aprender em um ritimo muito alto
    // numeros menores podem utilizar a taxa padrão 0.001
    // para numeros maiores, a maquina precisara de um ritimo mais lento de aprendizagem
    // mais tempo para aprender, então é necessário aumentar a taxa de aprendizagem
    // ex:
    // para o numero 3.5, percebese que só existe uma casa decimal
    // então é utilizado a taxa 0.001, o calculo funciuona da seguinte forma.
    // para cada numero decimal, utiliza o dobro de zeros antes do 1
    // ex:
    // 3 = 0.001
    // 35 = 0.00001
    // 400 = 0.0000001
    // 1000 = 0.000000001
    const learningRate = 0.000000001
    const optimizer = tf.train.sgd(learningRate)

    model.compile({ loss: 'meanSquaredError', optimizer })

    const dataInput = [7190.3, 6386.6, 7373.8, 6386.5]
    const input =  tf.tensor(dataInput, [1, 4])

    await model.fit(x, y, { epochs: 500})
    const predict = model.predict(input).dataSync()

    console.log(predict)
}

const training = async () => {
    await tf.ready()
    buildTraning()
}

training()

// console.log(x.print())
// console.log(y.print())