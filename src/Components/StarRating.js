import React from "react";
import PropTypes from "prop-types";
import "./StarRating.css";

const StarRating = ({ rating, onChange }) => {
  const stars = [1, 2, 3, 4, 5]; 

  const handleStarClick = (selectedRating) => {
    onChange(selectedRating);
  };

  return (
    <div className="star-rating">
      {stars.map((star, index) => (
        <span
          key={star}
          className={`star ${index < rating ? "filled" : ""}`}
          onClick={() => handleStarClick(star)}
        >
          &#9733; {/* Unicode character for a star */}
        </span>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StarRating;


