class ViMasonry extends HTMLElement {
    #colWidth = 0;
    #colCount = 1;
    #gap = 0;
    #cols = [];
    #items = [];
    #lastWidth = 0;
    #resizeTimeout = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#colWidth = Number(this.getAttribute("col-width"));
        this.#gap = Number(this.getAttribute("gap"));
        this.#items = Array.from(this.children);

        this.style.display = "grid";
        this.style.gridAutoFlow = "column";
        this.style.gridAutoColumns = "1fr";
        this.style.columnGap = `${this.#gap}px`;

        this.#lastWidth = this.offsetWidth;
        this.refresh();

        const observer = new ResizeObserver((entries) => {
            const masonryEntry = entries.find((entry) => entry.target.tagName === "VI-MASONRY");
            if (!masonryEntry) return;

            const currentWidth = this.offsetWidth;
            if (currentWidth === this.#lastWidth) return;

            this.#lastWidth = currentWidth;

            if (this.#resizeTimeout) {
                clearTimeout(this.#resizeTimeout);
            }

            this.#resizeTimeout = setTimeout(() => {
                this.refresh();
            }, 150);
        });

        observer.observe(this);
    }

    #updateUI() {
        this.#colCount = Math.max(Math.floor((this.offsetWidth + this.#gap) / (this.#colWidth + this.#gap)), 1);

        // remove all children
        while (this.children.length) {
            this.firstElementChild.remove();
        }

        // create as many columns as needed
        this.#cols = [];
        for (let i = 0; i < this.#colCount; i++) {
            const newCol = document.createElement("div");
            newCol.style.display = "flex";
            newCol.style.flexDirection = "column";
            newCol.style.gap = this.#gap + "px";
            this.#cols.push(newCol);
        }

        // distribute children to the columns, and append the columns
        this.#items.forEach((item, index) => {
            this.#cols[index % this.#colCount].appendChild(item);
        });
        this.#cols.forEach((col) => this.appendChild(col));
    }

    refresh(customOptions = {}) {
        const defaults = {
            transition: true,
            gap: undefined,
            columnWidth: undefined,
        };
        const options = Object.assign(defaults, customOptions);

        this.gap(options.gap);
        this.columnWidth(options.columnWidth);

        if (document.startViewTransition && options.transition) {
            document.startViewTransition(() => {
                this.#updateUI();
            });
        } else {
            this.#updateUI();
        }
    }

    gap(value) {
        if (typeof value == "undefined") return this.#gap;
        this.#gap = value;
        return this;
    }

    columnWidth(value) {
        if (typeof value == "undefined") return this.#colWidth;
        this.#colWidth = value;
        return this;
    }
}

customElements.define("vi-masonry", ViMasonry);
