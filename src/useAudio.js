import { useRef } from 'react';

export default function useAudio(getPos, getScale, audioFilePath) {
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);

    return async () => {
        if (!audioContextRef.current) {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
        }

        const response = await fetch(audioFilePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = audioContextRef.current;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        const panner = audioContext.createPanner();
        panner.panningModel = 'equalpower';

        const {x, y} = getPos();
        panner.positionX.value = x / getScale;
        panner.positionZ.value = y / getScale;
        panner.positionY.value = 0;

        source.connect(panner);
        panner.connect(audioContext.destination);
        source.start();

        sourceRef.current = source;
    };
};