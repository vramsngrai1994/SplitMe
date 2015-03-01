'use strict';

var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var mui = require('material-ui');
var Paper = mui.Paper;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;
var FontIcon = mui.FontIcon;
var DropDownMenu = mui.DropDownMenu;
var RadioButtonGroup = mui.RadioButtonGroup;
var RadioButton = mui.RadioButton;
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;

var DetailView = React.createClass({
  getInitialState: function() {
    return this.props.expense;
  },

  componentDidMount: function() {
    var self = this;

    setTimeout(function() {
      self.refs.description.focus();

      if ("production" === process.env.NODE_ENV) {
        cordova.plugins.Keyboard.show();
      }
    }, 0);
  },

  formatDate: function(date) {
    return moment(date).format('dddd, MMM D, YYYY');
  },

  onBlur: function() {
    if ("production" === process.env.NODE_ENV) {
      cordova.plugins.Keyboard.close();
    }
  },

  onChangeAmount: function(event) {
    console.log(event.target.validity.valid, event.target.value);

    if(event.target.value !== '' || event.target.validity.valid) {
      var amount = event.target.value.replace(/[^\d.,]/g,'');
      var foundSeparator = false;
      var numberOfDecimal = 0;

      for(var i = 0; i < amount.length; i++) {
        var charater = amount[i];

        if(charater.match(/[,.]/)) {
          if(!foundSeparator) {
            foundSeparator = true;
          } else {
            amount = amount.slice(0, i) + amount.slice(i + 1);
          }
        } else { // Digits
          if(foundSeparator) {
            numberOfDecimal++;
          }

          if(numberOfDecimal > 2) {
            amount = amount.slice(0, i);
            break;
          }
        }
      }

      this.setState({
        amount: amount
      });
    } else {
      this.refs.amount.getDOMNode().querySelector('input').value = '';
      this.refs.amount.setState({hasValue: this.state.amount});
    }
  },

  onTouchTapType: function() {
    this.refs.paidForDialog.show();
  },

  render: function () {
    var state = this.state;

    var menuItemsCurrency = [
       { payload: 'EUR', text: '€' },
       { payload: 'USD', text: '$' },
    ];

    var currencyIndex;

    _.each(menuItemsCurrency, function(item, index) {
      if(item.payload === state.currency) {
        currencyIndex = index;
      }
    });

    var date = moment(state.date, 'l').toDate();

    var menuItemsSplit = [
       { payload: 'equaly', text: 'Split equaly' },
       { payload: 'unequaly', text: 'Split unequaly' },
       { payload: 'shares', text: 'Split by shares' },
    ];

    var splitIndex;

    _.each(menuItemsSplit, function(item, index) {
      if(item.payload === state.split) {
        splitIndex = index;
      }
    });

    var paidBy;

    if(state.paidBy) {
      paidBy = <div className="lists-item" onTouchTap={this.onTouchTapType}>
        <div className="lists-item-tile-left"><img src="" /></div>
        <div className="lists-item-tile-contente">
          {state.paidBy.name}
        </div>
      </div>;
    } else {
      paidBy = <TextField hintText="Paid by" onTouchTap={this.onTouchTapType}/>;
    }

    return <Paper zDepth={1} innerClassName="expense-detail" rounded={false}>
      <TextField hintText="Description" ref="description" onBlur={this.onBlur}
        defaultValue={state.description} /><br />
      <div className="expense-detail-item expense-detail-amount">
        <FontIcon className="md-local-atm"/>
        <TextField hintText="0.00" type="number" ref="amount" value={this.state.amount} onChange={this.onChangeAmount}/>
        <DropDownMenu menuItems={menuItemsCurrency} selectedIndex={currencyIndex} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-schedule" />
        <DatePicker hintText="Date" defaultDate={date} formatDate={this.formatDate} />
      </div>
      <div className="expense-detail-item expense-detail-type">
        <FontIcon className="md-label" />
        <div className="expense-detail-item-content">
          Expense type
          <RadioButtonGroup
            name="shipSpeed"
            defaultSelected={state.type}>
              <RadioButton
                value="individual"
                label="Individual" />
             <RadioButton
                value="group"
                label="Group"
                disabled={false} />
          </RadioButtonGroup>
        </div>
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-person" />
        {paidBy}
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-equalizer" />
        <DropDownMenu menuItems={menuItemsSplit} selectedIndex={splitIndex} />
      </div>
      <div className="expense-detail-item">
        <FontIcon className="md-people" />
        <div className="expense-detail-item-content">
          For
        </div>
      </div>
      <Dialog title="Paid by" ref="paidForDialog">
        The actions in this window were passed in as an array of react objects.
      </Dialog>
    </Paper>;
  }
});

module.exports = DetailView;
