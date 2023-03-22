import * as tf from '@tensorflow/tfjs'
import fs from 'fs'
import path from 'path'
const dir = path.resolve()

const file = fs.readFileSync(`${dir}/docs/cotacao-do-dolar.csv`, { encoding: 'utf8' })

console.log(file)