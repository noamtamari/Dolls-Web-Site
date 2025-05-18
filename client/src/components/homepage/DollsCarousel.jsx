import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../../Components.css'; // Import custom CSS file

function DollsCarousel() {
  return (
    <Carousel className="custom-carousel primary-font">
      <Carousel.Item>
        <div className="carousel-content">
          <img
            className="carousel-image"
            src="/images/YellowBee.PNG"
            alt="First slide"
          />
          <div className="custom-caption">
            <h3>מגוון רחב של בובות בעבודת יד</h3>
            <p>שלל עיצובים, שלל גדלים ושלל מחירים</p>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-content">
          <img
            className="carousel-image"
            src="./images/NoiserClown.PNG"
            alt="Second slide"
          />
          <div className="custom-caption">
            <h3>רעשן לתינוק</h3>
            <p>!מושלם כמתנה לתינוק/ת</p>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-content">
          <img
            className="carousel-image"
            src="/images/Holidays.PNG"
            alt="Third slide"
          />
          <div className="custom-caption">
            <h3>חיות מחמד</h3>
            <p>החיות שלנו יהפכו מהר לחברו הטוב של ילדיכם</p>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-content">
          <img
            className="carousel-image"
            src="/images/RubbitForWindow.PNG"
            alt="Fourth slide"
          />
          <div className="custom-caption">
            <h3>?מרגישים שחסר לכם פריט שיהפוך את העיצוב בחדר לייחודי</h3>
            <p>
              <span>!מצאנו לכם את הפתרון המושלם</span>
              <span>!בובה שאפשר לתלות על הווילון בחדרכם</span>
            </p>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default DollsCarousel;
