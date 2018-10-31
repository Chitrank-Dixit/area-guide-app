import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const routeLog = new Mongo.Collection('routeLog');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('routeLog', function routesPublication() {
    return routeLog.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'routeLog.insert'(source, srcLat, srcLong, destination, desLat, desLong) {
    check(source, String);
    check(destination, String);
    

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    console.log("Entering data.....");
    routeLog.insert({
      source,
      srcLat,
      srcLong,
      destination,
      desLat,
      desLong,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'routeLog.remove'(routeLogId) {
    check(routeLogId, String);

    const route = routeLog.findOne(routeLogId);
    if (route.private && route.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    routeLog.remove(routeLogId);
  },
  'routeLog.setChecked'(routeLogId, setChecked) {
    check(routeLogId, String);
    check(setChecked, Boolean);

    const route = routeLog.findOne(routeLogId);
    if (route.private && route.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    routeLog.update(routeLogId, { $set: { checked: setChecked } });
  },
  'routeLog.setPrivate'(routeLogId, setToPrivate) {
    check(routeLogId, String);
    check(setToPrivate, Boolean);

    const route = routeLog.findOne(routeLogId);

    // Make sure only the task owner can make a task private
    if (route.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    routeLog.update(routeLogId, { $set: { private: setToPrivate } });
  },
});
