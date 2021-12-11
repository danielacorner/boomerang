import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import { useCallback } from "react";
import { usePressedKeys } from "./Player/usePressedKeys";
import { Direction } from "./Scene";

export const JOYSTICK_RADIUS = 64;
const JOYSTICK_THUMB_RADIUS = JOYSTICK_RADIUS / 2;
const JOYSTICK_PADDING = JOYSTICK_RADIUS / 2;

const THRESHOLD = JOYSTICK_RADIUS - JOYSTICK_THUMB_RADIUS / 2;
const MAX_THUMB_XY = THRESHOLD;
const MIN_THUMB_YY = -THRESHOLD;

const trans1 = (x, y) => `translate3d(${x}px,${y}px,0)`;
export function Joystick() {
  const { pressedKeys, lastPressedKey, setPressedKeys } = usePressedKeys();
  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("🌟🚨 ~ onMouseMove ~ e", e);

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
    console.log("🌟🚨 ~ onMouseMove ~ distance", distance);
    if (distance < JOYSTICK_RADIUS) {
      const angle = Math.atan2(y, x);
      const x2 = JOYSTICK_RADIUS * Math.cos(angle);
      const y2 = JOYSTICK_RADIUS * Math.sin(angle);

      const [up, down, left, right] = [
        y2 > THRESHOLD,
        y2 < -THRESHOLD,
        x2 > THRESHOLD,
        x2 < -THRESHOLD,
      ];

      const nextPressedKeys = [
        ...(up ? ["ArrowUp"] : []),
        ...(down ? ["ArrowDown"] : []),
        ...(left ? ["ArrowLeft"] : []),
        ...(right ? ["ArrowRight"] : []),
      ] as Direction[];

      setPressedKeys(nextPressedKeys);
      set({ xy: [x2, y2] });
      console.log("🌟🚨 ~ onMouseMove ~ x2, y2", x2, y2);
    } else {
      setPressedKeys([]);
    }
  }, []);
  const onMouseUp = () => {
    console.log("🌟🚨 ~ onMouseUp ~ onMouseUp");
    setPressedKeys([]);
    set({ xy: [0, 0] });
  };
  return (
    <JoystickStyles
      onMouseMove={onMouseMove}
      onPointerMove={onMouseMove}
      onMouseUp={onMouseUp}
      onPointerUp={onMouseUp}
    >
      <animated.div
        style={{ transform: xy.to(trans1) }}
        className="joystickThumb"
      ></animated.div>
    </JoystickStyles>
  );
}
const JoystickStyles = styled.div`
  position: fixed;
  bottom: ${JOYSTICK_PADDING}px;
  right: ${JOYSTICK_PADDING}px;
  background: rgb(255 255 255 / 30%);
  border-radius: 50%;
  width: ${JOYSTICK_RADIUS * 2}px;
  height: ${JOYSTICK_RADIUS * 2}px;
  box-shadow: inset 0 0 10px 4px rgb(68 63 63 / 37%);
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
