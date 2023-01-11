const City = require('../models/cityModel')

const getCities = async (req, res) => {
    const { city } = req.params

    const diacriticSensitiveRegex = (string) => {
        return string.replace(/a/gi, '[a,á,ä]')
            .replace(/c/gi, '[c,č]')
            .replace(/d/gi, '[d,ď]')
            .replace(/e/gi, '[e,é]')
            .replace(/i/gi, '[i,í]')
            .replace(/l/gi, '[l,ĺ,ľ]')
            .replace(/n/gi, '[n,ň]')
            .replace(/o/gi, '[o,ó,ô]')
            .replace(/r/gi, '[r,ŕ]')
            .replace(/s/gi, '[s,š]')
            .replace(/t/gi, '[t,ť]')
            .replace(/u/gi, '[u,ú]')
            .replace(/y/gi, '[y,ý]')
            .replace(/z/gi, '[z,ž]')
    }
    
    const cities = await City.find({name: { $regex: `^${diacriticSensitiveRegex(city)}`, $options: 'i' }}).limit(10)

    if(cities.length === 0){
        return res.status(404).json({error: 'Zadané mesto neexistuje.'})
    }
    res.status(200).json(cities)
}

module.exports = { getCities }