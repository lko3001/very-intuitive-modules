class ViMasonry extends HTMLElement {
    _colWidth = 300;
    _colCount = 1;
    _gap = 0;
    _cols = [];
    _items = [];
    _lastWidth = 0;
    _resizeTimeout = null;
    _isRefreshing = false;

    constructor() {
        super();
    }

    connectedCallback() {
        this._updateItems();
        this._colWidth = Number(this.getAttribute("col-width"));
        this._gap = Number(this.getAttribute("gap"));

        this.style.display = "grid";
        this.style.gridAutoFlow = "column";
        this.style.gridAutoColumns = "1fr";
        this.gap(this._gap);

        this._lastWidth = this.offsetWidth;
        this.refresh();

        const observer = new ResizeObserver((entries) => {
            const masonryEntry = entries.find((entry) => entry.target.tagName === "VI-MASONRY");
            if (!masonryEntry) return;

            const currentWidth = this.offsetWidth;
            if (currentWidth === this._lastWidth) return;

            this._lastWidth = currentWidth;

            if (this._resizeTimeout) {
                clearTimeout(this._resizeTimeout);
            }

            this._resizeTimeout = setTimeout(() => {
                this.refresh();
            }, 100);
        });

        observer.observe(this);
    }

    _updateItems() {
        this._items = Array.from(this.children);
        this._items = this._items.map((child) => (child.dataset.ignore ? Array.from(child.children) : child)).flat();
        this._items = this._items.filter((child) => window.getComputedStyle(child).display !== "none");
    }

    _updateUI() {
        this._updateItems();
        this._colCount = Math.floor((this.offsetWidth + this._gap) / (this._colWidth + this._gap));
        this._colCount = Math.max(this._colCount, 1);

        // remove all children
        while (this.children.length) {
            this.firstElementChild.remove();
        }

        // create as many columns as needed
        this._cols = [];
        for (let i = 0; i < this._colCount; i++) {
            const newCol = document.createElement("div");
            newCol.dataset.ignore = "true";
            newCol.style.display = "flex";
            newCol.style.flexDirection = "column";
            newCol.style.gap = this._gap + "px";
            this._cols.push(newCol);
        }

        // distribute children to the columns, and append the columns
        this._items.forEach((item, index) => {
            this._cols[index % this._colCount].appendChild(item);
        });
        this._cols.forEach((col) => this.appendChild(col));
    }

    refresh(customOptions = {}) {
        if (this._isRefreshing) return;
        this._isRefreshing = true;

        const defaults = {
            transition: true,
            gap: undefined,
            columnWidth: undefined,
        };
        const options = Object.assign(defaults, customOptions);

        this.gap(options.gap);
        this.columnWidth(options.columnWidth);

        if (document.startViewTransition && options.transition) {
            document
                .startViewTransition(() => {
                    this._updateUI();
                })
                .finished.finally(() => {
                    this._isRefreshing = false;
                });
        } else {
            this._updateUI();
            this._isRefreshing = false;
        }
    }

    gap(value) {
        if (typeof value === "undefined") return this._gap;
        this._gap = value;
        this.style.columnGap = `${this._gap}px`;
        return this;
    }

    columnWidth(value) {
        if (typeof value === "undefined") return this._colWidth;
        this._colWidth = value;
        return this;
    }
}

customElements.define("vi-masonry", ViMasonry);
