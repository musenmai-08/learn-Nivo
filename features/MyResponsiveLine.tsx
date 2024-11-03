"use client";

import styled from "styled-components";
import { ResponsiveLine, Point, CustomLayerProps } from "@nivo/line";
import { useState } from "react";

const StyledTooltip = styled.div`
	color: black;
	background-color: white;
	border: 2px solid red;
	border-radius: 8px;
	width: auto;
	height: auto;
	padding: 13px 11px 11px;
`;

const TooltipGeneratedText = styled.span`
	font-size: 13px;
	font-weight: 600;
`;

const StyledTooltipArrow = styled.div`
	position: absolute;
	left: calc(50% - 6px);
	transform: translateX(-50%);
	width: 0;
	height: 0;

	// 枠線下の三角形
	&::before {
		content: "";
		position: absolute;
		bottom: -20px;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 9px solid red;
	}

	// 白い三角形の部分
	&::after {
		content: "";
		position: absolute;
		bottom: -16px;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 9px solid white;
		z-index: 2;
	}
`;

// グラフ部分の背景色
const CustomLayer = (props: CustomLayerProps) => {
	const { innerHeight, innerWidth } = props;
	return (
		<g transform={`translate(0, 0)`} style={{ zIndex: -10 }}>
			<rect
				x={0}
				y={0}
				width={innerWidth}
				height={innerHeight}
				fill="rgba(255, 153, 0, 0.05)"
				style={{ pointerEvents: "none" }}
			/>
		</g>
	);
};

// グラフをクリックしたときに表示するpoint
const CustomPointLayer = (clickedPoint: Point | null) =>
	function CustomPointLayerContext() {
		if (!clickedPoint) return null;
		return (
			<g style={{ pointerEvents: "none" }}>
				<circle
					cx={clickedPoint.x}
					cy={clickedPoint.y}
					r={4}
					stroke="red"
					strokeWidth={2}
					fill="white"
				/>
			</g>
		);
	};

const simpleData = [
	{
		id: "cost",
		data: [
			{ x: "Sun", y: 1000 },
			{ x: "Mon", y: 800 },
			{ x: "Tue", y: 1300 },
			{ x: "Wed", y: 1250 },
			{ x: "Thur", y: 1290 },
			{ x: "Fri", y: 1080 },
			{ x: "Sat", y: 1500 },
		],
	},
];

const MyResponsiveLine = () => {
	const [clickedPoint, setClickedPoint] = useState<Point | null>(null);

	const handleClick = (point: Point) => {
		setClickedPoint(point);
	};
	const handleMouseLeave = () => {
		setClickedPoint(null);
	};

	return (
		<ResponsiveLine
			data={simpleData} // 最後に補足する
			margin={{ top: 50, right: 110, bottom: 50, left: 60 }} // 最後に補足する
			useMesh={true} // 最後に補足する
			curve="catmullRom"
			colors={"red"}
			enablePoints={false}
			xScale={{ type: "point" }}
			yScale={{
				type: "linear",
				min: 0,
				max: 2000,
				stacked: false,
				reverse: false,
			}}
			axisBottom={{
				tickSize: 0,
				tickPadding: 5,
				renderTick: ({ value, x, y }) => (
					<text
						x={x}
						y={y + 18}
						fill="#79858C"
						fontSize="11"
						textAnchor="middle"
					>
						{value}
					</text>
				),
			}}
			axisLeft={{
				tickSize: 0,
				tickPadding: 5.72,
				tickValues: [0, 500, 1000, 1500, 2000],
				renderTick: ({ value, x, y }) => (
					<text
						x={x - 35}
						y={y}
						fill="#79858C"
						fontSize="11"
						dominantBaseline="middle"
					>
						{value}
					</text>
				),
			}}
			tooltip={({ point }: { point: Point }) => (
				<StyledTooltip>
					<div>
						<TooltipGeneratedText>
							{point.data.yFormatted}円
						</TooltipGeneratedText>
					</div>
					{/* 下の吹き出し */}
					<StyledTooltipArrow />
				</StyledTooltip>
			)}
			enableGridX={false}
			enableGridY={false}
			layers={[
				"markers",
				"axes",
				"areas",
				"lines",
				"slices",
				"mesh",
				CustomLayer,
				CustomPointLayer(clickedPoint),
			]}
			onClick={handleClick}
			onMouseLeave={handleMouseLeave}
		/>
	);
};

export default MyResponsiveLine;
