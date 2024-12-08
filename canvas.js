const canvases = document.querySelectorAll("canvas");

canvases.forEach((canvas) => {
    const image = canvas.getAttribute("data-image");

    const sandbox = new GlslCanvas(canvas);
    sandbox.load(frag);
    sandbox.setUniform("image", image);
    sandbox.setUniform("seed", Math.random());

    const sizer = function () {
        const w = canvas.parentNode.clientWidth;
        const h = canvas.parentNode.clientHeight;
        const dpi = window.devicePixelRatio;

        canvas.width = w * dpi;
        canvas.height = h * dpi;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
    };

    sizer();
    window.addEventListener("resize", function () {
        sizer();
    });
});
