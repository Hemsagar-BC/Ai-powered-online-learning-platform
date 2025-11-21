import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react'

export const VideoPlayer = ({ 
  videoId, 
  title = 'Video',
  autoplay = false,
  onEnded,
  onTimeUpdate,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const playerRef = useRef(null)

  const handlePlayPause = () => setIsPlaying(!isPlaying)
  const handleMute = () => setIsMuted(!isMuted)
  const handleFullscreen = () => {
    if (playerRef.current) {
      playerRef.current.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  return (
    <div 
      ref={playerRef}
      className={`relative w-full bg-black rounded-lg overflow-hidden group ${className}`}
    >
      {/* YouTube Embed */}
      <div className="relative w-full pb-[56.25%]">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={handleMute}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <span className="text-sm text-gray-300">{title}</span>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Fullscreen"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

VideoPlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
  title: PropTypes.string,
  autoplay: PropTypes.bool,
  onEnded: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  className: PropTypes.string
}

export default VideoPlayer
