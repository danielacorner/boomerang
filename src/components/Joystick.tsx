import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import { atom, useAtom } from "jotai";
import { SetStateAction } from "react";

const JOYSTICK_RADIUS = 64;
const JOYSTICK_THUMB_RADIUS = JOYSTICK_RADIUS / 2;
const JOYSTICK_PADDING = JOYSTICK_RADIUS / 2;

const MAX_THUMB_XY = JOYSTICK_RADIUS - JOYSTICK_THUMB_RADIUS / 2;
const MIN_THUMB_YY = -JOYSTICK_RADIUS + JOYSTICK_THUMB_RADIUS / 2;

const joystickPositionAtom = atom([0, 0]);
export function useJoystickPosition(): [
  number[],
  (update: SetStateAction<number[]>) => void
] {
  const [joystickPosition, setJoystickPosition] = useAtom(joystickPositionAtom);
  return [joystickPosition, setJoystickPosition];
}

export function Joystick() {
  const [joystickPosition, setJoystickPosition] = useJoystickPosition();
  console.log("🌟🚨 ~ Joystick ~ joystickPosition", joystickPosition);
  const springPosition = useSpring({
    x: joystickPosition[0],
    y: joystickPosition[1],
  });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // x ranges from -JOYSTICK_RADIUS to JOYSTICK_RADIUS
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const joystickCenterX =
      window.innerWidth - JOYSTICK_RADIUS - JOYSTICK_PADDING;
    const joystickCenterY =
      window.innerHeight - JOYSTICK_RADIUS - JOYSTICK_PADDING;

    const x = Math.max(
      MIN_THUMB_YY,
      Math.min(MAX_THUMB_XY, mouseX - joystickCenterX)
    );
    const y = Math.max(
      MIN_THUMB_YY,
      Math.min(MAX_THUMB_XY, mouseY - joystickCenterY)
    );

    const distance = Math.sqrt(x * x + y * y);
    if (distance > JOYSTICK_RADIUS) {
      const angle = Math.atan2(y, x);
      const x2 = JOYSTICK_RADIUS * Math.cos(angle);
      const y2 = JOYSTICK_RADIUS * Math.sin(angle);
      setJoystickPosition([x2, y2]);
    } else {
      setJoystickPosition([x, y]);
    }
  };
  const onMouseUp = () => {
    setJoystickPosition([0, 0]);
  };
  return (
    <JoystickStyles
      onMouseMove={onMouseMove}
      onPointerMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <animated.div
        style={springPosition}
        className="joystickThumb"
      ></animated.div>
    </JoystickStyles>
  );
}
const JoystickStyles = styled.div`
  position: fixed;
  bottom: ${JOYSTICK_PADDING}px;
  right: ${JOYSTICK_PADDING}px;
  background: rgb(255 255 255 / 42%);
  border-radius: 50%;
  width: ${JOYSTICK_RADIUS * 2}px;
  height: ${JOYSTICK_RADIUS * 2}px;
  box-shadow: inset 0 0 20px 10px rgb(68 63 63 / 37%);
  .joystickThumb {
    margin-top: ${JOYSTICK_THUMB_RADIUS - 1}px;
    margin-left: ${JOYSTICK_THUMB_RADIUS - 1}px;
    width: ${JOYSTICK_THUMB_RADIUS * 2}px;
    height: ${JOYSTICK_THUMB_RADIUS * 2}px;
    background: rgba(85, 80, 80, 0.815);
    box-shadow: 0 0 3px 1px rgb(68 63 63 / 37%);
    border-radius: 50%;
  }
`;
