import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import './CustomImageList.css'; // Import custom CSS file


export default function TitlebarBelowImageList() {
  return (
    <ImageList className="custom-image-list" sx={{ width: '100%', height: 450 }}>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            src={`${item.img}?w=248&fit=crop&auto=format`}
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            // title={item.title}
            // subtitle={<span>by: {item.author}</span>}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: '/images/Customer1.PNG',
    title: 'monkey',
    author: '@bkristastucchio',
  },
  {
    img: '/images/Costumer2.PNG',
    title: 'Rubbit',
    author: '@rollelflex_graphy726',
  },
  {
    img: '/images/Cutomer3.PNG',
    title: 'Rubbit',
    author: '@rollelflex_graphy726',
  }
];