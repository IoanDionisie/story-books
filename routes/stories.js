const express = require('express');
const router = express.Router();
const {ensureAuth } = require('../middleware/auth');

const Story = require('../models/Story')


//@desc Show add page
//@route  GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
});

//@desc Process add form
//@route  POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body)
    res.redirect('/dashboard');
  } catch(err) {
      console.log(err);
      res.render('error/500');
  }
});

//@desc Show All Stories
//@route  GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find( {status: 'public'})
    .populate('user')
    .sort( { createdAt: 'desc'} )
    .lean();
    res.render('stories/index', {
      stories,
    })
  } catch(err) {
    console.log(err);
    res.render('error/500');
  }
});


//@desc Delete story
//@route  DELETE /stories/:id
router.post('/:id', ensureAuth, async (req, res) => {
  console.log("trying remove")
  try {
    await Story.remove({ _id: req.params.id })
    res.redirect('/dashboard');
  } catch(err) {
    console.log(err);
    return res.render('error/500');
  }
});

//@desc Shows a story
//@route  GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.find( {_id:  req.params.id}).lean();
    res.render('stories/story', {
      story,
    })
    console.log(story)
  } catch(err) {
    console.log(err);
    res.render('error/500');
  }
});




module.exports = router;