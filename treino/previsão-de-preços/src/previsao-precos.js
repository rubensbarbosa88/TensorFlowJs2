import * as tf from '@tensorflow/tfjs'

const button = document.getElementsByTagName('button')[0]
const input = document.getElementsByTagName('input')[0]

button.addEventListener('click', readInputFile)


function readInputFile () {
  const file = input.files[0]

  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = () => handleFile(reader.result.split('\r\n'))
}

const showInputsData = (data) => {
  const el = document.getElementById('csv-inputs')
  el.innerHTML = data
}

const getDataTypes = (file, inputsHeader, outputsHeader) => {
  return file.reduce((prev, current) => {
    const itemArr = current.split(';').filter(i => !!i)

    if ((inputsHeader + outputsHeader) == itemArr.length) {
      itemArr.forEach((item, index) => {
        if (index < inputsHeader) {
          prev.x.push(Number(item))
        } else {
          prev.y.push(Number(item))
        }
      });
    } else {
      prev.input = prev.input.concat(itemArr).map(i => Number(i))
    }

    return prev
  }, { x: [], y: [], input: []})
}

const handleDataTypes = (data, headerInput, headerOutput) => {

}
const handleFile = async (file) => {
  console.log('PROCESSANDO ...')
  const headers = file[0].split(';')
  const inputsLength = headers.filter(i => i === 'input').length
  const outputsLength = headers.filter(i => i === 'output').length
  delete file.shift()

  const dataTypes = getDataTypes(file, inputsLength, outputsLength)

  const x = tf.tensor(dataTypes.x, [(dataTypes.x.length / inputsLength), inputsLength])
  const y = tf.tensor(dataTypes.y, [(dataTypes.y.length / outputsLength), outputsLength])
  const input = tf.tensor(dataTypes.input, [(dataTypes.input.length / inputsLength), inputsLength])

  const model = tf.sequential()
  const inputLayer = tf.layers.dense({ inputShape: [inputsLength], units: outputsLength })
  model.add(inputLayer)
  model.compile({ loss: 'meanSquaredError', optimizer: tf.train.sgd(0.05)})

  await model.fit(x, y, { epochs: 500})
  const output = model.predict(input).dataSync()

  const result = []

  output.forEach(i => {
    const n = parseInt(Math.ceil(i))
    result.push(n)
  });

  console.clear()
  console.log(result)
}


