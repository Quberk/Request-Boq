import React from 'react';
import '../style/videoBackground.css'

const VideoBackground = () => {
  return (
    <div className="video-background">
      <video autoPlay loop muted>
        <source src="/1074099113-preview.mp4" type="video/mp4" />
      </video>
      <div className="content">
        
      </div>
    </div>
  );
};

export default VideoBackground;
