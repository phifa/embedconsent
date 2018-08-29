import 'cookieconsent/src/cookieconsent';
import { embedconsent } from '@phijufa/embedconsent/src/embedconsent';
import './style.scss';

let cookiestatus;

// Initializing Cookieconsent
window.addEventListener('load', function() {
  window.cookieconsent.initialise(
    {
      palette: {
        popup: {
          background: '#3c404d',
          text: '#d6d6d6',
        },
        button: {
          background: 'transparent',
          text: '#8bed4f',
          border: '#8bed4f',
        },
      },
      type: 'opt-out',
      content: {
        message:
          'This site uses cookies for analytics and personalized content. It also embeds external third-party content. More information:  ',
        allow: 'Agree',
        deny: 'Decline',
        link: 'Privacy Statement',
        href: '#',
      },
      // If cookie has been set before
      onInitialise: function(status) {
        cookiestatus = status;
        embedconsent.rerender(cookiestatus);
      },
      // When Cookie status changes
      onStatusChange: function(status) {
        cookiestatus = status;
        embedconsent.rerender(cookiestatus);
      },
      // When revoking Cookie choise
      onRevokeChoice: function() {
        cookiestatus = 'deny';
        embedconsent.rerender(cookiestatus);
      },
    },
    // Make Popup accessible from outside
    function(popup) {
      embedconsent.init(popup, cookiestatus);
    }
  );
});
