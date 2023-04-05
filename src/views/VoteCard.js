import "./VoteCard.css";

export const VoteCard = ({ children = null }) => {
	return <div className="voteCardLayout">
		{children ?? "ADSFADSFDAS"}
	</div>
};