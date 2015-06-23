'use strict';

var React = require('react');
var AppCanvas = require('material-ui/lib/app-canvas');
var AppBar = require('material-ui/lib/app-bar');
var Tabs = require('material-ui/lib/tabs/tabs');
var Tab = require('material-ui/lib/tabs/tab');
var IconButton = require('material-ui/lib/icon-button');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var ExpenseList = require('Main/Expense/List');
var MainActionButton = require('Main/MainActionButton');
var Balance = require('./Balance');
var Debts = require('./Debts');
var action = require('./action');

var styles = {
  appBar: {
    flexWrap: 'wrap',
  },
  icon: {
    color: '#fff',
  },
  tabs: {
    width: '100%',
  },
  content: {
    paddingTop: 104,
  },
};

var AccountDetail = React.createClass({
  propTypes: {
    page: React.PropTypes.string.isRequired,
    account: React.PropTypes.object.isRequired,
  },
  mixins: [
    EventListener,
  ],
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton: function() {
    action.navigateHome();
  },
  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    action.tapAddExpenseForAccount(this.props.account);
  },
  onTouchTapSettings: function (event) {
    event.preventDefault();
    action.tapSettings();
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    action.navigateHome();
  },
  onChangeTabs: function (index) {
    switch (index) {
      case 0:
        action.tapExpenses();
        break;

      case 1:
        action.tapBalance();
        break;

      case 2:
        action.tapDebts();
        break;
    }
  },
  render: function () {
    var account = this.props.account;
    var layout;

    switch(this.props.page) {
      case 'accountDetail':
        layout = <ExpenseList expenses={account.expenses} />;
        break;
      case 'accountDetailBalance':
        layout = <Balance members={account.members} />;
        break;
      case 'accountDetailDebts':
        layout = <Debts members={account.members} />;
        break;
    }

    var appBarRight = <IconButton iconClassName="md-settings" iconStyle={styles.icon}
      onTouchTap={this.onTouchTapSettings} />;

    return <AppCanvas>
      <AppBar title={this.props.account.name}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose}
        iconElementRight={appBarRight} style={styles.appBar}
        className="testAppBar">
        <Tabs onChange={this.onChangeTabs} style={styles.tabs}>
          <Tab label={polyglot.t('expenses')} />
          <Tab label={polyglot.t('balance')} />
          <Tab label={polyglot.t('debts')} />
        </Tabs>
      </AppBar>
      <div className="app-content-canvas" style={styles.content}>
        {layout}
      </div>
      <MainActionButton onTouchTap={this.onTouchTapAddExpense} />
    </AppCanvas>;
  },
});

module.exports = AccountDetail;
