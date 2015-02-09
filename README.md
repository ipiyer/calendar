# fb-calender-puzzle
Given a list of start and end times, it uses [interval tree](http://en.wikipedia.org/wiki/Interval_tree) to display the events in the calendar. Event are displayed in way that they don't overlap and uses the max available width.

### Install & test
```js
npm install
```

```js
grunt test 
```
### Solution
The challange is to use max available space for a given event. This solution is fairly simple and straighforward:

- Use Interval tree to find overlapping events for every input event.
- Compute width by substrating rendered width from total width and divde that event to render.
- For every event scan from left 0 to find a hole to fit the event.

#### Demo

[fb-calendar-puzzle.herokuapp.com](http://fb-calendar-puzzle.herokuapp.com)

