const express = require('express');
const router = express.Router();

const Review = require('../models/Review');

router.get('/', async (req, res)=>{
    try{
        const reviews = await Review.find({}).populate('creator');
        res.json({
            status: 200,
            data: reviews
        });
    }catch(err){
        res.json({
            status: 500,
            data: err
        })
    }
})

router.get('/:id', async (req, res)=>{
    const review = await Review.findById(req.params.id)
    res.json(review);
})

router.post('/', async (req, res)=>{
    try{
        const review = {
            ...req.body,
            creator: req.session.userId
        }
        const newReview = await Review.create(review);
        const response = await Review.findById(newReview._id).populate('creator');
        res.json({
            data: response,
            status: 200})
    }catch(err){
        res.json({
            data: err,
            status: 500
        })
    }
})

router.delete('/:id', async (req, res)=>{
    try{
        const deleted = await Review.findByIdAndDelete(req.params.id);
        res.json({
            status: 200
        })
    }catch(err){
        res.json({
            status: 500, 
            data: err
        })
    }
})

router.put('/:id', async (req, res)=>{
    try{
        const updatedReview = await Review.findByIdAndUpdate(req.body._id, req.body, {new: true}).populate('creator');
        res.json({
            status: 200,
            data: updatedReview
        })
    }catch(err){
        res.json({
            status: 500,
            data: err
        })
    }
    

})


module.exports = router;