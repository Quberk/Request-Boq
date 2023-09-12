import React from 'react';
import '../style/videoBackground.css'

const VideoBackground = () => {
  return (
    <div className="video-background">
      <video autoPlay loop muted>
        <source src="/PT Mitra Karsa Utama.mp4" type="video/mp4" />
      </video>
      <div className="content">
        
      </div>
    </div>
  );
};

export default VideoBackground;
