import styled from "styled-components";
import { useMoney } from "../../store";

export function MoneyIndicator() {
	const [money] = useMoney();
	return <ScoreStyles>💰 {money}</ScoreStyles>;
}
const ScoreStyles = styled.div`
	position: fixed;
	top: 16px;
	right: 16px;
	font-size: 24px;
	color: white;
`;
