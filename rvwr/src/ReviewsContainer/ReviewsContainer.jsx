import React, {Component} from 'react';
import ReviewsList from './ReviewsList/ReviewsList';
import NewReview from './NewReview/NewReview';

export default class ReviewsContainer extends Component {
    constructor(){
        super();
        this.state = {
            reviews: [],
            newReview: {
                "title": "",
                "description": "",
                "rating": null
            }
        }
    }
    componentDidMount(){
        this.getReviews().then((response)=>{
            if(response.status === 200){
                this.setState({
                    reviews: response.data
                })
            }
        })
    }
    createReview = async (e) => {
        e.preventDefault();
        const newReview = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/reviews`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(this.state.newReview),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const newReviewParsed = await newReview.json();
        if(newReviewParsed.status === 200){
            document.getElementById("new-review-form").reset();
            this.setState({
                reviews: [...this.state.reviews, newReviewParsed.data]
            })
        }
    }
    handleNewChange = (e) => {
        this.setState({
            newReview: {
                ...this.state.newReview,
                [e.currentTarget.name]: e.currentTarget.value
            }
        })
    }
    getReviews = async () => {
        const reviews = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/reviews`, {
            credentials: 'include'
        });
        const reviewsParsed = await reviews.json();
        return reviewsParsed;
    }
    deleteReview = async(id, e) => {
        const deleteSuccess = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/reviews/` + id, {
            method: "DELETE",
            credentials: 'include'
        })
        const deletedParsed = await deleteSuccess.json();
        if(deletedParsed.status === 200){
            this.setState({
                reviews: this.state.reviews.filter((review)=>{
                    return review._id !== id
                })
            })
        }
    }
    updateReview = async (reviewData) => {
        const updatedReview = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/reviews/` + reviewData._id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(reviewData)
        })
        const response = await updatedReview.json();
        this.setState({
            reviews: this.state.reviews.map((review)=>{
                return review._id === response.data._id ? response.data : review
            })
        })
    }
    render(){
        return(
            <div>
                <NewReview createReview={this.createReview} handleNewChange={this.handleNewChange}/>
                <ReviewsList updateReview={this.updateReview} deleteReview = {this.deleteReview} reviews={this.state.reviews} />
            </div>
        )
    }
}