import React from "react";
import { Card } from "react-bootstrap";

const styles = {
    card: {
       
        backgroundColor: "pink"
    }
}

const Cards = (props) => {
    const cardStyles = { ...styles.card, ...props.style };
    return(
        <Card style={cardStyles}>
            <Card.Body>

            {props.children}
            </Card.Body>
        </Card>
    )
}

export default Cards;