import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Subtitles as Captions, RotateCcw, FastForward, SkipBack, Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

const VideoLessonPlayer = ({ videoUrl, poster, title, videoId, userId }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('auto');
    const controlsTimeoutRef = useRef(null);

    // Initialize Video (HLS or Native)
    useEffect(() => {
        if (!videoUrl) return;

        const video = videoRef.current;
        let hls;

        if (Hls.isSupported() && videoUrl.endsWith('.m3u8')) {
            hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Ready
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
        } else {
            video.src = videoUrl;
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [videoUrl]);

    // Handle Metadata Loaded
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => setDuration(video.duration);
        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            // Log analytics periodically? Or use `onPause`/`onEnded`
        };
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Analytics Logging (Simple)
    useEffect(() => {
        if (!isPlaying || !videoId || !userId) return;

        // Log watch session every 30 seconds
        const interval = setInterval(async () => {
            await supabase.rpc('log_video_watch', { 
                p_video_id: videoId, 
                p_user_id: userId,
                p_seconds: 30 
            }).catch(console.error); // Silently fail if rpc doesn't exist yet, we'll assume it will
        }, 30000);

        return () => clearInterval(interval);
    }, [isPlaying, videoId, userId]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleVolumeChange = (newVolume) => {
        const val = newVolume[0];
        setVolume(val);
        videoRef.current.volume = val;
        setIsMuted(val === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            videoRef.current.volume = volume || 1;
            setIsMuted(false);
        } else {
            videoRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const handleSeek = (value) => {
        const newTime = value[0];
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const changePlaybackRate = (rate) => {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div 
            ref={containerRef}
            className="relative group bg-black rounded-xl overflow-hidden shadow-2xl aspect-video"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                poster={poster}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
            />

            {/* Overlay Gradient for Controls */}
            <div 
                className={cn(
                    "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4",
                    showControls ? "opacity-100" : "opacity-0"
                )}
            >
                {/* Progress Bar */}
                <div className="mb-4 group/slider">
                    <Slider 
                        value={[currentTime]} 
                        max={duration} 
                        step={1}
                        onValueChange={handleSeek}
                        className="cursor-pointer"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/10 hover:text-[#BFFF00]">
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </Button>
                        
                        <div className="flex items-center gap-2 group/volume">
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/10">
                                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </Button>
                            <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                                <Slider 
                                    value={[isMuted ? 0 : volume]} 
                                    max={1} 
                                    step={0.1} 
                                    onValueChange={handleVolumeChange}
                                    className="w-20"
                                />
                            </div>
                        </div>

                        <span className="text-sm font-medium text-slate-300">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Playback Speed */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs font-bold">
                                    {playbackRate}x
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-black/90 border-slate-800 text-white">
                                {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                                    <DropdownMenuItem key={rate} onClick={() => changePlaybackRate(rate)} className="hover:bg-slate-800 cursor-pointer">
                                        {rate}x {playbackRate === rate && <Check className="w-3 h-3 ml-2" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Settings / Quality */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-black/90 border-slate-800 text-white">
                                <DropdownMenuItem onClick={() => setQuality('auto')} className="cursor-pointer">
                                    Auto {quality === 'auto' && <span className="ml-2 text-xs text-[#BFFF00]">●</span>}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setQuality('1080p')} className="cursor-pointer">1080p</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setQuality('720p')} className="cursor-pointer">720p</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/10">
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Play Button Overlay (when paused) */}
            {!isPlaying && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:scale-110 transition-transform duration-300 group-hover:bg-[#BFFF00]/20 group-hover:border-[#BFFF00]/50">
                        <Play className="w-8 h-8 text-white ml-1 fill-white group-hover:text-[#BFFF00] group-hover:fill-[#BFFF00]" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoLessonPlayer;