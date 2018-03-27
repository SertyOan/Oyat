import View from './UI/View.js';
import Helpers from './Helpers.js';

var Calendar = View.extend({
    __construct: function() {
        this.__parent();

        this.selection = false;
        this.addType('oyat-calendar');

        var node = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-year'
        }));
        node.appendChild(Helpers.Element.create('div', {
                className: 'oyat-previous',
                text: '<'
            }))
            .addEventListener('click', this.updateBy.bind(this, {
                year: -1,
                month: 0
            }));
        this.yearNode = node.appendChild(Helpers.Element.create('div', {
            className: 'oyat-text'
        }));
        node.appendChild(Helpers.Element.create('div', {
                className: 'oyat-next',
                text: '>'
            }))
            .addEventListener('click', this.updateBy.bind(this, {
                year: 1,
                month: 0
            }));

        var node = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-month'
        }));
        node.appendChild(Helpers.Element.create('div', {
                className: 'oyat-previous',
                text: '<'
            }))
            .addEventListener('click', this.updateBy.bind(this, {
                year: 0,
                month: -1
            }));
        this.monthNode = node.appendChild(Helpers.Element.create('div', {
            className: 'oyat-text'
        }));
        node.appendChild(Helpers.Element.create('div', {
                className: 'oyat-next',
                text: '>'
            }))
            .addEventListener('click', this.updateBy.bind(this, {
                year: 0,
                month: 1
            }));

        this.days = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-days'
        }));

        var weekdays = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        for (var i = 0; i < 7; i++) {
            this.days.appendChild(Helpers.Element.create('div'))
                .appendChild(Helpers.Element.create('abbr', {
                    title: weekdays[i],
                    text: weekdays[i][0]
                }));
        }

        this.boxes = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-boxes'
        }));
        this.updateTo(new Date().getFullYear(), new Date().getMonth());
    },
    updateBy: function(data) {
        var year = this.year + data.year;
        var month = this.month + data.month;

        if (month == 12) {
            month = 0;
            year++;
        } else if (month == -1) {
            month = 11;
            year--;
        }

        this.updateTo(year, month);
    },
    updateTo: function(year, month) {
        this.year = year;
        this.month = month;

        var monthes = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        Helpers.Element.setText(this.yearNode, this.year.toString());
        Helpers.Element.setText(this.monthNode, monthes[this.month]);

        var day = 1;
        Helpers.Element.setHTML(this.boxes, '');

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 7; j++) {
                var date = new Date(this.year, this.month, day);

                if (date.getDay() == j && date.getMonth() == this.month) {
                    var selection = {
                        date: this.year + '-' + (this.month < 9 ? '0' : '') + (this.month + 1) + '-' + (day < 10 ? '0' : '') + day,
                        day: day,
                        month: this.month + 1,
                        year: this.year
                    };

                    var box = this.boxes.appendChild(Helpers.Element.create('div', {
                        className: 'oyat-clickable',
                        text: day.toString()
                    }));
                    box.addEventListener('click', (function(box, selection) {
                        this.selection = selection;
                        this.updateTo(this.year, this.month);
                        this.emit('Select', selection);
                    }).bind(this, box, selection));

                    if (this.selection && this.selection.year == this.year && this.selection.month == this.month + 1 && this.selection.day == day) {
                        Helpers.Element.addClassName(box, 'oyat-selected');
                    }

                    day++;
                } else {
                    this.boxes.appendChild(Helpers.Element.create('div', {
                        html: '&nbsp;'
                    }));
                }
            }
        }
    }
});

export default Calendar;
