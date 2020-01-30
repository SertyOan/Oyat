import View from '../UI/View.js';
import Helpers from '../Helpers.js';
import '../UI/GridView.css';

var GridView = View.extend({
    __construct: function(options) {
        this.__parent();

        this.options = {
            paging: false, // OR integer
            offset: 0,
            scrolling: false, // OR true
            search: false, // OR { label: null, value: null }
            refresh: false, // OR true
            itemsCount: false, // OR { legend: null }
            showLineNumber: false, // OR true
            showPagination: false,
            hideHeaders: false, // OR true
            columns: [], // each is { label: ?, field: ?, style: ?, view: ? }
            sort: {
                by: null,
                order: 'ASC'
            }
        };

        this.setOptions(options);

        this.exports = {
            search: '', // TODO set default search from options
            page: 1
        };

        if(this.options.sort.by) {
            this.exports.sortBy = this.options.sort.by;
            this.exports.sortOrder = this.options.sort.order;
        }

        this.addType('oyat-gridview');
        this.rowWidth = 0;

        window.addEventListener('resize', function() {
            this.rowWidth = 0;
            this.refresh();
        }.bind(this));
    },
    setStore: function(rows, options) {
        // NOTE store = { rows: [row, row...], page: #, records: # }
        // NOTE row = { formatter: function() }
        // TODO add checks on store

        if (!Array.isArray(rows)) {
            throw new Error('rows should be an array in Oyat/UI/GridView.setStore()');
        }

        this.store = {
            rows: rows,
            results: options && options.results ? options.results : rows.length,
            page: options && options.page ? options.page : 1
        };

        this.refresh();
    },
    refresh: function() {
        Helpers.Element.empty(this.elements.root);

        this.__updateToolbar();
        this.__updateBody();
        this.__updateHeaders();
        this.__updateRows();
    },
    __updateToolbar: function() {
        if (this.options.search || this.options.itemsCount || this.options.refreshButton || this.options.paging) {
            this.elements.toolbar = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-toolbar'
            }));
        }

        if (this.options.search) {
            var searchBox = this.elements.toolbar.appendChild(Helpers.Element.create('div', {
                className: 'oyat-search'
            }));
            searchBox.appendChild(Helpers.Element.create('input', {
                type: 'text',
                value: this.exports.search
            }));

            searchField.addEventListener('keyup', function(event) {
                if (event.keyCode == 13) {
                    this.exports.search = event.target.value;
                    this.reload();
                }
            }.bind(this));

            if (this.options.search.withButton) {
                var button = searchBox.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-search-button',
                    text: 'Search'
                }));
                button.addEventListener('click', function(event) {
                    this.exports.search = searchField.value;
                    this.reload();
                }.bind(this));
            }
        }

        if (this.options.itemsCount && this.options.itemsCount.legend) {
            this.elements.toolbar.appendChild(Helpers.Element.create('div', {
                className: 'oyat-legend',
                text: this.store.results + this.options.itemsCount.legend
            }));
        }

        if (this.options.refresh === true) {
            this.elements.toolbar.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-refresh',
                }))
                .addEventListener('click', this.reload.bind(this));
        }

        if (this.options.paging !== false) {
            this.updatePaging();
        }
    },
    __updateBody: function() {
        this.elements.body = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-body'
        }));
    },
    updatePaging: function() {
        var lastPage = Math.ceil(this.store.results / this.options.paging);

        this.elements.pager = this.elements.toolbar.appendChild(Helpers.Element.create('div', {
            className: 'oyat-pager'
        }));

        this.elements.pager.appendChild(Helpers.Element.create('div', {
                className: 'oyat-arrow',
                html: '&lt;&lt;'
            }))
            .addEventListener('click', function() {
                this.exports.page = 1;
                this.reload();
            }.bind(this));

        this.elements.pager.appendChild(Helpers.Element.create('div', {
                className: 'oyat-arrow',
                html: '&lt;'
            }))
            .addEventListener('click', function() {
                this.exports.page = Math.max(1, this.exports.page - 1);
                this.reload();
            }.bind(this));

        this.elements.pager.appendChild(Helpers.Element.create('div', {
            className: 'oyat-page',
            text: this.exports.page + '/' + lastPage
        }));

        this.elements.pager.appendChild(Helpers.Element.create('div', {
                className: 'oyat-arrow',
                html: '&gt;'
            }))
            .addEventListener('click', function() {
                this.exports.page = Math.min(lastPage, this.exports.page + 1);
                this.reload();
            }.bind(this));

        this.elements.pager.appendChild(Helpers.Element.create('div', {
                className: 'oyat-arrow',
                html: '&gt;&gt;'
            }))
            .addEventListener('click', function() {
                this.exports.page = lastPage;
                this.reload();
            }.bind(this));
    },
    __updateHeaders: function() {
        this.elements.header = this.elements.body.appendChild(Helpers.Element.create('div', {
            className: 'oyat-header'
        }));

        if (this.rowWidth == 0) {
            var gridWidth = this.elements.root.offsetWidth;

            if (this.options.showLineNumber) {
                this.rowWidth += 40;
                gridWidth -= 40;
            }

            for (var i = 0, l = this.options.columns.length; i < l; i++) {
                var column = this.options.columns[i];

                switch (typeof column.width) {
                    case 'number':
                        column.computedWidth = column.width;
                        break;
                    case 'string':
                        column.computedWidth = (column.width.match(/%/) ? parseInt(column.width, 10) * gridWidth / 100 : parseInt(column.width, 10));
                        break;
                    default:
                        column.computedWidth = 100;
                }

                this.rowWidth += column.computedWidth;
            }
        }

        if (this.options.showLineNumber) {
            this.elements.header.appendChild(Helpers.Element.create('div', {
                className: 'oyat-cell',
                style: 'width:40px', // TODO resize
                html: '<div class="oyat-wrapper">&nbsp;</div>'
            }));
        }

        for (var i = 0, l = this.options.columns.length; i < l; i++) {
            var column = this.options.columns[i];

            var cell = this.elements.header.appendChild(Helpers.Element.create('div', {
                className: 'oyat-cell',
                style: 'width:' + column.computedWidth + 'px'
            }));

            if (this.options.columns[i].sortBy) {
                var sortNode = cell.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-sort',
                    html: '&#8593;&#8595;'
                }));
                sortNode.addEventListener('click', function(sortBy) {
                    this.exports.sortBy = sortBy;
                    this.reload();
                }.bind(this, this.options.columns[i].sortBy));

                if (this.options.columns[i].sortBy == this.options.sort.by) {
                    Helpers.Element.addClassName(sortNode, 'oyat-' + this.options.sort.order);
                }
            }

            cell.appendChild(Helpers.Element.create('div', {
                className: 'oyat-wrapper',
                html: column.label ? Helpers.String.escapeHTML(column.label) : '&nbsp;'
            }));
        }

        this.elements.header.style.width = this.rowWidth + 'px';
    },
    __updateRows: function() {
        this.elements.rows = this.elements.body.appendChild(Helpers.Element.create('div', {
            className: 'oyat-rows'
        }));

        for (var i = 0, c = this.store.rows.length; i < c; i++) {
            var row = this.store.rows[i];
            var rowElement = this.elements.rows.appendChild(Helpers.Element.create('div', {
                className: 'oyat-row ' + (i % 2 === 0 ? 'oyat-even' : 'oyat-odd')
            }));

            rowElement.addEventListener('click', this.emit.bind(this, 'RowSelect', {
                row: i,
                record: row
            }));

            if (this.options.showLineNumber) {
                var cellElement = rowElement.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-cell oyat-number',
                    style: 'width:40px',
                    html: '<div class="oyat-wrapper">' + (this.options.usePagination ? (this.store.page - 1) * this.store.rowsPerPage + i + 1 : i + 1) + '</div>'
                }));
            }

            if (this.options.rowStyler) {
                Helpers.Element.addClassName(rowElement, this.options.rowStyler(row));
            }

            for (var j = 0, d = this.options.columns.length; j < d; j++) {
                var column = this.options.columns[j];

                var cellElement = rowElement.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-cell ' + (j % 2 === 0 ? 'oyat-even' : 'oyat-odd'),
                    style: 'width:' + column.computedWidth + 'px',
                }));

                if (column.formatter) {
                    Helpers.Element.setAttributes(cellElement, {
                        html: '<div class="oyat-wrapper">' + column.formatter(row) + '</div>'
                    });
                } else if (column.view) {
                    var subView = column.view(row);
                    cellElement.appendChild(subView.elements.root);
                }

                cellElement.addEventListener('click', this.emit.bind(this, 'CellSelect', {
                    row: i,
                    column: j,
                    record: row
                }));
            }

            rowElement.style.width = this.rowWidth + 'px';
        }
    },
    reload: function() {
        if (this.options.paging) {
            this.exports.pageSize = this.options.paging;
        }

        this.emit('Search', this.exports);
    }
});

export default GridView;
