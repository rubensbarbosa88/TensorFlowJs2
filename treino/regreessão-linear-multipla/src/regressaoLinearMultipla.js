import * as tf from '@tensorflow/tfjs'

const execute = async () => {
    console.log('Preocessando ...')
    const model = tf.sequential()
    const inputLayer = tf.layers.dense({ units: 1, inputShape: [3] })

    model.add(inputLayer)
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

    const x = tf.tensor([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    const y = tf.tensor([[6], [15], [24]])
    const input = tf.tensor([[10, 11, 12]], [1, 3])

    await model.fit(x, y, { epochs: 550 })

    const output = model.predict(input).dataSync()
    const result = []

    output.forEach(i => {
        result.push(Math.ceil(i))
    });

    console.clear()
    console.log(result)
}

execute()