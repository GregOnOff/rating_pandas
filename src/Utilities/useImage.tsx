import { useState } from "react";

export default function useImage(event) {
  const [imageToUpload, setImageToUpload] = useState(null);

  function handleImageInput(event) {
    setImageToUpload(event.target.files[0]);
  }

  return [imageToUpload, handleImageInput];
}
