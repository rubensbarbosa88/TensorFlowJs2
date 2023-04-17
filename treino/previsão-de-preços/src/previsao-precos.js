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

const getDataTypes = (arr, inputsHeader) => {
    return arr.reduce((prev, current) => {
        const itemArr = current.split(';')
        
        itemArr.forEach((item, index) => {
            if (item && (index < inputsHeader)) {
                prev.inputs.push(Number(item))
            } else {
                prev.outputs.push(Number(item))
            }            
        });
    
        return prev
    }, { inputs: [], outputs: []})
}


const handleFile = (file) => {
    const headers = file[0].split(';')
    const inputsLength = headers.filter(i => i === 'input').length
    const outputsLength = headers.filter(i => i === 'output').length
    delete file.shift()

    const dataTypes = getDataTypes(file, inputsLength)
    const diff = (dataTypes.inputs.length - dataTypes.outputs.length) + 1
    
    const x = dataTypes.inputs.slice(0, diff)
    const y = dataTypes.outputs.filter(i => !!i)
    const input = dataTypes.inputs.slice(diff, dataTypes.inputs.length)

    console.log(inputsLength)
    console.log(outputsLength)

    console.log(x)
    console.log(y)
    console.log(input)
    // const inputsData = dataFile.flatMap((item, i) => {
    //     console.log(item)
    //     if (i < outputsLength) {
    //         return item
    //     }
    // })

    // console.log(inputsData)

}

const execute = async () => {
    console.log('OK!!')
    // console.log('Preocessando ...')
    // const model = tf.sequential()
    // const inputLayer = tf.layers.dense({ inputShape: [1], units: 1 })

    // model.add(inputLayer)
    // model.compile({ loss: 'meanSquaredError', optimizer: 'sgd'})

    // const x = tf.tensor2d([1, 2, 3, 4], [4, 1])
    // const y = tf.tensor2d([[11], [22], [33], [44]])
    // const input = tf.tensor2d([5, 6, 7], [3, 1])

    // await model.fit(x, y, { epochs: 550})
    // const output = model.predict(input).dataSync()
    // const result = []

    // output.forEach(i => {
    //     result.push(Math.ceil(i))
    // });

    // console.clear()
    // console.log(result)

    // tf.dispose([model, x, y, input, output])
}

// execute()


