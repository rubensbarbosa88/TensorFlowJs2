import * as tf from '@tensorflow/tfjs'

let archive
const button = document.querySelector('button')
const fileInput = document.querySelector('input[type="file"]');
const inputArea = document.querySelector('#property_area');
const inputAge = document.querySelector('#property_age');
fileInput.addEventListener("change", readInputFile);
button.addEventListener('click', submit)

function readInputFile () {
  const file = fileInput.files[0]

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => archive = reader.result.split('\r\n')
}

const getDataTypes = (file, inputsHeader) => {
  return file.reduce((prev, current) => {
    const itemArr = current.split(';').filter(i => !!i)

    itemArr.forEach((item, index) => {
      if (index < inputsHeader) {
        prev.x.push(Number(item))
      } else {
        prev.y.push(Number(item))
      }
    });

    return prev
  }, { x: [], y: [] })
}

async function submit () {
  console.log('PROCESSANDO ...')
  const headers = archive[0].split(';')
  const inputsLength = headers.filter(i => i === 'input').length
  const outputsLength = headers.filter(i => i === 'output').length
  delete archive.shift()

  const dataTypes = getDataTypes(archive, inputsLength)

  const x = tf.tensor(dataTypes.x, [(dataTypes.x.length / inputsLength), inputsLength])
  const y = tf.tensor(dataTypes.y, [(dataTypes.y.length / outputsLength), outputsLength])
  const input = tf.tensor([Number(inputArea.value), Number(inputAge.value)], [1, 2])

  const model = tf.sequential()
  const inputLayer = tf.layers.dense({ inputShape: [inputsLength], units: outputsLength })
  const optimizer = tf.train.sgd(.00001)

  model.add(inputLayer)
  model.compile({ loss: 'meanSquaredError', optimizer })

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


