import React, { useCallback, useState, useEffect, useMemo, MouseEvent } from "react";
import cx from "classnames";

import styles from "./Maze.module.css";

interface Cell {
	position: number;
	up?: number;
	right?: number;
	down?: number;
	left?: number;
	next?: number;
	pathIndex?: number;
}

interface CellProps extends Cell {
	onCellClick: (position: number, to?: boolean) => void;
	from?: boolean;
	to?: boolean;
}

const cells = [
	{
		position: 1,
		up: 21,
		left: 15,
	},
	{
		position: 2,
		up: 6,
	},
	{
		position: 3,
		down: 23,
		// left: 99,
	},
	{
		position: 4,
		right: 5,
		left: 1,
	},
	{
		position: 5,
		right: 6,
		down: 12,
	},
	{
		position: 6,
		up: 20,
		down: 24,
		left: 17,
	},
	{
		position: 7,
		up: 5,
		down: 15,
	},
	{
		position: 8,
		up: 3,
		right: 6,
		left: 14,
	},
	{
		position: 9,
		right: 2,
		down: 10,
	},
	{
		position: 10,
		right: 11,
		left: 4,
	},
	{
		position: 11,
		up: 1,
		down: 9,
	},
	{
		position: 12,
		up: 18,
		right: 22,
		down: 24,
		left: 7,
	},
	{
		position: 13,
		up: 8,
		right: 16,
		left: 7,
	},
	{
		position: 14,
		up: 6,
		left: 16,
	},
	{
		position: 15,
		right: 2,
		down: 17,
		left: 10,
	},
	{
		position: 16,
		up: 24,
		// down: 99,
		left: 12,
	},
	{
		position: 17,
		up: 2,
		down: 19,
	},
	{
		position: 18,
		up: 16,
		right: 25,
		down: 7,
		left: 13,
	},
	{
		position: 19,
		up: 15,
		down: 22,
	},
	{
		position: 20,
		// up: 99,
		right: 23,
	},
	{
		position: 21,
		up: 4,
		down: 25,
	},
	{
		position: 22,
		right: 17,
		down: 4,
		left: 14,
	},
	{
		position: 23,
		up: 9,
		right: 20,
		left: 11,
	},
	{
		position: 24,
		right: 19,
	},
	{
		position: 25,
		up: 1,
		right: 17,
		down: 9,
		left: 7,
	},
];

function Cell({ position, onCellClick, from, to, up, right, down, left, next, pathIndex }: CellProps) {
	const onClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			onCellClick(position, event.ctrlKey);
		},
		[position, onCellClick]
	);

	return (
		<button
			className={cx(styles.cell, {
				[styles.from]: from,
				[styles.to]: to,
				// [styles.up]: up && next === up,
				// [styles.right]: right && next === right,
				// [styles.down]: down && next === down,
				// [styles.left]: left && next === left,
			})}
			onClick={onClick}
		>
			{position}
			{next && pathIndex && (
				<span
					className={cx({
						[styles.up]: up && next === up,
						[styles.right]: right && next === right,
						[styles.down]: down && next === down,
						[styles.left]: left && next === left,
					})}
				>
					{pathIndex}
				</span>
			)}
		</button>
	);
}

export default function Maze() {
	const [from, setFrom] = useState<number>();
	const [to, setTo] = useState<number>();
	const [path, setPath] = useState<Array<number>>([]);

	const onCellClick = useCallback((position: number, to?: boolean) => {
		if (to) {
			setTo(position);
			return;
		}
		setFrom(position);
	}, []);

	useEffect(() => {
		if (!from || !to) return;
		// Pathfinding
		const queue: Array<Array<number>> = [];
		const visited: Set<number> = new Set();
		queue.push([from]);
		while (queue.length > 0) {
			const path = queue.shift();
			if (!path) return;
			const current = path[path.length - 1];
			if (current === to) {
				console.log("Found", path);
				setPath(path);
				break;
			}
			console.log(current);
			// @ts-ignore
			const cell = cells[current - 1];
			if (visited.has(current)) continue;
			// @ts-ignore
			visited.add(current);
			if (cell.up && !visited.has(cell.up)) queue.push(path.concat([cell.up]));
			if (cell.right && !visited.has(cell.right)) queue.push(path.concat([cell.right]));
			if (cell.down && !visited.has(cell.down)) queue.push(path.concat([cell.down]));
			if (cell.left && !visited.has(cell.left)) queue.push(path.concat([cell.left]));
		}
	}, [from, to]);

	const descriptivePath = useMemo(() => {
		const result: Array<string> = [];
		if (path.length === 0) return result;
		for (let i = 0; i < path.length - 1; i++) {
			const current = path[i];
			const next = path[i + 1];
			// @ts-ignore
			const cell = cells[current - 1];
			if (cell.up === next) {
				result.push("cima");
				continue;
			}
			if (cell.right === next) {
				result.push("direita");
				continue;
			}
			if (cell.down === next) {
				result.push("baixo");
				continue;
			}
			if (cell.left === next) {
				result.push("esquerda");
				continue;
			}
		}
		return result;
	}, [path]);

	return (
		<section className={styles.wrapper}>
			<div className={styles.instructions}>
				<p>Clique esquerdo pra selecionar o início</p>
				<p>Ctrl + Clique esquerdo pra selecionar o destino</p>
			</div>
			<div className={styles.map}>
				{cells.map((cell: Cell) => {
					let next = undefined;
					const pathIndex = path.indexOf(cell.position);
					if (pathIndex >= 0 && pathIndex !== path.length - 1) {
						next = path[pathIndex + 1];
						console.log(cell.position, "Next: ", next);
					}
					return (
						<Cell
							{...cell}
							onCellClick={onCellClick}
							from={cell.position === from}
							to={cell.position === to}
							next={next}
							pathIndex={pathIndex + 1}
						/>
					);
				})}
			</div>
			{descriptivePath.length > 0 && (
				<p className={styles.path}>
					Caminho:{" "}
					{descriptivePath.map((movement, index) => `${movement} ${index < descriptivePath.length - 1 ? "-> " : ""}`)}
				</p>
			)}
		</section>
	);
}
