import { useEffect, useState, forwardRef, useCallback } from "react"

const clamp = (min, x, max) => Math.round(Math.min(Math.max(x, min), max));

export default forwardRef(({ pos, setPos }, ref) => {
    const [dragging, setDragging] = useState(false);
    const [initialPos, setInitialPos] = useState({x: 0, y: 0});

    const handleMouseDown = useCallback(e => {
        e.preventDefault();
        setDragging(true);
        setInitialPos({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        });
    }, [pos]);

    const handleMouseMove = useCallback((e) => {
        if (!dragging) return;
        var rect = document.querySelector('.mapper-content').getBoundingClientRect();
        setPos({
            x: clamp(0, e.clientX - initialPos.x, rect.width - 28),
            y: clamp(0, e.clientY - initialPos.y, rect.height - 28)
        });
    }, [dragging, initialPos, setPos]);

    const handleMouseUp = () => setDragging(false);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleMouseDown, handleMouseMove, dragging])

    return (
        <div className="mapper-content" ref={ref}>
            <div className="center-ref"></div>
            <div
                className={"pos-indicator" + (dragging ? " dragging" : "")}
                style={{left: pos.x, top: pos.y}}
                onMouseDown={handleMouseDown}
            ></div>
        </div>
    )
});