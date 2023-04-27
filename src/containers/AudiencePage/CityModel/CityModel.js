/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_CITIES_FIELD_KEY, BI_SUMMARY_FIELD_KEY } from 'aesirx-lib';

class CityModel {
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

  toCitiesTableTop = () => {
    const headerTable = ['txt_City', 'txt_views'];
    const accessor = [BI_CITIES_FIELD_KEY.CITY, BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          Cell: ({ cell, column }) =>
            column.id === BI_CITIES_FIELD_KEY.CITY ? (
              <div className={'px-15'}>{cell?.value ?? null}</div>
            ) : (
              <div className={'px-15 text-end'}>{cell?.value ?? null}</div>
            ),
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
        ?.filter((item) => {
          return item[BI_CITIES_FIELD_KEY.CITY];
        })
        .sort(
          (a, b) =>
            b[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS] - a[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]
        )
        .slice(0, 10);

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

export default CityModel;