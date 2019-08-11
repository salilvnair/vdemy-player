import React from 'react';

import './vdemy-player.component.scss';


class VdemyPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.videoElementRef = React.createRef();
        this.seekbarRef = React.createRef();
        this.seekbarTimerRef = React.createRef();
        this.playerContainerRef = React.createRef();
        this.state = {
            playerState: {
                isPaused: false,
                playbackSpeed: "1",
                currentVideoDuration: 0,
                fullScreen: false,
                currentVolume: 50
            }
        }
    }

    togglePlayOrPause() {
        const { playerState } = this.state;
        if(playerState.isPaused) {
            this.setState(prevState => ({
                playerState: {
                  ...prevState.playerState,       
                  isPaused: false
                }
            }));
            this.videoElementRef.current.play()
        }
        else {
            this.videoElementRef.current.pause();
            this.setState(prevState => ({
                playerState: {
                  ...prevState.playerState,       
                  isPaused: true
                }
            }));
        }
    }

    rewindCurrentTime() {
        this.videoElementRef.current.currentTime += -5;
    }

    forwardCurrentTime() {
        this.videoElementRef.current.currentTime += 5;
    }

    handleOnInput  = (event) => {
        var seekBarVal = this.seekbarRef.current.value;
          var vidTime =
          this.videoElementRef.current.duration *
            (seekBarVal / 100);
            this.videoElementRef.current.currentTime = vidTime;
    }

    handleChangeAndMouseMove = (event) => {
        
        var seekBarVal = (this.seekbarRef.current.value - this.seekbarRef.current.getAttribute('min'))/(this.seekbarRef.current.getAttribute('max')-this.seekbarRef.current.getAttribute('min'));
        var c = this.seekbarRef.current.style;
        c.backgroundImage = '-webkit-gradient(linear, left top, right top, ' +
        'color-stop(' +
        seekBarVal +
        ', #ec5252), ' +
        'color-stop(' +
        seekBarVal +
        ', #818181)' +
        ')';
    }

    handlePlayerOnTimeUpdate = (event) => {
        if (!isNaN(this.videoElementRef.current.duration)) {
            var percentage =
                (this.videoElementRef.current.currentTime /
                this.videoElementRef.current.duration) *
                100;
            this.seekbarRef.current.value = percentage;
            var currentTime =
                this.videoElementRef.current.currentTime;
            var totalDuration =
                this.videoElementRef.current.duration;
            this.seekbarTimerRef.current.innerText = this.formatTime(currentTime) + '/' + this.formatTime(totalDuration);
            var currentVideoDuration = Math.floor(
                this.videoElementRef.current.duration
            );

            this.setState(prevState => ({
                playerState: {
                    ...prevState.playerState,       
                    currentVideoDuration: currentVideoDuration
                }
            }));
        }
    }

    changePlayBackRate = (rate) => {
        if(this.videoElementRef.current) {
            this.videoElementRef.current.playbackRate = rate;
            this.setState(prevState => ({
                playerState: {
                    ...prevState.playerState,       
                    playbackSpeed:rate+''
                }
            }));
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) {
          return '00:00';
        }
        let minutes = Math.floor(seconds / 60);
        let sMinutes = minutes >= 10 ? minutes : '0' + minutes;
        seconds = Math.floor(seconds % 60);
        let sSeconds = seconds >= 10 ? seconds : '0' + seconds;
        return sMinutes + ':' + sSeconds;
    }

    toggleFullScreen = () => {
        var fullscreenElement =
      document["fullscreenElement"] || document["webkitFullscreenElement"];
      if (fullscreenElement) {
        this.exitFullscreen();
      }
      else {
        this.launchIntoFullscreen(this.playerContainerRef.current);
      }
      
    }

    launchIntoFullscreen = (element) => {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
    }

    exitFullscreen = () => {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document["webkitExitFullscreen"]) {
          document["webkitExitFullscreen"]();
        }
    }

    render() {
        const { playerState } = this.state;
        return (
            <div id="playerContainer" ref={this.playerContainerRef} className="vdemy-player">
                <video 
                    id="videoPlayer" 
                    className="video-player" 
                    src={'file://'+this.props.player.src} 
                    ref={this.videoElementRef}
                    onTimeUpdate={this.handlePlayerOnTimeUpdate}
                    autoPlay>
                </video> 
                <div className="media-control__container" id="playerControls">
                    <div>
                        <div className="seekbar-slider__container">
                            <input 
                                type="range" 
                                min="1" 
                                max="100" 
                                defaultValue="0" 
                                className="seekbar-slider" 
                                id="seekbar"
                                onInput={this.handleOnInput}
                                onChange={this.handleChangeAndMouseMove}
                                onMouseMove={this.handleChangeAndMouseMove} 
                                ref={this.seekbarRef} />
                        </div>
                        <div id="seekbarTimer" className="seekbar-timer" ref={this.seekbarTimerRef}></div>
                    </div>
                    <div className="controls">
                        <button id="btnPlayPause" className="btn__play-pause"   onClick={()=>{this.togglePlayOrPause()}}>
                            {
                                playerState.isPaused ? ">": "||"
                            }
                        </button>
                        <button id="btnPullTimerBack" className="btn__rewind" onClick={()=>{this.rewindCurrentTime()}}>
                            {
                                "5<"
                            }
                        </button>
                        <div className="common-dropup">
                            <button className="playback__rate" id="playBackSpeedBtn">{playerState.playbackSpeed + 'x'}</button>
                            <div className="dropup__container">
                                <button 
                                    className="rate-dropup"
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='2' ? '#ec5252' : 'black'
                                        }
                                    } 
                                    onClick={()=>{this.changePlayBackRate(2)}}>
                                        2x</button>
                                <button 
                                    className="rate-dropup" 
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='1.5' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(1.5)}}>
                                        1.5x</button>
                                <button 
                                    className="rate-dropup" 
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='1.25' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(1.25)}}>
                                        1.25x</button>
                                <button 
                                    className="rate-dropup" 
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='1' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(1)}}>
                                        1x</button>
                                <button 
                                    className="rate-dropup" 
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='0.75' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(0.75)}}>
                                        0.75x</button>
                                <button 
                                    className="rate-dropup" 
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='0.5' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(0.5)}}>
                                        0.5x</button>
                            </div>
                        </div>  
                        <button id="btnPullTimerForward" className="btn__forward" onClick={()=>{this.forwardCurrentTime()}}>
                            {
                                ">5"
                            }
                        </button>
                        <button 
                            id="btnFullScreen" 
                            className="btn__fullScreen" 
                            onClick={this.toggleFullScreen}  >
                        [ ]
                        </button>
                    
                    </div>
                </div> 
            </div>
        );
    }
}

export default VdemyPlayer;