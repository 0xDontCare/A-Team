import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import "./OglasDetalj.css";
import "react-slideshow-image/dist/styles.css";
import Carousel from "react-bootstrap/Carousel";

function OglasDetalj({ cardData }) {
  const { id } = useParams();
  const card = cardData.find((card) => card.id === parseInt(id, 10));

  if (!card) {
    return <div>Card not found</div>;
  }

  return (
    <div className="slide-container">
      <Card>
        <Card.Title>{card.title}</Card.Title>
        <Carousel touch={true}>
          <Carousel.Item interval={null}>
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={null}>
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <img src="/api/20231114-124455786.jfif" alt="" />
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={null}>
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Card.Body>
          <Card.Text>{card.content}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default OglasDetalj;
