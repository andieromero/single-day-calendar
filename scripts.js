/*
Author: Andriana Romero
Description: Submission for SAP Coding Challenge - Single Day calendar
Date: 12/12/16
*/

// one global object for all calendar attributes and functions
// bind "this" to the this global object
var DayCalendarChallenge = DayCalendarChallenge || {
  events: [], //sorted events with positioning/physical attributes
  // collisions: [], //
  columns: [], // stores max end time at each column i.e. columns[0] = 500
  build: function(events){

    // max-heap by start time
    this.sort(events);

    // transform array by augmenting event object with physical attributes
    this.events = events.map(function(event, index, array){
        event.height = event.end - event.start; // 1px to 1min
        event.width = 600;
        event.column = 0;
        event.collisions = []; // adjacency list of all collisions
        event.visited = false; // check if event properties been set
        return event;
    });

    this.columns[events[0].end]; //initialize 0th column max to first event's end time

    // populate adjacency list of all collisions
    this.findCollisions(this.events);

    // BFS to update width and columns
    this.setWidthsandColumns(this.events);

    // inject into HTML
    this.plotEvents(this.events);

    this.events.forEach(function(event, index){
      console.log(event.start + " : " + event.end);
      console.log(event.column);
      console.log(event.width);
    });
  },

  findCollisions: function(events) {
    // for each event
    for (var i=0; i<events.length; i++){
      var target = events[i];
      for (var j=i+1; j<events.length; j++){
        // compare each event to events after it
        var current = events[j];
        // push to adjacency list if collision
        if (current.start < target.end){
          target.collisions.push(current);
          current.collisions.push(target);
        }
        else {
          break;
        }
      }
    }
  },
  setWidthsandColumns: function(events) {
    // BFS
    for(var i=0; i<events.length; i++){
      var target = events[i];
      // iterate through adjacency list
      for(var j=0; j<target.collisions.length; j++){
        target.visited = true;
        var current = target.collisions[j];

        // adj list mapped by end times
        var arrEndTimes = target.collisions.map(function(event,index){
          return event.end;
        });
        // find the min event in adjlist and save the index
        var eventMinTime = Math.min.apply(Math, arrEndTimes);
        var eventMinTimeIndex = arrEndTimes.indexOf(Math.min.apply(Math, arrEndTimes));

        // break if event already visited in BFS
        if(current.visited == true) {}
        // can the event fit below an existing one
        else if (eventMinTime <= current.start){
          current.width = target.collisions[eventMinTimeIndex].width;
          current.column = target.collisions[eventMinTimeIndex].column;
        }
        // if it can't fit, increase the columns and widths
        else {
          current.width = target.width = target.width  / 2;
          // target.visited = true;
          if(current.visited == false){
            current.column = j + 1;
          }
        }
      }
    }
  },
  plotEvents: function(events){
    var eventsContainer = document.getElementsByClassName("events")[0];
    eventsContainer.innerHTML = "";
    events.forEach(function(event){
        eventsContainer.innerHTML += "<div style='width:" + event.width +
          "px; height:" + event.height + "px; position: absolute; top:" +
          event.start + "px; left:" + (event.column*event.width+10) +
          "px;'><h2>Sample Item</h2><p>Sample Location</p></div>";
    });
  },
  // sort given array by start times
  sort: function(events){
    events.sort(function(eventA, eventB){ // compare function sort by start
      if (eventA.start > eventB.start) return 1;
      if (eventA.start < eventB.start) return -1;
      // start times must equal, so sort by end times
      if (eventA.end > eventB.end) return 1;
      if (eventA.end < eventB.start) return -1;
    });
  }
};

/* Given an array of events build a day calendar such that not events overlap
 * Invoke from the console.
*/
function layOutDay(events) {
  DayCalendarChallenge.build(events);
  console.log(DayCalendarChallenge.events);
};
// Submission Test Case
var testcase1 = [ {start: 30, end: 150}, // 9:30 - 11:30
                  {start: 540, end: 600}, // 6:00 - 7:00
                  {start: 560, end: 620}, // 6:20 - 7:20
                  {start: 610, end: 670}]; // 7:10 - 8:10

var testcase2 = [ {start: 30, end: 150}, //[A]
                  {start: 210, end: 330}, //[B]: C, D, E
                  {start: 240, end: 300}, //[C]: B, D
                  {start: 270, end: 480}, //[D]: B, C, E, F
                  {start: 315, end: 420}, //[E]: B, D
                  {start: 420, end: 720}]; //[F]: D

var testcase3 = [ {start: 30, end: 150}, //[0] 9:30 - 11:30,
                  {start: 142, end: 533 },       //[1] 5:00 - 6:10, collide
                  {start: 540, end: 600}, //[2] 6:00 - 7:00,
                  {start: 560, end: 620}, //[3] 6:20 - 7:20,
                  {start: 610, end: 670}]; //[4] 7:10 - 8:10,




// Invoke initial test Case
layOutDay(testcase1);
// layOutDay(testcase2);




// Pseudocode
/*
1. Sort events array by start and end
2. Create an event array with these attributes
     - height:  (end - start)px
     - width: 600 / # of overlapping elements
     - # of overlappting elements: helper function
     - position: relative to top, start in px
     - adjacency list of all collision elements
3. Build the event table iterate through events in event array
    - BFS
    - divide / 2 for every collision and update all events in adj list
    - if there is room to put element below another, don't update width



*/
