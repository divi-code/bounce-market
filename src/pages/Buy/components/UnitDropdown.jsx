import React, { useState, useEffect } from "react";
import styled from "styled-components";

import icon_check_black from "./assets/check_black.svg";
import icon_check_white from "./assets/check_white.svg";
import icon_pull from "./assets/pull.svg";

const PullRadioBoxStyled = styled.div`
	cursor: pointer;
	position: relative;
	border-left:1px solid rgba(0,0,0,0.2);
	padding-left:12px;
	.select {
		/* width: ${({ width }) => {
			return width || "262px";
		}}; */
		width: 88px;
		height: ${({ height }) => {
			return height || "20px";
		}};
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
		/* margin-top: 20px; */

		p.value {
			font-family: Helvetica Neue;
			font-style: normal;
			font-weight: 500;
			font-size: 14px;
			line-height: 17px;
			text-transform: capitalize;
			color: #1f191b;
		}

		& > div {
			display: flex;
			font-size: 16px;
			color: rgba(0, 0, 0, 0.8);
			align-items: center;

			.prefix {
				margin-right: 6px;
				opacity: 0.4;
			}
		}

		& > img {
			transition: all 0.3s;
			&.up {
				transform: rotate(180deg);
			}

			&.down {
				transform: rotate(0deg);
			}
		}

		&>img.icon{
			height: 22px;
		}

		&.disabled {
			color: #000;
			opacity: 0.4;
			&:hover {
				border: 1px solid rgba(0, 0, 0, 0.6);
			}
		}
	}

	ul.options {
		position: absolute;
		top: 37px;
		left: 0px;
		width: ${({ width }) => {
			return width || "262px";
		}};
		max-height: 220px;
		box-sizing: border-box;
		overflow-x: hidden;
		background: #ffffff;
		border: 1px solid #eaeaea;
		box-sizing: border-box;
		box-shadow: 0px 1px 14px rgba(0, 0, 0, 0.1);
		margin-top: 5px;
		z-index: 1;

		li {
			width: 100%;
			height: 42px;
			line-height: 42px;
			font-family: Helvetica Neue;
			font-style: normal;
			font-weight: 500;
			font-size: 14px;
			color: #1f191b;
			padding: 0 42px;
			box-sizing: border-box;

			&:hover {
				background-color: #000;
				color: #ffffff;
			}

			&.check {
				background: url(${icon_check_black}) no-repeat;
				background-size: 13px;
				background-position: 16px center;

				&:hover {
					color: #ffffff;
					background: url(${icon_check_white}) no-repeat;
					background-color: #000;
					background-size: 13px;
					background-position: 16px center;
				}
			}
		}
	}
`;

export default function PullRadioBox({
	options,
	defaultValue,
	defaultItem,
	onChange,
	onValChange,
	disabled,
	prefix,
	style,
	width,
	height,
	marginTop,
	icon,
}) {
	// 这个组件的option 一定要传value属性
	const [open, setOpen] = useState(false);
	const [checkVal, setCheckVal] = useState(defaultValue || options[0].value);
	const [checkItem, setCheckItem] = useState(defaultItem || options[0]);

	useEffect(() => {
		onChange && onChange(checkItem);
		onValChange && onValChange(checkVal);
		// eslint-disable-next-line
	}, [checkVal]);

	return (
		<PullRadioBoxStyled
			icon={icon}
			style={style}
			width={width}
			height={height}
			marginTop={marginTop}
		>
			{!disabled && open && (
				<ul className="options">
					{options.map((item, index) => {
						return (
							<li
								key={item.value + "_" + index}
								className={`${
									item.value === checkVal
										? "option check"
										: "option"
								}`}
								onClick={() => {
									setCheckVal(item.value);
									setCheckItem(item);
									setOpen(false);
								}}
							>
								{item.value}
							</li>
						);
					})}
				</ul>
			)}
			<div
				className={`select ${!disabled && open && "open"} ${
					disabled && "disabled"
				}`}
				onClick={() => {
					if (disabled) return;
					setOpen(!open);
				}}
			>
				{icon && <img className="icon" src={icon} alt="" />}
				<div>
					{prefix && <span className="prefix">{prefix}</span>}
					<p className="value">{checkVal}</p>
				</div>
				<img src={icon_pull} className={open ? "up" : "down"} alt="" />
			</div>
		</PullRadioBoxStyled>
	);
}
