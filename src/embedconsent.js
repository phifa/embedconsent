import getVideoId from "get-video-id";
import { removeUndefined, extend } from "./util";

/**
 * Embedconsent module
 * @module embedconsent
 * @requires getVideoId, banner, cookiestatus
 */
class Embedconsent {
  constructor(element, options, banner) {
    // Set properties and query the DOM
    this.element = element;
    this.options = extend(Embedconsent.defaults, removeUndefined(options));
    this.banner = banner;
    this.embedconsentOverlay = this.element.querySelector(
      "[data-embedconsent-overlay]"
    );
    this.embedconsentRevokebutton = this.element.querySelector(
      "[data-embedconsent-revokebutton]"
    );
    this.embedconsentExternbutton = this.element.querySelector(
      "[data-embedconsent-externbutton]"
    );
    this.embedconsentIframecontainer = this.element.querySelector(
      "[data-embedconsent-iframecontainer]"
    );
    // Attach EventListeners
    this._events();
    // Render HTML
    this.render();
    // Log instance
    console.info(
      `%cEmbedconsent Object was created: \n%c${this.element.dataset.src.substring(
        0,
        40
      )}...`,
      "background: #222; color: #bada55; font-weight: bold;",
      "background: #eee; color: #222; font-style: italic;"
    );
  }

  /**
   * Adds event handlers for buttons and and overlay
   * @private
   */
  _events() {
    const obj = this;
    // Button: Open External Link
    this.embedconsentExternbutton.addEventListener("click", function() {
      const { id, service } = getVideoId(obj.options.src);
      let url;
      if (obj.options.link) {
        url = obj.options.link;
      } else {
        if (service === "youtube") {
          url = `https://www.youtube.com/watch?v=${id}`;
        } else if (service === "vimeo") {
          url = `https://vimeo.com/${id}`;
        } else if (obj.options.src.includes("maps")) {
          alert("Please provide a data-link in your code.");
        } else {
          alert("Embed service not supported");
        }
      }
      if (url) window.open(url, "_blank");
    });
    // Button: Revoke Consent
    this.embedconsentRevokebutton.addEventListener("click", function() {
      obj.banner.element.classList.add("embedconsent__ccbanner--shake");
      setTimeout(() => {
        obj.banner.element.classList.remove("embedconsent__ccbanner--shake");
      }, 500);
      obj.banner.revokeChoice();
    });
    // Window: Set Overlay Size when Screen is resized
    window.addEventListener("resize", function() {
      obj._setOverlaySize();
    });
  }

  /**
   * Show Element
   * @param {Object} elem
   * @private
   */
  _show(elem) {
    elem.style.display = "block";
  }

  /**
   * Hide Element
   * @param {Object} elem
   * @private
   */
  _hide(elem) {
    elem.style.display = "none";
  }

  /**
   * Remove Element
   * @param {Object} elem
   * @private
   */
  _remove(elem) {
    elem.innerHTML = "";
    this._hide(elem);
  }

  /**
   * Calulate and Set the Size of the overlay
   * @private
   */
  _setOverlaySize() {
    const overlayWidth = this.embedconsentOverlay.offsetWidth;
    const height = overlayWidth / (this.options.width / this.options.height);
    if (overlayWidth > 500) {
      this.embedconsentOverlay.style.height = `${parseInt(height)}px`;
    } else {
      this.embedconsentOverlay.style.height = `auto`;
    }
  }

  /**
   * Create the iFrame
   * @private
   */
  _createIframe() {
    const iframe = document.createElement("iframe");
    iframe.width = this.options.width;
    iframe.height = this.options.height;
    iframe.className = "embedconsent__iframe";
    iframe.src = `${this.options.src}?autoplay=0`;
    iframe.frameBorder = 0;
    iframe.setAttribute("allow", "autoplay; encrypted-media");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("webkitallowfullscreen", "true");
    iframe.setAttribute("mozallowfullscreen", "true");
    this.embedconsentIframecontainer.appendChild(iframe);
  }

  /**
   * Render HTML
   */
  render(cookiestatus) {
    if (cookiestatus === "allow") {
      this._createIframe();
      this._hide(this.embedconsentOverlay);
      this._show(this.embedconsentIframecontainer);
    } else {
      this._show(this.embedconsentOverlay);
      this._setOverlaySize();
      this._remove(this.embedconsentIframecontainer);
    }
  }
}

/**
 * Set Defaults for an embedconsent instance
 */
Embedconsent.defaults = {
  /**
   * Source of Embedconsent
   * @option
   * @type {string}
   * @default "https://www.youtube.com/embed/xGmXxpIj6vs"
   */
  src: "https://www.youtube.com/embed/xGmXxpIj6vs",
  /**
   * Width of Embedconsent
   * @option
   * @type {number}
   * @default 100
   */
  width: 560,
  /**
   * Height of Embedconsent
   * @option
   * @type {number}
   * @default 100
   */
  height: 315
};

/**
 * @public
 * Make init and rerender functions available
 */
let objects = [];
export const embedconsent = {
  init: function(banner) {
    const dataEmbedconsents = Array.from(
      document.querySelectorAll("[data-embedconsent]")
    );
    dataEmbedconsents.forEach(dataEmbedconsent => {
      objects.push(
        new Embedconsent(
          dataEmbedconsent,
          {
            src: dataEmbedconsent.dataset.src
              ? dataEmbedconsent.dataset.src
              : undefined,
            link: dataEmbedconsent.dataset.link
              ? dataEmbedconsent.dataset.link
              : undefined,
            width: dataEmbedconsent.dataset.width
              ? Number(dataEmbedconsent.dataset.width)
              : undefined,
            height: dataEmbedconsent.dataset.height
              ? Number(dataEmbedconsent.dataset.height)
              : undefined
          },
          banner
        )
      );
    });
  },
  rerender: function(cookiestatus) {
    objects.forEach(object => {
      object.render(cookiestatus);
    });
  }
};
