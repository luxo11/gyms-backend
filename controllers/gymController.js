const multer = require('multer')
const mongoose = require('mongoose')
const Gym = require('../models/gymModel')

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        let date = String(Date.now())
        let random = String(Math.floor(Math.random() * 1000000))
        let extension = file.mimetype.split('/').slice(-1)[0]
        cb(null, date + random + '.' + extension)
    }
})

const upload = multer({storage:storage})

const getGyms = async (req, res) => {
    const { city, region } = req.query

    const gyms = await Gym.find({city: { $regex: `${diacriticSensitiveRegex(city)}`, $options: 'i' }, region: { $regex: `${diacriticSensitiveRegex(region)}`, $options: 'i' }}).select('-ownerId')
    
    if(gyms.length === 0) {
        return res.status(404).json({error: 'Žiadne gymy v danej lokalite'})
    }
    res.status(200).json({gyms})
}

const getGym = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Gym nebol nájdený.'})
      }

    const gym = await Gym.findOne({_id:id}).select('-ownerId')

    if(!gym) {
        return res.status(404).json({error: 'Gym nebol nájdený.'})
    }

    if(gym) {
        res.status(200).json({gym})
    }
}

const filterGyms = async (req, res) => {
    const { city, region } = req.query
    const categories = JSON.parse(req.query.categories)

    if(categories.length === 0) {
        const gyms = await Gym.find({city: { $regex: `${diacriticSensitiveRegex(city)}`, $options: 'i' }, region: { $regex: `${diacriticSensitiveRegex(region)}`, $options: 'i' }}).select('-ownerId')
        res.status(200).json({gyms})
    }
    
    if(categories.length > 0) {
        const gyms = await Gym.find({city: { $regex: `${diacriticSensitiveRegex(city)}`, $options: 'i' }, region: { $regex: `${diacriticSensitiveRegex(region)}`, $options: 'i' }, categories: { $in:categories}}).select('-ownerId')
        res.status(200).json({gyms})
    }
}

const addGym = async (req, res) => {
        const { name, address, city, district, region, email, phone, description, website, instagram, facebook } = req.body
        const openingHours = JSON.parse(req.body.openingHours)
        const categories = JSON.parse(req.body.categories)
        const image = req.file
        const { _id } = req.user

        let emptyFields = [];

        if(!name) {emptyFields.push('name')}
        if(!address) {emptyFields.push('address')}
        if(!city) {emptyFields.push('city')}
        if(!openingHours[0]) {emptyFields.push('openingHours[0]')}
        if(!openingHours[1]) {emptyFields.push('openingHours[1]')}
        if(!openingHours[2]) {emptyFields.push('openingHours[2]')}
        if(!openingHours[3]) {emptyFields.push('openingHours[3]')}
        if(!openingHours[4]) {emptyFields.push('openingHours[4]')}
        if(!openingHours[5]) {emptyFields.push('openingHours[5]')}
        if(!openingHours[6]) {emptyFields.push('openingHours[6]')}
        if(!description) {emptyFields.push('description')}
        if(!image) {emptyFields.push('image')}

        if (emptyFields.length > 0) {
            return res.status(400).json({ error: 'Vyplnte všetky povinné polia.', emptyFields })
          }

        const gym = await Gym.create({name, address, city, district, region, openingHours, categories, email, phone, description, website, instagram, facebook, imageName:image.filename, originalImageName:image.originalname, ownerId:_id })
        
        if(gym) {
            res.status(200).json({gym})
        }

    }

    const editOwnedGym = async (req, res) => {
        const { _id } = req.user
        const { id } = req.params

        const { name, address, city, district, region, email, phone, description, website, instagram, facebook } = req.body
        const openingHours = JSON.parse(req.body.openingHours)
        const categories = JSON.parse(req.body.categories)
        const image = req.file || req.body.image

        let emptyFields = [];

        if(!name) {emptyFields.push('name')}
        if(!address) {emptyFields.push('address')}
        if(!city) {emptyFields.push('city')}
        if(!openingHours[0]) {emptyFields.push('openingHours[0]')}
        if(!openingHours[1]) {emptyFields.push('openingHours[1]')}
        if(!openingHours[2]) {emptyFields.push('openingHours[2]')}
        if(!openingHours[3]) {emptyFields.push('openingHours[3]')}
        if(!openingHours[4]) {emptyFields.push('openingHours[4]')}
        if(!openingHours[5]) {emptyFields.push('openingHours[5]')}
        if(!openingHours[6]) {emptyFields.push('openingHours[6]')}
        if(!description) {emptyFields.push('description')}
        if(!image) {emptyFields.push('image')}

        if (emptyFields.length > 0) {
            return res.status(400).json({ error: 'Vyplnte všetky povinné polia.', emptyFields })
          }
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'Gym nebol nájdený.'})
          }
          
        const gym = await Gym.updateOne ({_id:id, ownerId:_id}, {name, address, city, district, region, openingHours, categories, email, phone, description, website, instagram, facebook, imageName:image.filename, originalImageName:image.originalname })
        
        if(gym) {
            res.status(200).json({gym})
        }
    }

    const getOwnedGyms = async (req, res) => {
        const { _id } = req.user

        const gyms = await Gym.find({ownerId: _id})

        if(!gyms) {
            return res.status(404).json({error: 'Nemáte žiadne gymy v zozname'})
        }
        if(gyms) {
            res.status(200).json({gyms})
        }
    }   

    const getOwnedGym = async (req, res) => {
        const { _id } = req.user
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'Gym nebol nájdený.'})
          }
        
        const gym = await Gym.findOne({ownerId: _id, _id:id})
        
        if(!gym) {
            return res.status(404).json({error: 'Gym nebol nájdený.'})
        }
        if(gym) {
            res.status(200).json({gym})
        }
    }

module.exports = { getGyms, getGym, filterGyms, addGym, getOwnedGyms, getOwnedGym, editOwnedGym, upload }