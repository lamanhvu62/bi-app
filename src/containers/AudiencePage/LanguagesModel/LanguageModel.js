/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_LANGUAGES_FIELD_KEY, BI_SUMMARY_FIELD_KEY } from 'aesirx-lib';

class LanguageModel {
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

  toLanguagesTableTop = () => {
    const headerTable = ['txt_language', 'txt_views'];
    const accessor = [BI_LANGUAGES_FIELD_KEY.LANG, BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          Cell: ({ cell, column }) =>
            column.id === BI_LANGUAGES_FIELD_KEY.LANG ? (
              <div className={'px-15'}>{cell?.value === '' ? 'Unknown' : cell?.value}</div>
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

export default LanguageModel;
