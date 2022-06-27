import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { ImageType } from "../models/images";
import styles from "../styles/Dashboard.module.css";

const Dashboard: NextPage<{ images: ImageType[] }> = (props) => {
  const [images, setImages] = useState(props.images);

  const getImages = async () => {
    await fetch(window.location.origin + "/api/images")
      .then((res) => res.json())
      .then((res) => setImages(res));
  };

  const handleCheckboxClick = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    e.preventDefault();

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: e.target.checked }),
    };

    fetch(`${window.location.origin}/api/images/${id}`, requestOptions).then(
      (res) => {
        if (res.ok) {
          getImages();
        }
      }
    );
  };

  return (
    <div className={styles.container}>
      {images.map((image) => {
        return (
          <div key={image.id} className={styles.imageitem}>
            <Image
              src={`/${image.name}`}
              width={300}
              height={300}
              alt={image.name}
              quality={50}
            />
            <div className={styles.checkboxcontainer}>
              <input
                className={styles.checkbox}
                onChange={(e) => handleCheckboxClick(e, image.id)}
                type="checkbox"
                checked={image.enabled}
              ></input>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export async function getServerSideProps() {
  const images: ImageType[] = await fetch("http://localhost:3000/api/images")
    .then((res) => res.json())
    .then((res) => res);

  return {
    props: { images },
  };
}

export default Dashboard;
