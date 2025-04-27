import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../../Components.css'; // Import custom CSS file


function DollsCarousel() {
  return (
    <Carousel className="custom-carousel primary-font" >
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/YellowBee.PNG"
          alt="First slide"
          width={'500px'}
          height={'500px'}
        />
        <Carousel.Caption className="custom-caption">
          <h3>מגוון רחב של בובות בעבודת יד</h3>
          <p>שלל עיצובים,שלל גדלים ושלל מחירים</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="./images/NoiserClown.PNG"
          alt="Second slide"
          width={'500px'}
          height={'500px'}
        />

        <Carousel.Caption className="custom-caption">
          <h3>רעשן לתינוק</h3>
          <p>!מושלם כמתנה לתינוק/ת</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/Holidays.PNG"
          alt="Third slide"
          width={'500px'}
          height={'500px'}
        />

        <Carousel.Caption className="custom-caption">
          <h3>חיות מחמד</h3>
          <p>
            החיות שלנו יהפכו מהר לחברו הטוב של ילדיכם
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/RubbitForWindow.PNG"
          alt="Third slide"
          width={'500px'}
          height={'500px'}
        />

        <Carousel.Caption className="custom-caption">
          <h3>?מרגישים שחסר לכם פריט שיהפוך את העיצוב בחדר לייחודי </h3>
          <p><span>          ! מצאנו לכם את הפתרון המושלם
          </span>
            <span>           ! בובה שאפשר לתלות על הווילון בחדרכם
            </span>
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default DollsCarousel;
