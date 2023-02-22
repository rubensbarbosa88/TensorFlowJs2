import * as tf from '@tensorflow/tfjs'

const execute = async () => {
    console.log('Preocessando ...')
    const model = tf.sequential()
    const inputLayer = tf.layers.dense({ inputShape: [1], units: 1 })

    model.add(inputLayer)
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd'})

    const x = tf.tensor2d([1, 2, 3, 4], [4, 1])
    const y = tf.tensor2d([[11], [22], [33], [44]])
    const input = tf.tensor2d([5, 6, 7], [3, 1])

    await model.fit(x, y, { epochs: 550})
    const output = model.predict(input).dataSync()
    const result = []

    output.forEach(i => {
        result.push(Math.ceil(i))
    });

    console.clear()
    console.log(result)

    tf.dispose([model, x, y, input, output])
}

execute()
