Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function() {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});

function copyCode(codeblockId, element) {
    const code = document.querySelector(codeblockId);
    const text = code.innerText.replaceAll('\t', '').replaceAll('\n\n', '\n');

    navigator.clipboard.writeText(text);

    element.childNodes[0].classList.remove('hidden');
    setTimeout(() => element.childNodes[0].classList.add('hidden'), 1500);
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function mlx90640validate() {
    let h = document.getElementById('mlx90640-height').value;

    if (parseInt(h) < 0) {
        h = Math.abs(h);
    }

    if (h > 10000) {
        h = 10000;
    }

    document.getElementById('mlx90640-height').value = h;
}

function mlx90640calc() {
    const fov = parseInt(document.getElementById('mlx90640-fov').value);
    const h = parseInt(document.getElementById('mlx90640-height').value);
    const area = document.getElementById('mlx90640-area');
    const pixelsize = document.getElementById('mlx90640-pixelsize');

    let width, height;

    if (fov === 55) {
        width = Math.tan(Math.PI / 180 * 55 * 0.5) * h * 2;
        height = Math.tan(Math.PI / 180 * 35 * 0.5) * h * 2;
    } else if (fov === 110) {
        width = Math.tan(Math.PI / 180 * 110 * 0.5) * h * 2;
        height = Math.tan(Math.PI / 180 * 75 * 0.5) * h * 2;
    }

    const pixelWidth = width / 32;
    const pixelHeight = height / 24;

    area.innerText = `${width.toFixed(1)} cm x ${height.toFixed(1)} cm`;
    pixelsize.innerText = `${pixelWidth.toFixed(1)} cm x ${pixelHeight.toFixed(1)} cm`
}

function selectText(element) {
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
}

function scrollToLine(hash) {
    const [ codeblockId, n ] = hash.split('.L');
    const code = document.querySelector(codeblockId);
    const line = code.querySelector(`td.hljs-ln-line.hljs-ln-code[data-line-number="${n}"]`);

    selectText(line);

    window.location.hash = hash;

    line.scrollIntoView();
}

function scrollToElement(hash) {
    const element = document.querySelector(hash);

    window.location.hash = hash;

    element.scrollIntoView();
}

function scrollToTop() {
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    let autoplay = true;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            if (anchor.hash.match(/\.L\d+/)) {
                // we have a link to a code, scroll to line
                scrollToLine(anchor.hash);
            } else {
                scrollToElement(anchor.hash);
            }
        });
    });

    videos.forEach(video => {
        video.muted = true;
    });

    window.onscroll = function() {
        videos.forEach(video => {
            if (!isInViewport(video)) {
                video.pause();
            } else if (!video.playing && autoplay) {
                video.play().catch(error => {
                    autoplay = false;
                });
            }
        });
    };

    window.onblur = function() {
        videos.forEach(video => {
            video.pause();
        });
    };

    mlx90640calc();
});

window.addEventListener('load', e => {
    if (window.location.hash) {
        scrollToLine(window.location.hash);
    }
})
