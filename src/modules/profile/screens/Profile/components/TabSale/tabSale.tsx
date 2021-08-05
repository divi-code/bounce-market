import { useQuery } from '@redux-requests/react';
import { BuyNFTRoutesConfig } from 'modules/buyNFT/BuyNFTRoutes';
import { UserRoleEnum } from 'modules/common/actions/queryAccountInfo';
import { NoItems } from 'modules/common/components/NoItems';
import {
  ProductCard,
  ProductCardSkeleton,
} from 'modules/common/components/ProductCard';
import { ProductCards } from 'modules/common/components/ProductCards';
import { ProfileInfo } from 'modules/common/components/ProfileInfo';
import { RoutesConfiguration } from 'modules/createNFT/Routes';
import { MarketRoutesConfig } from 'modules/market/Routes';
import { fetchMySale, IPoolNftItem } from 'modules/profile/actions/fetchSale';
import { TabItems as TabItemsComponent } from 'modules/profile/components/TabItems';
import { uid } from 'react-uid';
import { t } from 'modules/i18n/utils/intl';

export const TabSale = function () {
  const { data, loading } = useQuery<IPoolNftItem[]>({
    type: fetchMySale.toString(),
  });

  return (
    <TabItemsComponent>
      <ProductCards isLoading={loading}>
        {loading ? (
          <ProductCardSkeleton />
        ) : (
          data?.map(item => (
            <ProductCard
              id={item.tokenid}
              poolId={item.poolid || 0}
              auctionType={item.poolType}
              key={uid(item)}
              title={item.itemname}
              href={
                item.poolid && item.poolType
                  ? BuyNFTRoutesConfig.DetailsNFT.generatePath(
                      item.poolid,
                      item.poolType,
                    )
                  : ''
              }
              likes={item.likecount}
              isLike={item.isLike}
              price={item.poolid ? item.price : undefined}
              priceType={(data as any)?.tokenSymbol}
              copies={item.token_amount0}
              copiesBalance={item.swapped_amount0}
              MediaProps={{
                category: item.category,
                src: item.fileurl || 'xxx',
                objectFit: 'contain',
                loading: 'lazy',
              }}
              state={item.state}
              isOnSale
              profileInfo={
                <ProfileInfo
                  subTitle="Creator"
                  title={item.username}
                  users={[
                    {
                      name: item.username,
                      avatar: item.creatorurl,
                      verified: item?.identity === UserRoleEnum.Verified,
                    },
                  ]}
                />
              }
              toSale={RoutesConfiguration.PublishNft.generatePath(
                item.token0,
                item.tokenid,
              )}
              isCancelTimePut={item.openAt ? +item.openAt >= Date.now() : false}
              openAt={item.openAt}
              closeAt={item.closeAt}
            />
          ))
        )}
      </ProductCards>
      {!loading && data?.length === 0 && (
        <NoItems
          href={MarketRoutesConfig.Market.generatePath()}
          // import { t } from 'modules/i18n/utils/intl';
          title={t('profile.no-items.onSale-title')}
          descr={t('profile.no-items.onSale-description')}
        />
      )}
    </TabItemsComponent>
  );
};
