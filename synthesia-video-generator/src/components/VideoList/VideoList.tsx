import React, { useEffect, useState } from "react";
import { fetchVideos } from "../../api/generateVideo";
import "./VideoList.css";

interface VideoListProps {
  videoCreated: string;
}

const VideoList: React.FC<VideoListProps> = ({ videoCreated }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // 4 items per row, 2 rows per page

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchVideos();
        setVideos(data.videos);
        setIsLoading(false);
      } catch (error: any) {
        setError(
          error.message || "An unexpected error occurred while fetching videos."
        );
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [videoCreated]); // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    videos && videos?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(videos?.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  if (!videos) return null;

  if (isLoading && !videos) {
    return <p>Loading videos...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <>
      {videos?.length > 0 && (
        <div className="video-list">
          <h2>Generated Personalized Outbound Video</h2>
          <div className="video-grid">
            {currentItems &&
              currentItems.map((video) => (
                <div key={video?.id} className="video-grid-item">
                  <h3 className="video-title">{video?.title}</h3>
                  <video src={video?.download} controls />
                </div>
              ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <p>
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VideoList;
