/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import moment from 'moment';
import {
  BI_BROWSERS_FIELD_KEY,
  BI_DEVICES_FIELD_KEY,
  BI_SUMMARY_FIELD_KEY,
  BI_VISITORS_FIELD_KEY,
  Helper,
  enumerateDaysBetweenDates,
  env,
} from 'aesirx-lib';
import { Image } from 'react-bootstrap';

class DashboardModel {
  data = [];
  globalViewModel = null;
  constructor(entity, globalViewModel) {
    if (entity) {
      this.data = entity ?? [];
      this.globalViewModel = globalViewModel;
    }
  }

  toRaw = () => {
    return this.data;
  };

  toAreaChart = () => {
    const twelveMonth = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dateRange = enumerateDaysBetweenDates(
      this.globalViewModel?.dateFilter?.date_start,
      this.globalViewModel?.dateFilter?.date_end
    );

    const date = dateRange.map((date) => {
      const filterDate = this.data.find(
        (_item) => moment(_item.date).format('YYYY-MM-DD') === date
      );
      return {
        name: date && moment(date, 'YYYY-MM-DD').format('MM-DD'),
        visits: filterDate?.[BI_VISITORS_FIELD_KEY.VISITS] ?? 0,
        page_views: filterDate?.[BI_VISITORS_FIELD_KEY.TOTAL_PAGE_VIEWS] ?? 0,
      };
    });

    const month = twelveMonth.map((month, index) => {
      const filterMonthDate = this.data.filter((_item) => moment(_item?.date).month() === index);
      let totalVisitorCount = 0;
      let totalPageViewCount = 0;
      if (filterMonthDate) {
        totalVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_VISITORS_FIELD_KEY.VISITS],
          0
        );
        totalPageViewCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_VISITORS_FIELD_KEY.TOTAL_PAGE_VIEWS],
          0
        );
      }

      return {
        name: month,
        visits: totalVisitorCount,
        page_views: totalPageViewCount,
      };
    });
    return [{ visitors: month }, { visitors: date }];
  };

  getFilterName = () => {
    return [{ label: 'Visitors', value: 'visitors' }];
  };

  toBrowsersTableTop = () => {
    const headerTable = ['txt_browser', 'txt_visitors'];
    const accessor = [BI_BROWSERS_FIELD_KEY.BROWSER_NAME, BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_BROWSERS_FIELD_KEY.BROWSER_NAME
              ? 250
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
              ? 220
              : 170,
          Cell: ({ cell, column }) => {
            let browserImg = '';
            switch (cell?.value) {
              case 'Chrome':
                browserImg = '/assets/images/chrome.svg';
                break;
              case 'Safari':
                browserImg = '/assets/images/safari.svg';
                break;
              case 'Firefox':
                browserImg = '/assets/images/firefox.svg';
                break;
              case 'Microsoft Edge':
                browserImg = '/assets/images/microsoft_edge.svg';
                break;
              case 'Opera':
                browserImg = '/assets/images/opera.svg';
                break;
              case 'Samsung Internet for Android':
                browserImg = '/assets/images/samsung_browser.svg';
                break;
              case 'Googlebot':
                browserImg = '/assets/images/google_bot.svg';
                break;
              case 'Yandex Browser':
                browserImg = '/assets/images/yandex_browser.svg';
                break;
            }
            return (
              <>
                {column.id === BI_BROWSERS_FIELD_KEY.BROWSER_NAME ? (
                  <div className={'d-flex align-items-center'}>
                    {browserImg && (
                      <Image
                        className={`me-12px`}
                        style={{ width: 22, height: 22 }}
                        src={env.PUBLIC_URL + browserImg}
                        alt={'icons'}
                      />
                    )}
                    {cell?.value === '' ? 'Unknown' : cell?.value}
                  </div>
                ) : (
                  <div className={' text-end'}>{Helper.numberWithCommas(cell?.value) ?? null}</div>
                )}
              </>
            );
          },
        };
      });
      const data = this.data
        ?.map((item) => {
          return {
            ...item,
            ...accessor
              .map((i) => {
                return {
                  [i]: item[i],
                };
              })
              .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
          };
        })
        ?.sort(
          (a, b) =>
            b[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS] - a[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]
        );

      return {
        header,
        data: data,
      };
    } else {
      return {
        header: [],
        data: [],
      };
    }
  };

  toDevicesTableTop = () => {
    const headerTable = ['txt_device', 'txt_visitors'];
    const accessor = [BI_DEVICES_FIELD_KEY.DEVICE, BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_DEVICES_FIELD_KEY.DEVICE
              ? 250
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
              ? 220
              : 170,
          Cell: ({ cell, column }) => {
            return (
              <>
                {column.id === BI_DEVICES_FIELD_KEY.DEVICE ? (
                  <div className={'d-flex align-items-center text-capitalize'}>
                    {cell?.value === '' ? 'Unknown' : cell?.value}
                  </div>
                ) : (
                  <div className={' text-end'}>{Helper.numberWithCommas(cell?.value) ?? null}</div>
                )}
              </>
            );
          },
        };
      });
      const data = this.data
        ?.map((item) => {
          return {
            ...item,
            ...accessor
              .map((i) => {
                return {
                  [i]: item[i],
                };
              })
              .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
          };
        })
        ?.sort(
          (a, b) =>
            b[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS] - a[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]
        );

      return {
        header,
        data: data,
      };
    } else {
      return {
        header: [],
        data: [],
      };
    }
  };
}

export default DashboardModel;
