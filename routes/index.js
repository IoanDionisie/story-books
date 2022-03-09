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
        let hidePreviousButton = true, hideNextButton = true;
        let pages = paginate.getArrayPages(req)(100, pageCount, req.query.page);

        pages[req.query.page-1].isSelected = true; 

        if (req.query.page == pageCount) {
            hideNextButton = false;
        } else if (req.query.page == 1) {
            hidePreviousButton = false;
        } 
        
        let prevPage = req.query.page - 1;
        let nextPage = req.query.page + 1;


        res.render('dashboard', {
            name: req.user.firstName,
            results,
            pageCount,
            itemCount,
            hidePreviousButton, 
            hideNextButton,
            prevPage, 
            nextPage,
            pages: pages
        });
    } catch(err) {
        console.log(err);
        res.render('error/500');
    }
});


module.exports = router;