class RandomImage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `<style>img { width: 100%; display: block }</style>`;

        const width = this.randomInt();
        const height = this.randomInt();
        this.style.viewTransitionName = `img-${width}-${height}`;

        const img = document.createElement("img"); // Use document.createElement
        img.src = `https://unsplash.it/${width}/${height}`;
        this.shadowRoot.appendChild(img);
    }

    randomInt() {
        const min = 300;
        const max = 700;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

customElements.define("random-img", RandomImage);
