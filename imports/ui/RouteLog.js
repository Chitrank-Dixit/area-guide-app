import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { RouteLog } from '../api/routeLog.js';

// Task component - represents a single todo item
export default class RouteLog extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('routeLog.setChecked', this.props.route._id, !this.props.route.checked);
  }

  deleteThisTask() {
    Meteor.call('routeLog.remove', this.props.route._id);
  }

  togglePrivate() {
    Meteor.call('routeLog.setPrivate', this.props.route._id, ! this.props.route.private);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const routeClassName = classnames({
      checked: this.props.route.checked,
      private: this.props.route.private,
    });

    return (
      <li className={routeClassName}>
        <button className="delete" onClick={this.deleteThisRoute.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={!!this.props.route.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.route.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">
          <strong>{this.props.route.username}</strong>: {this.props.route.source}
          to {this.props.route.destination}

        </span>
      </li>
    );
  }
}
