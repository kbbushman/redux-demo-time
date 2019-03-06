import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class ReviewDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            show: false,
            updatedReview: {
                title: this.props.review.title,
                description: this.props.review.description,
                rating: this.props.review.rating,
                _id: this.props.review._id
            }
        }
    }
    handleClose = () => {
        this.setState({ show: false });
      }
    
    handleShow = () => {
        this.setState({ show: true });
    }
    handleEditChange = (e) => {
        this.setState({
            updatedReview: {
                ...this.state.updatedReview,
                [e.currentTarget.name] : e.currentTarget.value
            }
        })
    }
    handleEditSubmit = (e) => {
        e.preventDefault();
        this.handleClose();
        this.props.updateReview(this.state.updatedReview);
    }
    render(){
    return(
        <div key={this.props.review._id}>
            <h5>{this.props.review.title} {this.props.review.rating}/5</h5>
            <p>uploaded by: {this.props.review.creator.username}</p>
            <p>{this.props.review.description}</p>
            <button onClick={this.props.deleteReview.bind(null, this.props.review._id)}>DELETE</button>
        <Button bsstyle="primary" onClick={this.handleShow}>
            edit this review
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.review.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleEditSubmit}>
                Title: <input type="text" name="title" placeholder={this.props.review.title} onChange={this.handleEditChange}/><br/>
                Description: <input type="text" name="description" placeholder={this.props.review.description} onChange={this.handleEditChange}/><br/>
                Rating: <input type="number" name="rating" min="1" max="5" placeholder={this.props.review.rating} onChange={this.handleEditChange}/><br/>
                <input type="submit"/>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
        </div>
    )}
}


