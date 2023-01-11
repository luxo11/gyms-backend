const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET)
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body
  let emptyFields = [];

  if(!email) {emptyFields.push('email')}
  if(!password) {emptyFields.push('password')}

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Vyplnte všetky povinné polia.', emptyFields })
  }

    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(400).json({ error: 'Nesprávne prihlasovacie údaje.'})
    }
  
    const match = await bcrypt.compare(password, user.password)
    
    if (!match) {
      return res.status(400).json({ error: 'Nesprávne prihlasovacie údaje.'})
    }
    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token, role:user.role})
  
}

// signup a user
const signupUser = async (req, res) => {
  const {name, lastName, email, password, confPassword, role} = req.body
  let passLength = false
  let passLower = false
  let passUpper = false
  let passNum = false
  
  let emptyFields = [];

  if(!name) {emptyFields.push('name')}
  if(!lastName) {emptyFields.push('lastName')}
  if(!email) {emptyFields.push('email')}
  if(!password) {emptyFields.push('password')}
  if(!confPassword) {emptyFields.push('confPassword')}

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Vyplnte všetky povinné polia.', emptyFields })
  }

  passLength = password.length >= 8 
  passLower = /[a-z]/.test(password) 
  passUpper = /[A-Z]/.test(password)
  passNum = /[0-9]/.test(password) 

  if(!passLength || !passLower || !passUpper || !passNum) {
    return res.status(400).json({error: 'Ustitie sa, že heslo spĺňa všetky požiadavky.'})
  }

  if (password !== confPassword) {
    return res.status(400).json({ error: 'Heslá sa nezhodujú'})
  }

  const exists = await User.findOne({ email })

  if (exists) {
    return res.status(400).json({ error: `Email: ${email} sa už používa.` })
  }
  
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  
  const user = await User.create({ name, lastName, email, password: hash, role })

  // create a token
  const token = createToken(user._id)

  res.status(200).json({email, token, role})
 
}

module.exports = { signupUser, loginUser }