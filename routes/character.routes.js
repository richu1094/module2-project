const express = require('express')
const router = express.Router()

const marvelService = require('../services/characters.services')
const { isLoggedIn, checkOwnerOr } = require('../middleware/route-guard')
const User = require('../models/User.model')


router.get("/", isLoggedIn, (req, res, next) => {

    const { name, serie } = req.query

    if (name) {
        marvelService
            .getCharacterByName(name)
            .then(response => res.render('characters/list', { characters: response.data.data.results }))
            .catch(err => next(err))
    }

    if (serie) {
        marvelService
            .getCharacterBySerie(serie)
            .then(response => res.render('characters/list', { characters: response.data.data.results }))
            .catch(err => next(err))
    }

    marvelService
        .getAllCharacters()
        .then(response => {
            // let array = []
            // response.data.data.results.forEach(e => array.push(e.name))
            // const isFav = req.session.currentUser.favCharacters.includes(...array)
            res.render('characters/list', {
                characters: response.data.data.results,
                isFav
            })
        })
        .catch(err => next(err))

})

router.post('/', (req, res, next) => {

    let { charName } = req.body

    if (charName.includes('%20')) {
        charName.split('%20').join(' ')
    }


    User
        .findById(req.session.currentUser._id)
        .then(user => {
            if (!user.favCharacters.includes(charName)) {
                User.findByIdAndUpdate(req.session.currentUser._id, { $push: { favCharacters: charName } })
                    .then(() => res.redirect('/personajes'))
                    .catch(err => next(err))
            } else {
                User.findByIdAndUpdate(req.session.currentUser._id, { $pull: { favCharacters: charName } })
                    .then(() => res.redirect('/personajes'))
                    .catch(err => next(err))

            }
        })
        .catch(err => next(err))

})

module.exports = router