const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/Story')

const paginate = require('express-paginate');

//@desc Login/Landing Page
//@route  GET / 
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
});

//@desc Dashboard
//@route  GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  
    try {

        const [ results, itemCount ] = await Promise.all([
            Story.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
            Story.count({})
          ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);

        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            results,
            pageCount,
            itemCount,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
        });
    } catch(err) {
        console.log(err);
        res.render('error/500');
    }
});


module.exports = router;