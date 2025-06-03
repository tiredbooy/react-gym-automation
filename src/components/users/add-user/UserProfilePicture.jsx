import { useState, useRef, useEffect } from "react";
import { Camera, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

function UserProfilePicture({ personImage, onPersonImageChange }) {
  const [previewUrl, setPreviewUrl] = useState(
    personImage ? `data:image/jpeg;base64,${personImage}` : null
  );
  const [dragActive, setDragActive] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  useEffect(() => {
    if (personImage && !personImage.startsWith("data:")) {
      setPreviewUrl(`data:image/jpeg;base64,${personImage}`);
    }
  }, [personImage]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setShowWebcam(true);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert(`دسترسی به وب‌کم ممکن نشد: ${err.message}`);
      setShowWebcam(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowWebcam(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      setPreviewUrl(dataUrl);
      onPersonImageChange(dataUrl.split(",")[1]);
      stopWebcam();
    }
  };

  const handleWebcamClick = (e) => {
    e.preventDefault();
    startWebcam();
  };

  const handleFileButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setPreviewUrl(dataUrl);
        onPersonImageChange(dataUrl.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setPreviewUrl(dataUrl);
        onPersonImageChange(dataUrl.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (showWebcam && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => console.error("Play error:", err));
    }
  }, [showWebcam]);

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-gradient-to-b from-${secondary} shadow-xl rounded-xl p-6 flex flex-col items-center justify-center h-1/2 ${
        dragActive ? `ring-2 ring-${primary}` : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`mb-4 relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-${background} border-2 border-${primary}`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="پیش‌نمایش پروفایل"
            className="object-cover w-full h-full"
          />
        ) : (
          <Camera size={48} className={`text-${primary} opacity-70`} />
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleWebcamClick}
          className={`cursor-pointer bg-${primary} hover:bg-opacity-90 text-${background} font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2`}
        >
          <Camera size={24} />
        </button>

        <button
          onClick={handleFileButtonClick}
          className={`cursor-pointer bg-${primary} hover:bg-opacity-90 text-${background} font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2`}
        >
          <Upload size={24} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          id="profile-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <p className={`mt-3 text-center text-xs text-${accent} opacity-70`}>
        فرمت‌های قابل قبول: JPG، PNG، Avif، Webp
      </p>

      {showWebcam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center p-6 bg-beige rounded-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="320"
              height="240"
              className="mb-4 bg-black rounded w-80 h-60"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-4">
              <button
                onClick={captureImage}
                className="px-4 py-2 font-medium rounded-lg bg-darkBlue hover:bg-opacity-90 text-offWhite"
              >
                ثبت تصویر
              </button>
              <button
                onClick={stopWebcam}
                className="px-4 py-2 font-medium bg-gray-500 rounded-lg hover:bg-opacity-90 text-offWhite"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default UserProfilePicture;
