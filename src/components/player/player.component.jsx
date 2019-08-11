import React from 'react';

import './player.component.scss';

import DragAndDrop from '../drag-and-drop/drag-and-drop.component';
import VdemyPlayer from '../vdemy-player/vdemy-player.component';

class Player extends React.Component {
    constructor() {
        super();
        this.state = {
            player : {
                src:''
            }
        }
    }

    handleDrop = (files) => {
        let fileList = [];
        for (var i = 0; i < files.length; i++) {
            if (!files[i].name) return
            fileList.push(files[i].path)
        }
        this.setState({player: { src: fileList[0]}});
    }
      
    render() {
        const { player } = this.state;
        return (
            <DragAndDrop handleDrop={this.handleDrop}>
                <div className="player__container">
                {
                    player.src === '' ? 
                        null :
                        <VdemyPlayer player={player} />
                 
                }
                </div>
                
                
            </DragAndDrop>
        );
    }
}

export default Player;