import React from 'react';

const NewReview = (props) => {
    return(
        <form id="new-review-form" onSubmit={props.createReview}>
            title: <input type="text" name="title" onChange={props.handleNewChange}/>
            description: <input type="text" name="description" onChange={props.handleNewChange}/>
            rating: <input type="number" min="1" max="5" name="rating" onChange={props.handleNewChange}/>
            <input type="submit" value="generate review"/>
        </form>
    )
}

export default NewReview;