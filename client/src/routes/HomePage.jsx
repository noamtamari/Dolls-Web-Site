import React, { useEffect, useState } from 'react';
import ResponsiveAppBar from '../components/homepage/ResponsiveAppBar.jsx';
import Image from 'mui-image';
import TitlebarBelowImageList from '../components/homepage/TitlebarBelowImageList.jsx';
import MultiActionAreaCard from '../components/homepage/MultiActionAreaCard.jsx';
import DollsCarousel from '../components/homepage/DollsCarousel.jsx';
import Features from '../components/Features.jsx';
import Categories from '../components/homepage/Categories.jsx';
import Footer from '../components/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import WhatsAppButton from '../components/whatsAppButton/WhatsAppButton.jsx';
import '../App.css';

function HomePage() {
    // const [backendData, setBackendData] = useState([{}]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // useEffect(() => {
    //     fetch('/api')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             setBackendData(data);
    //         });
    // }, []);

    const cardCount = 8;

    return (
        <div className="primary-font">
            {/* {typeof backendData.users === 'undefined' ? (
                <p>Loading...</p>
            ) : (
                backendData.users.map((user, index) => <p key={index}>{user}</p>)
            )} */}
            <ResponsiveAppBar />
            <Image alt="home" src="/images/HomeDolls.jpg" height={'80%'} />
            <hr></hr>
            {/* {isMobile ? (
                <div>
                    {[...Array(2)].map((_, row) => (
                        <div
                            key={row}
                            style={{
                                display: 'flex',
                                margin: '0 2%',
                                gap: '1%',
                                width: '100%',
                            }}
                        >
                            {[...Array(3)].map((_, col) => (
                                <MultiActionAreaCard key={col} src="/images/monkeys.JPG" />
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {[...Array(2)].map((_, row) => (
                        <div
                            key={row}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                margin: '1% 2%',
                                gap: '1%',
                            }}
                        >
                            {Array.from({ length: cardCount / 2 }).map((_, index) => (
                                <MultiActionAreaCard key={index} src="/images/monkeys.JPG" />
                            ))}
                        </div>
                    ))}
                </div>
            )} */}

            <Categories />

            <hr></hr>
            <DollsCarousel />
            <hr></hr>
            <div style={{
                display: 'flex',
            }} >
                <TitlebarBelowImageList />

                <h1 style={{
                    width: '100%',
                    margin: 'auto',
                    textAlign: 'center',
                    color: '#7e57c2'
                }}>לקוחות ממליצים</h1>
            </div>


            <Features />



            <Footer />
            <WhatsAppButton />
        </div>
    );
}


export default HomePage