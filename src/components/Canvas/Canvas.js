import React, { useRef, useEffect } from "react";
import linesCross from "../../utils/lines";

function Canvas(props) {
    const canvasRef = useRef(null);

    let isPainting = false;
    let lines = [];
    let countLine = 0;
    let prevPos = { offsetX: 0, offsetY: 0 };
    let ctx = null;

    useEffect(() => {
        ctx = canvasRef.current.getContext("2d");
    }, []);

    const onMouseDown = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        isPainting = !isPainting;
        if (!isPainting) {
            countLine++;
        }
        prevPos = { offsetX, offsetY };
    };

    const onMouseMove = ({ nativeEvent }) => {
        if (isPainting) {
            const { offsetX, offsetY } = nativeEvent;
            const offSetData = { offsetX, offsetY };

            lines[countLine] = {
                start: { ...prevPos },
                end: { ...offSetData }
            };

            paint(lines, "#000");
            paintDots(generateCrossData());
        }
    };

    const paint = (lines, strokeStyle) => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        lines.forEach((line) => {
            ctx.beginPath();
            ctx.strokeStyle = strokeStyle;
            ctx.moveTo(line.start.offsetX, line.start.offsetY);
            ctx.lineTo(line.end.offsetX, line.end.offsetY);
            ctx.stroke();
        });
    };

    const paintDots = (crossData) => {
        crossData.forEach((cross) => {
            ctx.fillStyle = "#ff0000";
            ctx.beginPath();
            ctx.arc(cross.x, cross.y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    const generateCrossData = () => {
        let pos = 0;
        let result = [];
        for (let i = pos; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                if (i !== j) {
                    const crossResult = linesCross(
                        lines[i].start.offsetX,
                        lines[i].start.offsetY,
                        lines[i].end.offsetX,
                        lines[i].end.offsetY,
                        lines[j].start.offsetX,
                        lines[j].start.offsetY,
                        lines[j].end.offsetX,
                        lines[j].end.offsetY
                    );

                    if (crossResult.cross === true) {
                        result.push({
                            x: crossResult.x,
                            y: crossResult.y
                        });
                    }
                }
            }
        }

        return result;
    };

    const collapseLine = (line, speed) => {
        let maxX, minX, maxY, minY, startMinX, startMinY, difX, difY;

        if (line.start.offsetX > line.end.offsetX) {
            maxX = line.start;
            minX = line.end;
        } else {
            maxX = line.end;
            minX = line.start;
        }

        if (line.start.offsetY > line.end.offsetY) {
            maxY = line.start;
            minY = line.end;
        } else {
            maxY = line.end;
            minY = line.start;
        }

        startMinX = minX.offsetX;
        startMinY = minY.offsetY;
        const trendX = (maxX.offsetX - minX.offsetX) / 2;
        const trendY = (maxY.offsetY - minY.offsetY) / 2;

        const sumX = maxX.offsetX - minX.offsetX;
        const sumY = maxY.offsetY - minY.offsetY;

        if (sumX > sumY) {
            difY = sumY / sumX;
            difX = 1;
            speed = Math.floor(speed / trendX) / 1.4;
        } else {
            difX = sumX / sumY;
            difY = 1;
            speed = Math.floor(speed / trendY) / 1.4;
        }

        const render = () => {
            console.log("maxX: " + maxX.offsetX);
            console.log("trendX: " + (trendX + startMinX));
            if (maxX.offsetX >= trendX + startMinX) {
                maxX.offsetX -= 1 * difX;
                minX.offsetX += 1 * difX;
            }
            console.log("maxY: " + maxX.offsetY);
            console.log("trendY: " + (trendY + startMinY));
            if (maxY.offsetY >= trendY + startMinY) {
                maxY.offsetY -= 1 * difY;
                minY.offsetY += 1 * difY;
            }

            setTimeout(() => {
                paint(lines, "#000");
                paintDots(generateCrossData());
                if (
                    maxX.offsetX <= trendX + startMinX &&
                    maxY.offsetY <= trendY + startMinY
                ) {
                    ctx.clearRect(
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height
                    );
                    lines = [];
                    countLine = 0;
                    console.log("return");
                    return;
                }

                window.requestAnimationFrame(render);
            }, speed);
        };

        render();
    };

    const collapse = () => {
        lines.forEach((line) => {
            const speed = 3000;

            collapseLine(line, speed);
        });
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                {...props}
            />
            <div>
                <button onClick={collapse} className="collapse_btn">Collapse</button>
            </div>
        </div>
    );
}

export default Canvas