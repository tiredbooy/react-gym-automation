import { useState, useRef, useEffect } from "react";
import { Camera, Upload } from "lucide-react";
import { motion } from "framer-motion";

function UserProfilePicture() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start webcam with debugging
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      console.log("Stream:", stream, "Video tracks:", stream.getVideoTracks());
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .catch((err) => console.error("Play error:", err));
        console.log("Video srcObject set:", videoRef.current.srcObject);
      } else {
        console.error("videoRef.current is null");
      }
      setShowWebcam(true);
    } catch (err) {
      console.error("Error accessing webcam:", err.name, err.message);
      alert(`Could not access webcam: ${err.message}`);
      setShowWebcam(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowWebcam(false);
  };

  // Capture image from webcam
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setPreviewUrl(dataUrl);
      stopWebcam();
    } else {
      console.error("Cannot capture: videoRef or canvasRef is null");
    }
  };

  // Handle webcam button click
  const handleWebcamClick = (e) => {
    e.preventDefault();
    startWebcam();
  };

  // Handle file input button click
  const handleFileButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  // Handle file change for direct uploads
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
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
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Ensure video stream is assigned after modal mounts
  useEffect(() => {
    if (showWebcam && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => console.error("Play error:", err));
    }
  }, [showWebcam]);

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-beige rounded-xl p-6 flex flex-col items-center justify-center h-1/2 ${
        dragActive ? "ring-2 ring-darkBlue" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-4 relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-offWhite border-2 border-darkBlue">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <Camera size={48} className="text-darkBlue opacity-70" />
        )}
      </div>

      <div className="flex gap-3">
        {/* Webcam button */}
        <button
          onClick={handleWebcamClick}
          className="cursor-pointer bg-darkBlue hover:bg-opacity-90 text-offWhite font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <Camera size={24} />
          {/* <span className="">دوربین</span> */}
        </button>

        {/* File upload button */}
        <button
          onClick={handleFileButtonClick}
          className="cursor-pointer bg-darkBlue hover:bg-opacity-90 text-offWhite font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
            <Upload size={24} />
          {/* <span className="">آپلود فایل</span> */}
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          id="profile-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <p className="mt-3 text-center text-xs text-darkBlue opacity-70">
        فرمت‌های قابل قبول: JPG، PNG، Avif , Webp
      </p>

      {/* Webcam Modal */}
      {showWebcam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-beige rounded-xl p-6 flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="320"
              height="240"
              className="w-80 h-60 bg-black rounded mb-4"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-4">
              <button
                onClick={captureImage}
                className="bg-darkBlue hover:bg-opacity-90 text-offWhite font-medium py-2 px-4 rounded-lg"
              >
                Capture
              </button>
              <button
                onClick={stopWebcam}
                className="bg-gray-500 hover:bg-opacity-90 text-offWhite font-medium py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default UserProfilePicture;
