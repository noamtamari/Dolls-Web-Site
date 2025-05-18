import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

import '../../App.css';

export default function MultiActionAreaCard(props) {
  // Define a fixed aspect ratio (width:height)
  const aspectRatio = '8:9'; // You can adjust this based on your preference

  // Split the aspect ratio into width and height
  const [width, height] = aspectRatio.split(':');

  return (
    <Card style={{ width: '70%', marginBottom: '5%' }}>
      <CardActionArea>
        <a href={`/חנות/${props.name}`} style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '100%',
              paddingTop: `${(parseInt(height) / parseInt(width)) * 100}%`, // Calculate aspect ratio
              position: 'relative',
            }}
          >
            <CardMedia
              component="img"
              image={props.src}
              alt="green iguana"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </a>
      </CardActionArea>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          id="primary-font"
          className="button-category"
          href={`/חנות/${props.name}`}
          size="large"
          style={{ color: 'white', margin: '2%' }}
        >
          {props.name}
        </Button>
      </div>
    </Card>
  );
}
