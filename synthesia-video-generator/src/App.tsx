import React, { useState } from "react";
import Form from "./components/Form";
import {
  createVideo,
  getVideoStatus,
  downloadVideo,
} from "./api/generateVideo";
import "./App.css";

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: {
    companyInfo: string;
    productInfo: string;
    targetGroupProfile: string;
  }) => {
    setIsLoading(true);
    setError(null);
    const scriptText = `Company Info: ${data.companyInfo}. Product Info: ${data.productInfo}. Target Group: ${data.targetGroupProfile}.`;
    const title = "Personalized Video";

    try {
      const videoId = await createVideo(scriptText, title);

      let video;
      do {
        video = await getVideoStatus(videoId);
        if (video.status === "complete") {
          setVideoUrl(video.download);
          setIsLoading(false);
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait for 30 seconds before checking status again
      } while (video.status !== "complete");
    } catch (error: any) {
      console.error("Error generating video:", error);
      setError(
        error.message ||
          "An unexpected error occurred while generating the video."
      );
      setIsLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div>
      <h1>Generate Personalized Outbound Video</h1>
      <Form onSubmit={handleFormSubmit} isLoading={isLoading} error={error} />
      {videoUrl && (
        <div className="generated-video-container">
          <video src={videoUrl} controls />
          <button onClick={() => downloadVideo(videoUrl)}>
            Download Video
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
