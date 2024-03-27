/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { history, notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import FlowListModel from '../FlowListModel/FlowListModel';
import queryString from 'query-string';
class FlowListListViewModel {
  countriesStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  countriesTableData = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  dataFilterFlowList = {};
  constructor(countriesStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.countriesStore = countriesStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter) => {
    this.getFlowList(dataFilter, dateFilter);
  };

  getFlowList = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'start', 'sort_direction[]': 'desc' }
  ) => {
    this.status = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.dataFilter = {
      page_size: '20',
      ...this.dataFilter,
      ...dataFilter,
      ...this.sortBy,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.countriesStore.getFlowList(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.countriesStore.getFlowList(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    let dateRangeFilter = {
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterFlowList = async (dataFilter) => {
    const location = history.location;
    this.status = PAGE_STATUS.LOADING;

    this.dataFilterFlowList = { ...this.dataFilter, ...dataFilter };
    this.globalStoreViewModel.dataFilter = { pagination: this.dataFilterFlowList?.page };

    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.countriesStore.getFlowList(
      this.dataFilterFlowList,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
    if (dataFilter?.page) {
      const search = {
        ...queryString.parse(location.search),
        ...{ pagination: dataFilter?.page },
      };
      window.history.replaceState('', '', `/visitors/flow?${queryString.stringify(search)}`);
    }
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnCountriesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.status = PAGE_STATUS.READY;
        const transformData = new FlowListModel(data.list, this.globalStoreViewModel);
        this.countriesTableData = {
          list: transformData,
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default FlowListListViewModel;
