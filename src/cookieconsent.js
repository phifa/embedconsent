import "cookieconsent/src/cookieconsent";
import { embedconsent } from "./embedconsent";

// Global Settings
export let COOKIESTATUS = "unset";
export let banner;

// Initializing Cookieconsent
window.addEventListener("load", function() {
  embedconsent.init();
  window.cookieconsent.initialise(
    {
      palette: {
        popup: {
          background: "#3c404d",
          text: "#d6d6d6"
        },
        button: {
          background: "transparent",
          text: "#8bed4f",
          border: "#8bed4f"
        }
      },
      type: "opt-out",
      content: {
        message:
          "Diese Website benutzt Cookies und stellt Verbindungen zu Drittanbietern her. Dabei kann die IP Adresse übertragen werden. Weitere Informationen:  ",
        allow: "Zustimmen",
        deny: "Ablehnen",
        link: "Datenschutzerklärung",
        href: "#"
      },
      // If cookie has been set before
      onInitialise: function(status) {
        COOKIESTATUS = status;
        embedconsent.rerender();
      },
      // When Cookie status changes
      onStatusChange: function(status) {
        COOKIESTATUS = status;
        embedconsent.rerender();
      },
      // When revoking Cookie choise
      onRevokeChoice: function() {
        COOKIESTATUS = "deny";
        embedconsent.rerender();
      }
    },
    // Make Popup accessible from outside
    function(popup) {
      banner = popup;
    }
  );
});
