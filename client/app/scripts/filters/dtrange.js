'use strict';

/**
 * @ngdoc filter
 * @name clientApp.filter:dtrange
 * @function
 * @description
 * # dtrange
 * Filter in the clientApp.
 */
angular.module('clientApp')
  .filter('dtrange', function ($log) {
    return function (items, filters) {
      if(!filters.applied) {
        return items;
      }
      var res = [];
      for(var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemDate = new Date(item.consumption_date);
        var itemTime = new Date(item.consumption_time);
        var dateEnd = new Date(filters.dateEnd);
        dateEnd.setHours(23,59,59);
        var dateStart = new Date(filters.dateStart);
        dateStart.setHours(0,0,0);
        var dateTimeStart = new Date(filters.timeStart);
        var dateTimeEnd = new Date(filters.timeEnd);
        var timeStart = new Date(itemTime);
        timeStart.setHours(dateTimeStart.getHours(), dateTimeStart.getMinutes(), 0);
        var timeEnd = new Date(itemTime);
        timeEnd.setHours(dateTimeEnd.getHours(), dateTimeEnd.getMinutes(), 59);
        
        if(itemDate >= dateStart && itemDate <= dateEnd && itemTime >= timeStart && itemTime <= timeEnd) {
          res.push(item);
        }
      }
      return res;
    };
  });
