import { useEffect, useState } from "react";
import { useInterval } from "react-use";
import styled from "styled-components";
import { INITIAL_GAME_STATE, useGameStateRef } from "../../store";

export function PlayerHPBar() {
	const [gameStateRef] = useGameStateRef();
	const [{ hitpoints, maxHitpoints }, setState] = useState({
		hitpoints: INITIAL_GAME_STATE.hitpoints,
		maxHitpoints: INITIAL_GAME_STATE.maxHitpoints,
	});

	// to avoid using state (bad perf?), check the gameStateRef on interval
	// ? there must be a better way lol
	useInterval(() => {
		if (
			gameStateRef.current.hitpoints !== hitpoints ||
			gameStateRef.current.maxHitpoints !== maxHitpoints
		) {
			setState({
				hitpoints: gameStateRef.current.hitpoints,
				maxHitpoints: gameStateRef.current.maxHitpoints,
			});
		}
	}, 500);

	useEffect(() => {
		if (hitpoints === 0) {
			console.log("You died!");
		}
	}, [hitpoints]);
	return (
		<PlayerHpBarStyles>
			{[...new Array(Math.max(0, hitpoints))].map((_) => "🧡 ")}
			{[...new Array(Math.max(0, maxHitpoints - hitpoints))].map((_, idx) => (
				<span key={idx} style={{ opacity: 0.4 }}>
					💔{" "}
				</span>
			))}
		</PlayerHpBarStyles>
	);
}
const PlayerHpBarStyles = styled.div`
	position: fixed;
	top: 16px;
	left: 16px;
	font-size: 16px;
	text-shadow: 1px 1px 3px white;
	@media (min-width: 768px) {
		font-size: 24px;
	}
`;
