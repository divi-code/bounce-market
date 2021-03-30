import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";

import BreadcrumbNav from "./components/BreadcrumbNav";
import { Button } from "@components/UI-kit";
import NFTInfoDropdown from "./components/NFTInfoDropdown";
import {
	DetailsContent,
	TokenInfoContent,
	OffersContent,
	TradingHistoryContent,
} from "./components/DropdownContent";
import OffersTable from "./components/OffersTable";
/* import TradeTable from "./components/TradeTable"; */

import BounceFixedSwapNFT from "@/web3/abi/BounceFixedSwapNFT.json";

import icon_altAvatar from "./assets/icon_altAvatar.svg";
import icon_Clock from "./assets/icon_Clock.svg";

import useNftInfo from "@/utils/useToken";
import { getContract, useActiveWeb3React } from "@/web3";
import { getFixedSwapNFT } from "@/web3/address_list/contract";
import useTransferModal from "@/web3/useTransferModal";
import useHook from "./use_FS_Hook";
import { weiMul, weiToNum } from "@/utils/useBigNumber";
import { AutoStretchBaseWidthOrHeightImg } from "../component/Other/autoStretchBaseWidthOrHeightImg";

const NFTType = "Images";
const NFTName = "Digital Image Name";

function Buy() {
	// const history = useHistory();
	const { poolId } = useParams();
	const { exportNftInfo } = useNftInfo();
	const { showTransferByStatus } = useTransferModal();
	const { active, library, account, chainId } = useActiveWeb3React();
	const [nftInfo, setNftInfo] = useState({});
	const { poolsInfo } = useHook(poolId);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!active || poolsInfo === {}) return;
		initShowNftInfo();
		// eslint-disable-next-line
	}, [active, poolsInfo]);

	const initShowNftInfo = async () => {
		const info = await exportNftInfo(poolsInfo.tokenId);
		setNftInfo(info);
	};

	const handelBid = async () => {
		console.log(nftInfo, poolsInfo);
		setIsLoading(true);
		if (poolsInfo.nftType === "0") {
			const BounceFixedSwapNFT_CT = getContract(
				library,
				BounceFixedSwapNFT.abi,
				getFixedSwapNFT(chainId)
			);

			BounceFixedSwapNFT_CT.methods
				.swap(poolId, poolsInfo.amountTotal0)
				.send({ from: account, value: poolsInfo.amountTotal1 })
				.on("transactionHash", (hash) => {
					// setBidStatus(pendingStatus)
					showTransferByStatus("pendingStatus");
				})
				.on("receipt", async (_, receipt) => {
					// console.log('bid fixed swap receipt:', receipt)
					// setBidStatus(successStatus)
					showTransferByStatus('successStatus')
				})
				.on("error", (err, receipt) => {
					// setBidStatus(errorStatus)
					showTransferByStatus("errorStatus");
				});
		} else {
			const BounceFixedSwapNFT_CT = getContract(
				library,
				BounceFixedSwapNFT.abi,
				getFixedSwapNFT(chainId)
			);

			BounceFixedSwapNFT_CT.methods
				.swap(poolId, poolsInfo.amountTotal0)
				.send({ from: account, value: poolsInfo.amountTotal1 })
				.on("transactionHash", (hash) => {
					// setBidStatus(pendingStatus)
					showTransferByStatus("pendingStatus");
				})
				.on("receipt", async (_, receipt) => {
					// console.log('bid fixed swap receipt:', receipt)
					// setBidStatus(successStatus)
					showTransferByStatus('successStatus')
				})
				.on("error", (err, receipt) => {
					// setBidStatus(errorStatus)
					showTransferByStatus("errorStatus");
				});
		}
	};

	return (
		<Page>
			<BreadcrumbNav NFTType={NFTType} NFTName={NFTName} />

			<PageMiddle>
				<PageMiddleLeft>
					{/* <img className="NFTImg" src={nftInfo.fileurl} alt="" /> */}
					<AutoStretchBaseWidthOrHeightImg
						src={nftInfo.fileurl}
						width={416}
						height={416}
					/>
				</PageMiddleLeft>
				<PageMiddleRight>
					<span className="NFTName">{nftInfo.itemname}</span>

					<div className="Row2">
						<div className="ShowOwner">
							<img src={icon_altAvatar} alt="" />
							<span className="str_Ownedby">Owned by</span>
							<Link to={"/"}>
								{nftInfo.ownername || "Anonymity"}
								{/* {ownerName} */}
							</Link>
						</div>

						<div className="SaleEndTime">
							<img src={icon_Clock} alt="" />
							<span className="SaleEndTimeText">
								Sale ends in 2 days
							</span>
						</div>
					</div>

					<span className="Description">
						Hyper Geography is a website artwork created in 2011.
						The website features hundreds of found images collaged
						in a looping grid. The source images were collected from
						other blogs on Tumblr. Blogs that had a particularly
						strong...
					</span>

					<Link className="Link_Readmore" to="#">
						Read more
					</Link>

					<span className="str_TopBid">Top Bid</span>

					<Dropdowns>
						<NFTInfoDropdown
							title="Offers"
							content={<OffersContent />}
						/>

						<NFTInfoDropdown
							title="Details"
							content={
								<DetailsContent
									generatorName={
										nftInfo.ownername || "Anonymity"
									}
								/>
							}
						/>

						<NFTInfoDropdown
							title="Token Info"
							content={
								<TokenInfoContent
									TokenID={nftInfo.id}
									Total={nftInfo.supply}
								/>
							}
						/>

						<NFTInfoDropdown
							title="Trading History"
							content={<TradingHistoryContent />}
						/>
					</Dropdowns>

					<div className="TopBidStatus">
						<span className="ETHPrice">
							{poolsInfo.token1 &&
								weiToNum(
									poolsInfo.amountTotal1,
									poolsInfo.token1.decimals
								)}{" "}
							{poolsInfo.token1 && poolsInfo.token1.symbol}
						</span>
						<span className="USDPrice">
							{poolsInfo.token1 &&
								`$ ${weiMul(
									poolsInfo.token1.price,
									weiToNum(
										poolsInfo.amountTotal1,
										poolsInfo.token1.decimals
									)
								)}`}
						</span>
					</div>

					<span className="BorderBottomGap"></span>

					<div className="ButtonGroup">
						{isLoading ? (
							<Button
								primary
								value={"Loading, Please Wait ..."}
								disabled={true}
							/>
						) : (
							<Button
								primary
								value={
									poolsInfo.status &&
									poolsInfo.status === "Live"
										? "Place Bid"
										: poolsInfo.status === "Filled"
										? "Sold Out"
										: "Loading Status ..."
								}
								disabled={poolsInfo.status !== "Live"}
								onClick={handelBid}
							/>
						)}
						{/* 英式拍 一口价 */}
						{poolsInfo.poolType === "English-Auction" && (
							<Button value="Buy New For 1 ETH ransfer" />
						)}
					</div>

					<div className="Gap"></div>

					<OffersTable />
				</PageMiddleRight>
			</PageMiddle>

			{/* <TradingHistory>
				<span className="str_TradingHistory">Trading History</span>
				<TradeTable />
			</TradingHistory> */}
		</Page>
	);
}

export default Buy;

const Page = styled.div`
	width: 1096px;
	margin: 0 auto 55px auto;

	display: grid;
	grid-template-rows: 93px 1fr;
	grid-template-areas:
		"BreadcrumbNav"
		"PageMiddle";
`;

const PageMiddle = styled.div`
	grid-area: PageMiddle;

	box-sizing: border-box;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);

	display: grid;
	grid-template-columns: 500px 540px;
	column-gap: 30px;
	grid-template-areas: "PageMiddleLeft PageMiddleRight";
`;

const PageMiddleLeft = styled.div`
	grid-area: PageMiddleLeft;

	display: grid;
	grid-template-rows: 1fr;
	grid-template-areas: "NFTImg";

	img.NFTImg {
		width: 500px;
		height: 500px;
	}
`;

/* const Description = styled.div`
	grid-area: Description;

	display: grid;
	grid-template-rows: 40px 49px;
	grid-template-areas:
		"DescriptionTitle"
		"DescriptionContent";

	span.description {
		font-family: IBM Plex Mono;
		font-style: normal;
		font-weight: 500;
		font-size: 12px;
		line-height: 16px;
		display: flex;
		align-items: end;
		color: #1f191b;
		opacity: 0.5;

		grid-area: DescriptionTitle;
        padding-top: 22px;
        padding-bottom: 14px;
	}

	span.descriptionContent {
		font-family: Helvetica Neue;
		font-style: normal;
		font-weight: normal;
		font-size: 16px;
		line-height: 19px;
		display: flex;
		align-items: center;
		color: #1f191b;

		grid-area: DescriptionContent;

        padding-top: 12px;
        padding-bottom: 21px;
	}
`; */

const Dropdowns = styled.div`
	grid-area: Dropdowns;
`;

const PageMiddleRight = styled.div`
	grid-area: PageMiddleRight;

	display: grid;
	grid-template-rows: 59px 28px 82px 49px 14px 64px 48px 32px 1fr;
	grid-template-areas:
		"NFTName"
		"Row2"
		"Description"
		"Link_Readmore"
		"str_TopBid"
		"TopBidPrice"
		"ButtonGroup"
		"Gap"
		"Dropdowns";

	span.NFTName {
		font-family: Optima;
		font-style: normal;
		font-weight: bold;
		font-size: 34px;
		line-height: 41px;
		color: #000000;

		grid-area: NFTName;

		padding-top: 7px;
		padding-bottom: 10px;
	}

	.Row2 {
		grid-area: Row2;
		display: grid;
		grid-template-areas: "ShowOwner SaleEndTime";
		grid-template-columns: min-content auto;
		column-gap: 16px;
		align-items: center;

		.ShowOwner {
			grid-area: ShowOwner;

			display: grid;
			grid-template-columns: 20px 74px auto;
			align-items: center;

			span.str_Ownedby {
				padding-left: 8px;

				font-family: Helvetica Neue;
				font-style: normal;
				font-weight: 500;
				font-size: 14px;
				line-height: 17px;
				display: flex;
				align-items: center;

				opacity: 0.4;
				width: 66px;
			}

			a {
				font-family: IBM Plex Mono;
				font-style: normal;
				font-weight: 500;
				font-size: 12px;
				line-height: 16px;
				display: flex;
				align-items: center;
				color: #124eeb;
				opacity: 0.8;

				margin-left: 6px;
			}
		}

		.SaleEndTime {
			grid-area: SaleEndTime;

			img {
			}

			span.SaleEndTimeText {
			}
		}
	}

	span.Description {
		font-family: Helvetica Neue;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 17px;
		color: #1f191b;
		opacity: 0.7;

		grid-area: Description;
		padding-top: 20px;
		padding-bottom: 8px;

		text-overflow: ellipsis;
	}

	.Link_Readmore {
		font-family: Helvetica Neue;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 17px;
		color: #0075ff;

		grid-area: Link_Readmore;
		padding-bottom: 32px;
	}

	span.str_TopBid {
		font-family: Helvetica Neue;
		font-style: normal;
		font-weight: bold;
		font-size: 13px;
		line-height: 16px;
		color: #000000;
		opacity: 0.6;

		grid-area: str_TopBid;
	}

	.TopBidStatus {
		grid-area: TopBidPrice;
		padding-top: 12px;
		padding-bottom: 20px;

		display: grid;
		grid-template-columns: auto auto;
		grid-template-areas: "ETHPrice USDPrice";
		justify-content: start;
		align-items: end;
		column-gap: 8px;

		span.ETHPrice {
			font-family: Optima;
			font-style: normal;
			font-weight: bold;
			font-size: 28px;
			line-height: 34px;
			color: #000000;

			grid-area: ETHPrice;
		}

		span.USDPrice {
			font-family: Helvetica Neue;
			font-style: normal;
			font-weight: 500;
			font-size: 16px;
			line-height: 130.5%;
			color: #1f191b;
			opacity: 0.4;

			grid-area: USDPrice;
		}
	}

	.BorderBottomGap {
		box-sizing: border-box;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);

		grid-area: BorderBottomGap;
	}

	.ButtonGroup {
		grid-area: ButtonGroup;

		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 20px;

		button {
			width: 315px;
			height: 48px;
		}
	}

	.Gap {
		grid-area: Gap;
	}
`;
