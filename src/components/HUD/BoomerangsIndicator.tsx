import { useRef } from "react";
import styled from "styled-components";
import { useHeldBoomerangs } from "../../store";

export function BoomerangsIndicator() {
	const [heldBoomerangs] = useHeldBoomerangs();
	return (
		<BoomerangsIndicatorStyles>
			<div className="boomerangsContainer">
				{heldBoomerangs.map(({ status }, idx) => (
					<BoomerangIcon key={idx} status={status} />
				))}
			</div>
		</BoomerangsIndicatorStyles>
	);
}

const ICON_WIDTH = 32;
const MARGIN = 8;

const BoomerangsIndicatorStyles = styled.div`
	position: fixed;
	top: 12px;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	font-size: 24px;
	text-shadow: 1px 1px 3px white;
	.boomerangsContainer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		max-width: ${(ICON_WIDTH + 2 * MARGIN) * 3}px;
	}
`;
function BoomerangIcon({ status }) {
	const rand = useRef(Math.floor(Math.random() * 50 + 330)).current;
	return (
		<span
			style={{
				opacity: status === "held" ? 1 : 0.5,
				margin: MARGIN,
				transform: `rotate(-${rand}deg)`,
			}}
		>
			<img src="/images/boomerang.png" width={ICON_WIDTH} height={ICON_WIDTH} />
		</span>
	);
}
