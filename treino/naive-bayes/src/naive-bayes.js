// import * as tf from '@tensorflow/tfjs'

const entries = ['bom',      'mau',      'indiferente', 'indiferente']
const classes = ['positivo', 'negativo', 'positivo',    'negativo']

function calcSize (arr) {
  const size = arr.reduce((prev, item) => {
    const percent = (100 / arr.length).toFixed(2)
    const percentItem = arr.filter(i => i === item).length
    const itemSize = (percent * percentItem) / 100

    prev[item] = itemSize
    return prev

  }, {})

  console.log(size)
}

function frequency () {
  const allClassesExist = [...new Set(classes)]

  const freq = entries.reduce((prev, item, i) => {
    const classe = classes[i]

    const entryExist = prev.findIndex(inner => {
      if(inner?.Entry === item) {
        if(inner[classe]) {
          inner[classe] += 1
        } else {
          inner[classe] = 1
        }

        return inner
      }
    })

    if (entryExist > 0) {
      return prev
    } else {
      const obj = {}
      obj.Entry = item
      allClassesExist.forEach(inner => obj[inner] = 0)

      obj[classe] = 1
      prev.push(obj)
      return prev
    }
  }, [])

  return freq
}

function classOcurrencyForEntry(_entry, _class) {
  const categories = frequency()

  const category = categories.find(item => item.Entry === _entry)
  console.log(category[_class])
  return category[_class]

}

classOcurrencyForEntry('indiferente', 'negativo')