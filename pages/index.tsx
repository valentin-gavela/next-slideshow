import type { NextPage } from "next";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageType } from "../models/images";
import styles from "../styles/Home.module.css";

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function generateRandomIntegerInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
  timePerPicture: 120 * 1000, //Seconds
  scaleAmount: 2,
  minScroll: -300,
  maxScroll: 300,
};

const Home: NextPage<{ images: ImageType[] }> = (props) => {
  const { images } = props;
  const pointer = useRef(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const imgsList = useCallback(() => {
    return images
      .slice(1)
      .map((_, i) =>
        (i / 2) % 0 ? [images[i], images[i + 1]] : [images[i + 1], images[i]]
      );
  }, [images])();

  function nextImages() {
    if (pointer.current === imgsList.length - 1) {
      pointer.current = 0;
    } else {
      pointer.current++;
    }

    return imgsList[pointer.current];
  }

  function resetPicture() {
    setZoomIn(false);
    setTopLeft({
      left: 0,
      top: 0,
    });
  }

  function applyZoomEffect() {
    setZoomIn(true);
    setTopLeft({
      left: generateRandomIntegerInRange(config.minScroll, config.maxScroll),
      top: generateRandomIntegerInRange(config.minScroll, config.maxScroll),
    });
  }

  function passPicturePair() {
    // Pass First picture
    resetPicture();
    applyZoomEffect();
    setTransparency(true);

    // Passing Second picture
    setTimeout(() => {
      resetPicture();
      applyZoomEffect();
      setTransparency(false);
      setImgsToShow(nextImages());
    }, config.timePerPicture);
  }

  function next() {
    passPicturePair();
  }

  useEffect(() => {
    setInterval(() => {
      next();
    }, config.timePerPicture * 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [imgsToShow, setImgsToShow] = useState(imgsList[0]);
  const [transparency, setTransparency] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [topLeft, setTopLeft] = useState({ top: 0, left: 0 });

  return (
    <div>
      {/* <button onClick={next}>next</button>
      <button onClick={() => setTransparency(true)}>enable trans</button>
      <button onClick={() => setTransparency(false)}>disable trans</button>
      <button onClick={() => setZoomIn(true)}>enable zoom</button>
      <button onClick={() => setZoomIn(false)}>disable zoom</button> */}
      <div className={styles.container}>
        {imgsToShow.map((img, i) => (
          <div
            style={{
              top: i === 1 ? `${topLeft.top}px` : "0px",
              left: i === 1 ? `${topLeft.left}px` : "0px",
              transform:
                zoomIn && i === 1 ? `scale(${config.scaleAmount})` : "0px",
            }}
            ref={imgRef}
            key={img.id}
            className={`
          ${styles.imgcontainer} 
          ${styles.image} 
          ${transparency && i === 1 ? styles.transparency : ""}
          `}
          >
            <Image
              src={"/" + img.name}
              alt={img.name}
              layout={"fill"}
              objectFit={"contain"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const images: ImageType[] = await fetch("http://localhost:3000/api/images")
    .then((res) => res.json())
    .then((res: ImageType[]) => {
      const filtered = res.filter((image) => image.enabled);
      return shuffle(filtered);
    });

  return {
    props: { images },
  };
}

export default Home;
