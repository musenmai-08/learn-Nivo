import styled from "styled-components";
import {
	ComputedSerie,
	CustomLayerProps,
	Point,
	ResponsiveLine,
} from "@nivo/line";
import { useState } from "react";
import { ScaleLinear } from "@nivo/scales";

const StyledTooltip = styled.div<{ color: string }>`
	color: black;
	background-color: white;
	border: 2px solid ${({ color }) => color};
	border-radius: 8px;
	width: auto;
	height: auto;
	padding: 11px 9px 9px;
`;

const TooltipGeneratedText = styled.span`
	font-family: Nunito;
	font-size: 13px;
	font-weight: 600;
	line-height: 17.73px;
`;

const StyledUnit = styled.span`
	font-family: Nunito;
	font-size: 11px;
	font-weight: 600;
	margin-left: 5px;
	line-height: 15px;
`;

const StyledTooltipArrow = styled.div<{ color: string }>`
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
		border-top: 9px solid ${({ color }) => color};
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

// https://github.com/plouc/nivo/issues/2428
type CustomLineLayerProps = Omit<CustomLayerProps, "xScale" | "yScale"> & {
	xScale: ScaleLinear<number>;
	yScale: ScaleLinear<number>;
};

// グラフの線を描画
// 参考：https://github.com/plouc/nivo/issues/1604
const customLinesLayer = (
	props: CustomLineLayerProps,
	selectedLine: string
) => {
	const { series, lineGenerator, xScale, yScale } = props;
	return series.map((s: ComputedSerie) => {
		const { id, data, color } = s;

		// TODO: 型は要再検討。asを使いすぎている
		const line = lineGenerator(
			data.map((d) => ({
				x: xScale(d.data.x as number),
				y: yScale(d.data.y as number),
			}))
		) as string;

		return (
			<path
				key={id}
				d={line}
				fill="none"
				stroke={color}
				strokeWidth={2}
				opacity={id === selectedLine ? 1 : 0.2}
			/>
		);
	});
};

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
					stroke={clickedPoint.color}
					strokeWidth={2}
					fill="white"
				/>
			</g>
		);
	};

const mulchData = [
	{
		id: "パワコン1",
		data: [
			{ x: "Sun", y: 600 },
			{ x: "Mon", y: 620 },
			{ x: "Tue", y: 800 },
			{ x: "Wed", y: 1600 },
			{ x: "Thur", y: 800 },
			{ x: "Fri", y: 620 },
			{ x: "Sat", y: 600 },
		],
	},
	{
		id: "パワコン2",
		data: [
			{ x: "Sun", y: 950 },
			{ x: "Mon", y: 950 },
			{ x: "Tue", y: 1100 },
			{ x: "Wed", y: 1250 },
			{ x: "Thur", y: 1100 },
			{ x: "Fri", y: 1080 },
			{ x: "Sat", y: 900 },
		],
	},
	{
		id: "パワコン3",
		data: [
			{ x: "Sun", y: 1550 },
			{ x: "Mon", y: 1450 },
			{ x: "Tue", y: 1400 },
			{ x: "Wed", y: 500 },
			{ x: "Thur", y: 1100 },
			{ x: "Fri", y: 950 },
			{ x: "Sat", y: 900 },
		],
	},
];

const MultiLineGraph = () => {
	const data = mulchData;

	const [clickedPoint, setClickedPoint] = useState<Point | null>(null);
	const [selectedLine, setSelectedLine] = useState<string>(
		data[0].id as string
	);

	const handleClick = (point: Point) => {
		setClickedPoint(point);
		setSelectedLine(point.serieId as string);
	};
	// グラフ外にマウスが出た時にポイントをリセット
	const handleMouseLeave = () => {
		setClickedPoint(null);
	};

	return (
		<ResponsiveLine
			data={data}
			margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
			enableTouchCrosshair={true} // trueにしないとtoolTipが表示されないことがある
			useMesh={true}
			pointSize={0}
			xScale={{ type: "point" }}
			yScale={{
				type: "linear",
				min: 0, // 縦軸メモリの最小値
				max: 2000, // 縦軸メモリの最大値
				stacked: false,
				reverse: false,
			}}
			curve="catmullRom" // 線の種類
			colors={["#60B2FF", "#39E23F", "#FC60FF"]} // 線の色
			axisLeft={{
				tickSize: 0,
				tickPadding: 5.72,
				// tickValues: tickValues,
				renderTick: (
					{ value, x, y } // Y軸の数字
				) => (
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
			axisBottom={{
				tickSize: 0,
				tickPadding: 8.42,
				renderTick: (
					{ value, x, y } // X軸の文字
				) => (
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
			layers={[
				"markers",
				"axes",
				"areas",
				"slices",
				"mesh",
				(props: CustomLineLayerProps) => customLinesLayer(props, selectedLine),
				CustomLayer,
				CustomPointLayer(clickedPoint),
			]}
			onClick={handleClick}
			onMouseLeave={handleMouseLeave}
			tooltip={({ point }: { point: Point }) => (
				<StyledTooltip color={point.color}>
					<div>
						<TooltipGeneratedText>{point.data.yFormatted}</TooltipGeneratedText>
						<StyledUnit>円</StyledUnit>
					</div>
					{/* 下の吹き出し */}
					<StyledTooltipArrow color={point.color} />
				</StyledTooltip>
			)}
		/>
	);
};

export default MultiLineGraph;
