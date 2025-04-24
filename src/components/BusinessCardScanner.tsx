import { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const BusinessCardScanner = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({ name: "", company: "", phone: "", email: "" });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const captureAndRecognize = async () => {
    const image = webcamRef.current?.getScreenshot();
    if (image) {
      setImageSrc(image);
      setLoading(true);
      const result = await Tesseract.recognize(image, "jpn", { logger: m => console.log(m) });
      setOcrText(result.data.text);
      setInfo(extractInfo(result.data.text));  // ← ここで自動抽出
      setLoading(false);
    }
  };

  const extractInfo = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    
    const name = lines.find(line => line.length <= 10 && !line.match(/[0-9@]/));
    const company = lines.find(line => line.includes("株式会社") || line.includes("有限会社"));
    const phone = text.match(/(0\d{1,4}-\d{1,4}-\d{3,4})/)?.[1] ?? "";
    const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] ?? "";
  
    return {
      name: name ?? "",
      company: company ?? "",
      phone,
      email,
    };
  };

  const videoConstraints = isMobile
  ? { facingMode: { exact: "environment" } } // スマホは背面カメラ
  : { facingMode: "user" }; // PCは自撮りカメラ
  

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={350}
        videoConstraints={videoConstraints}
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
      {info.name && (
       <div style={{ marginTop: "1em" }}>
         <h4>抽出された情報（編集可能）：</h4>
         <label>
           名前：
           <input value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} />
         </label>
         <br />
         <label>
           会社名：
           <input value={info.company} onChange={e => setInfo({ ...info, company: e.target.value })} />
         </label>
         <br />
         <label>
           電話番号：
           <input value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} />
         </label>
         <br />
         <label>
           メール：
           <input value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} />
         </label>
       </div>
     )}
    </div>
  );
};

export default BusinessCardScanner;

