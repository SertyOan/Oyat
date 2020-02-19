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
            var searchField = searchBox.appendChild(Helpers.Element.create('input', {
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
        var gridTemplateColumns = '';

        if (this.options.showLineNumber) {
            gridTemplateColumns += ' auto';

            this.elements.body.appendChild(Helpers.Element.create('div', {
                className: 'oyat-cell oyat-header',
                html: '<div class="oyat-wrapper">&nbsp;</div>'
            }));
        }

        for (var i = 0, l = this.options.columns.length; i < l; i++) {
            var column = this.options.columns[i];

            gridTemplateColumns += ' ' + column.width;

            var cell = this.elements.body.appendChild(Helpers.Element.create('div', {
                className: 'oyat-cell oyat-header'
            }));

            if (this.options.columns[i].sortBy) {
                var sortNode = cell.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-sort',
                    html: '&#8593;&#8595;'
                }));
                sortNode.addEventListener('click', function(column) {
                    if(this.exports.sortBy === column.sortBy) {
                        this.exports.sortOrder = this.exports.sortOrder === 'ASC' ? 'DESC' : 'ASC';
                    }
                    else {
                        this.exports.sortOrder = column.sortOrder && column.sortOrder === 'DESC' ? 'DESC' : 'ASC';
                    }

                    this.exports.sortBy = column.sortBy;
                    this.reload();
                }.bind(this, this.options.columns[i]));

                if (this.options.columns[i].sortBy == this.exports.sortBy) {
                    Helpers.Element.addClassName(sortNode, 'oyat-' + this.exports.sortOrder.toLowerCase());
                }
            }

            cell.appendChild(Helpers.Element.create('div', {
                className: 'oyat-wrapper',
                html: column.label ? Helpers.String.escapeHTML(column.label) : '&nbsp;'
            }));
        }

        Helpers.Element.setAttributes(this.elements.body, {
            style: 'grid-template-columns: ' + gridTemplateColumns
        });
    },
    __updateRows: function() {
        for (var i = 0, c = this.store.rows.length; i < c; i++) {
            var row = this.store.rows[i];
            var classes = i % 2 === 0 ? 'oyat-even' : 'oyat-odd';

            if (this.options.rowStyler) {
                classes += ' ' + this.options.rowStyler(row);
            }

            if (this.options.showLineNumber) {
                var lineNumber = this.options.usePagination ? (this.store.page - 1) * this.store.rowsPerPage + i + 1 : i + 1;
                var cellElement = this.elements.body.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-cell oyat-number ' + classes,
                    html: '<div class="oyat-wrapper">' + lineNumber + '</div>'
                }));
            }

            for (var j = 0, d = this.options.columns.length; j < d; j++) {
                var column = this.options.columns[j];

                var cellElement = this.elements.body.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-cell ' + classes
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

                cellElement.addEventListener('click', this.emit.bind(this, 'RowSelect', {
                    row: i,
                    record: row
                }));
            }
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
