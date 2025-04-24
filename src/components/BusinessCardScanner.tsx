import { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const BusinessCardScanner = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const captureAndRecognize = async () => {
    const image = webcamRef.current?.getScreenshot();
    if (image) {
      setImageSrc(image);
      setLoading(true);
      const result = await Tesseract.recognize(image, "jpn", {
        logger: m => console.log(m),
      });
      setOcrText(result.data.text);
      setLoading(false);
    }
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={350}
      />
      <button onClick={captureAndRecognize}>名刺を撮影して読み取る</button>

      {loading && <p>OCR処理中...</p>}

      {imageSrc && (
        <div>
          <h4>撮影結果：</h4>
          <img src={imageSrc} alt="captured" width="300" />
        </div>
      )}

      {ocrText && (
        <div>
          <h4>OCR結果：</h4>
          <pre>{ocrText}</pre>
        </div>
      )}
    </div>
  );
};

export default BusinessCardScanner;

