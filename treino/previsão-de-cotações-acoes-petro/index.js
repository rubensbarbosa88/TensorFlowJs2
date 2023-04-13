import * as tf from '@tensorflow/tfjs'
import fs from 'fs'
import path from 'path'
const dir = path.resolve()

const file = await fs.readFileSync(`${dir}/docs/cotacao-das-acoes-pn-da-petrobras.csv`, { encoding: 'utf8' })

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
  }

  yData.push(currentData)
})

const roundLengthArr = () => {
  return new Promise(async (resolve) => {
    if (xData.length > yData.length) {
      xData.pop()
      await roundLengthArr()
    }

    if (yData.length > xData.length) {
      yData.pop()
      await roundLengthArr()
    }

    resolve()
  })
}

const buildTraning = async () => {
  await roundLengthArr()
  const x = tf.tensor(xData, [xData.length, 4])
  const y = tf.tensor(yData, [yData.length, 4])

  const model = tf.sequential()
  const inputLayer = tf.layers.dense({ units: 4, inputShape: [4] })

  model.add(inputLayer)

  const learningRate = 0.00001
  const optimizer = tf.train.sgd(learningRate)

  model.compile({ loss: 'meanSquaredError', optimizer })

  const dataInput = [26.83, 27.10, 27.13, 26.64]
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
