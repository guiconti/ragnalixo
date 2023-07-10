import type { NextPage } from "next";

import Maze from "@/components/Maze";

import styles from "./styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Maze />
		</div>
	);
};

export default Home;
