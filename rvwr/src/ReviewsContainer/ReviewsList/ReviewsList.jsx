import React from 'react';
import ReviewDetail from './ReviewDetail/ReviewDetail';

const ReviewsList = (props) => {
    const reviews = props.reviews.map((review)=>{
       return( <ReviewDetail updateReview={props.updateReview} key={review._id} review={review} deleteReview={props.deleteReview}/>)
    })
    return(
        <div>
        {reviews}
        </div>
    )
}

export default ReviewsList;