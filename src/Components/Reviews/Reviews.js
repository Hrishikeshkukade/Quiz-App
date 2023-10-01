import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { db } from "../../firebase";
import StarRating from "../StarRating/StarRating";
import { addDoc, getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";
import "./Reviews.css";

import debounce from "lodash/debounce";
import { useTheme } from "../../context/ThemeContext";



const Reviews = () => {
  const [showModal, setShowModal] = useState(false);
  const [showThanksModal, setShowThanksModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setEmailValid] = useState(true);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseThanksModal = () => setShowThanksModal(false);

  const theme = useTheme();

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const debouncedEmailChangeHandler = debounce((newEmail) => {
    setEmail(newEmail);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    setEmailValid(isValid);
  }, 1000); // Adjust the delay time as needed (e.g., 300 milliseconds)

  const emailChangeHandler = (e) => {
    const newEmail = e.target.value;
    debouncedEmailChangeHandler(newEmail);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true);
    // Save the review to Firestore
    // db.collection("reviews").add({
    //   name: name,
    //   rating: rating,
    //   text: reviewText,
    //   // Add user ID or any other relevant data
    // });

    const docRef = await addDoc(collection(db, "reviews"), {
      name: name,
      email: email,
      rating: rating,
      text: reviewText,
    });
   
    // Close the modal and clear the input fields
    setIsButtonLoading(false);
    setShowModal(false);
    setRating(1);
    setEmail("");
    setReviewText("");
    setName("");
    setShowThanksModal(true);
  };

  useEffect(() => {
    // Fetch existing reviews from Firestore

    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "reviews");
        const snapshot = await getDocs(reviewsRef);
        const reviewsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        reviewsData.sort((a, b) => b.rating - a.rating);
        setReviews(reviewsData);
        setIsLoading(false);
      } catch (error) {
        if (error) {
          return (<p>Something went wrong</p>);
        }
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className={`review-container ${theme === "dark" ? "darkTheme" : ""}`}>
      <div className="reviews">
        <h2>Reviews</h2>
        <Button variant="success" onClick={handleShowModal}>
          Give Review
        </Button>
      </div>
      {isLoading && <Spinner />}

      <ul className="review-list">
        {reviews.map((review) => (
          <li key={review.id} className="review-item">
            <div className="review-rating">Name: {review.name}</div>
            <div className="review-rating">Rating: {review.rating} stars</div>
            <div className="review-text">
              Review: <span className="review-rating">{review.name}</span> says{" "}
              {review.text}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for giving a review */}
      <Modal    show={showModal} onHide={handleCloseModal}>
        
         <div className="darkModal">
         
        
        <Modal.Header closeButton>
          <Modal.Title>Give Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitReview}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={handleNameChange}
                required
                className="darkInput"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                className="darkInput"
                onChange={emailChangeHandler}
                required

              />
               {!isEmailValid && email && (
          <Form.Text className="text-danger">Invalid email</Form.Text>
        )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              {/* Implement a star rating component */}
              {/* Example: */}
              <StarRating rating={rating} onChange={handleRatingChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reviewText}
                onChange={handleReviewTextChange}
                required
                className="darkInput"
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button disabled={isButtonLoading} type="submit" variant="primary">
              {isButtonLoading ? <Spinner /> : "Submit Review"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
       </div>
      </Modal>
      <Modal show={showThanksModal} onHide={handleCloseThanksModal}>
      <div className="darkModal">
        <Modal.Header closeButton>
          <Modal.Title>Thanks for Your Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your review has been submitted successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseThanksModal}>
            Close
          </Button>
        </Modal.Footer>
        </div> 
      </Modal>
    </div>
  );
};

export default Reviews;
