import { useEffect, useRef, useState } from 'react';

import './App.css';

import Mapper from './Mapper';
import useAudio from './useAudio';

function App() {
    const [pos, setPos] = useState({x: 0, y: 0});
    const [mapperSize, setMapperSize] = useState({width: 0, height: 0})
    const [scale, setScale] = useState(100);
    const mapperRef = useRef(null);
    
    const offsetPos = cpos => ({
        x: cpos.x - mapperSize.width / 2,
        y: cpos.y - mapperSize.height / 2
    })

    const handleKeyUp = e => {
        if (e.key === " ") {
            document.querySelector('.knock-btn').dispatchEvent(
                new MouseEvent('click', {view: window, bubbles: true, cancelable: true, buttons: 1})
            )
        }
    }
    
    useEffect(() => {
        document.addEventListener('keyup', handleKeyUp)

        return () => document.removeEventListener('keyup', handleKeyUp)
    }, []);
    
    useEffect(() => {
        if (!mapperRef.current) return;
        
        setPos({
            x: mapperRef.current.offsetWidth / 2 - 14,
            y: mapperRef.current.offsetHeight / 2 - 14
        })
        
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            setMapperSize({
                width: Math.round(entry.contentRect.width),
                height: Math.round(entry.contentRect.height)
            });
        });
        
        resizeObserver.observe(mapperRef.current);
        
        return () => {
            resizeObserver.disconnect();
        };
    }, [mapperRef]);
    
    const audioFilePath = '/knocking.mp3';
    const audioPlayer = useAudio(() => offsetPos(pos), scale,  audioFilePath);
    
    return (
        <div className="App">
            <div className="mapper-container">
                <Mapper
                    ref={mapperRef}
                    pos={pos}
                    setPos={setPos}
                />
            </div>
            <div className="inputs">
                <div className="range-wrapper">
                    <span>Scale</span>
                    <input
                        type="range"
                        id="scale-range"
                        min="10"
                        max="150"
                        value={scale}
                        onChange={e => setScale(e.target.value)}
                    />
                </div>
                <button className="knock-btn" onClick={audioPlayer}>Knock</button>
            </div>
        </div>
    )
}

export default App;
