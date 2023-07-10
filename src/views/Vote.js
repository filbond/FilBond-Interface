import { locale } from "../libs/locale";
import "./Vote.css";
import { VoteCard } from "./VoteCard";

export const Vote = () => {
	const t = locale.translate;

	return <div className="voteLayout">
		<div className="titleBar">
			<h2>{t("voteTitle")}</h2>
		</div>

		<div className="list">
			<VoteCard />

			<VoteCard>
				asdfadsfads<br />adsfadsfasdf
			</VoteCard>

			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
			<VoteCard />
		</div>
	</div>
};