/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import DashboardStore from './DashboardStore/DashboardStore';
import DashboardViewModel from './DashboardViewModels/DashboardViewModel';
import { DashboardViewModelContextProvider } from './DashboardViewModels/DashboardViewModelContextProvider';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import Dashboard from './Dashboard';

const DashboardContainer = observer(
  class DashboardContainer extends Component {
    dashboardStore = null;
    dashboardViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.dashboardStore = new DashboardStore();
      this.dashboardViewModel = new DashboardViewModel(this.dashboardStore, this.biListViewModel);
    }

    componentDidMount = () => {
      // const location = history.location;
      // WP or Joomla
      // if (location.pathname === '/wp-admin/admin.php') {
      //   const search = {
      //     ...queryString.parse(location.search),
      //     ...{ domain: this.biListViewModel.activeDomain },
      //   };
      //   history.push({
      //     ...location,
      //     ...{ search: queryString.stringify(search) },
      //   });
      // } else {
      //   history.push(`${this.biListViewModel.activeDomain}`);
      // }
      // history.push(`${this.biListViewModel.activeDomain}`);
    };
    render() {
      return (
        <DashboardViewModelContextProvider viewModel={this.dashboardViewModel}>
          <Dashboard {...this.props} />
        </DashboardViewModelContextProvider>
      );
    }
  }
);

export default withTranslation('common')(withRouter(withBiViewModel(DashboardContainer)));
