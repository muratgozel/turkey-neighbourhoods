import path from 'node:path'
import {TurkeyNeighbourhoods, TurkeyCityDistances} from './resources/index.js'

const n = new TurkeyNeighbourhoods({
    storagePath: path.join('storage', 'resources', 'neighbourhoods'),
    outputPath: path.join('src', 'data', 'neighbourhoods')
})
await n.run()

const d = new TurkeyCityDistances({
    storagePath: path.join('storage', 'resources', 'distances'),
    outputPath: path.join('src', 'data', 'distances')
})
await d.run()