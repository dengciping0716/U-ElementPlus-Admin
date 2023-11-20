/**
 * 自动重连websocket
 */

class ReconnectingWebSocket {
  constructor(url, protocols, options) {
    // Default settings
    var settings = {
      /** Whether this instance should log debug messages. */
      debug: false,

      /** Whether or not the websocket should attempt to connect immediately upon instantiation. */
      automaticOpen: true,

      /** The number of milliseconds to delay before attempting to reconnect. */
      reconnectInterval: 3000,
      /** The maximum number of milliseconds to delay a reconnection attempt. */
      maxReconnectInterval: 30000,
      /** The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. */
      reconnectDecay: 1.5,

      /** The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. */
      timeoutInterval: 5000,

      /** The maximum number of reconnection attempts to make. Unlimited if null. */
      maxReconnectAttempts: null,

      /** The binary type, possible values 'blob' or 'arraybuffer', default 'blob'. */
      binaryType: 'blob'
    };
    if (!options) {
      options = {};
    }

    // Overwrite and define settings with options if they exist.
    for (var key in settings) {
      if (typeof options[key] !== 'undefined') {
        this[key] = options[key];
      } else {
        this[key] = settings[key];
      }
    }

    // These should be treated as read-only properties

    /** The URL as resolved by the constructor. This is always an absolute URL. Read only. */
    this.url = url;

    /** The number of attempted reconnects since starting, or the last successful connection. Read only. */
    this.reconnectAttempts = 0;

    /**
     * The current state of the connection.
     * Can be one of: WebSocket.CONNECTING, WebSocket.OPEN, WebSocket.CLOSING, WebSocket.CLOSED
     * Read only.
     */
    this.readyState = WebSocket.CONNECTING;

    /**
     * A string indicating the name of the sub-protocol the server selected; this will be one of
     * the strings specified in the protocols parameter when creating the WebSocket object.
     * Read only.
     */
    this.protocol = null;

    // Private state variables

    this.ws = null;
    this.forcedClose = false;
    this.timedOut = false;
    var eventTarget = document.createElement('div');

    // Wire up "on*" properties as event handlers

    eventTarget.addEventListener('open', function(event) {
      this.onopen(event);
    });
    eventTarget.addEventListener('close', function(event) {
      this.onclose(event);
    });
    eventTarget.addEventListener('connecting', function(event) {
      this.onconnecting(event);
    });
    eventTarget.addEventListener('message', function(event) {
      this.onmessage(event);
    });
    eventTarget.addEventListener('error', function(event) {
      this.onerror(event);
    });

    // Expose the API required by EventTarget

    this.addEventListener = eventTarget.addEventListener.bind(eventTarget);
    this.removeEventListener = eventTarget.removeEventListener.bind(eventTarget);
    this.dispatchEvent = eventTarget.dispatchEvent.bind(eventTarget);

    // Whether or not to create a websocket upon instantiation
    if (this.automaticOpen == true) {
      this.open(false);
    }

    this.eventTarget = eventTarget;
  }

  open(reconnectAttempt) {
    this.ws = new WebSocket(this.url, this.protocols || []);
    this.ws.binaryType = this.binaryType;

    if (reconnectAttempt) {
      if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
        return;
      }
    } else {
      this.eventTarget.dispatchEvent(new CustomEvent('connecting'));
      this.reconnectAttempts = 0;
    }

    if (this.debug || ReconnectingWebSocket.debugAll) {
      console.debug('ReconnectingWebSocket', 'attempt-connect', this.url);
    }

    var localWs = this.ws;
    var timeout = setTimeout(function() {
      if (this.debug || ReconnectingWebSocket.debugAll) {
        console.debug('ReconnectingWebSocket', 'connection-timeout', this.url);
      }
      this.timedOut = true;
      localWs.close();
      this.timedOut = false;
    }, this.timeoutInterval);

    this.ws.onopen = function(event) {
      clearTimeout(timeout);
      if (this.debug || ReconnectingWebSocket.debugAll) {
        console.debug('ReconnectingWebSocket', 'onopen', this.url);
      }
      this.protocol = this.ws.protocol;
      this.readyState = WebSocket.OPEN;
      this.reconnectAttempts = 0;
      var e = new CustomEvent('open');
      e.isReconnect = reconnectAttempt;
      reconnectAttempt = false;
      this.eventTarget.dispatchEvent(e);
    };

    this.ws.onclose = function(event) {
      clearTimeout(timeout);
      this.ws = null;
      if (this.forcedClose) {
        this.readyState = WebSocket.CLOSED;
        this.eventTarget.dispatchEvent(new CustomEvent('close'));
      } else {
        this.readyState = WebSocket.CONNECTING;
        var e = new CustomEvent('connecting');
        e.code = event.code;
        e.reason = event.reason;
        e.wasClean = event.wasClean;
        this.eventTarget.dispatchEvent(e);
        if (!reconnectAttempt && !this.timedOut) {
          if (this.debug || ReconnectingWebSocket.debugAll) {
            console.debug('ReconnectingWebSocket', 'onclose', this.url);
          }
          this.eventTarget.dispatchEvent(new CustomEvent('close'));
        }

        var timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts);
        setTimeout(
          function() {
            this.reconnectAttempts++;
            this.open(true);
          },
          timeout > this.maxReconnectInterval ? this.maxReconnectInterval : timeout
        );
      }
    };
    this.ws.onmessage = function(event) {
      if (this.debug || ReconnectingWebSocket.debugAll) {
        console.debug('ReconnectingWebSocket', 'onmessage', this.url, event.data);
      }
      var e = new CustomEvent('message');
      e.data = event.data;
      this.eventTarget.dispatchEvent(e);
    };
    this.ws.onerror = function(event) {
      if (this.debug || ReconnectingWebSocket.debugAll) {
        console.debug('ReconnectingWebSocket', 'onerror', this.url, event);
      }
      this.eventTarget.dispatchEvent(new CustomEvent('error'));
    };
  }

  /**
   * Transmits data to the server over the WebSocket connection.
   *
   * @param data a text string, ArrayBuffer or Blob to send to the server.
   */
  send(data) {
    if (this.ws) {
      if (this.debug || ReconnectingWebSocket.debugAll) {
        console.debug('ReconnectingWebSocket', 'send', this.url, data);
      }
      return this.ws.send(data);
    } else {
      throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
    }
  }

  /**
   * Closes the WebSocket connection or connection attempt, if any.
   * If the connection is already CLOSED, this method does nothing.
   */
  close(code, reason) {
    // Default CLOSE_NORMAL code
    if (typeof code == 'undefined') {
      code = 1000;
    }
    this.forcedClose = true;
    if (this.ws) {
      this.ws.close(code, reason);
    }
  }

  /**
   * Additional public API method to refresh the connection if still open (close, re-open).
   * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
   */
  refresh() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

/**
 * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
 * this indicates that the connection is ready to send and receive data.
 */
ReconnectingWebSocket.prototype.onopen = function(event) {};
/** An event listener to be called when the WebSocket connection's readyState changes to CLOSED. */
ReconnectingWebSocket.prototype.onclose = function(event) {};
/** An event listener to be called when a connection begins being attempted. */
ReconnectingWebSocket.prototype.onconnecting = function(event) {};
/** An event listener to be called when a message is received from the server. */
ReconnectingWebSocket.prototype.onmessage = function(event) {};
/** An event listener to be called when an error occurs. */
ReconnectingWebSocket.prototype.onerror = function(event) {};

/**
 * Whether all instances of ReconnectingWebSocket should log debug messages.
 * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
 */
ReconnectingWebSocket.debugAll = false;

ReconnectingWebSocket.CONNECTING = WebSocket.CONNECTING;
ReconnectingWebSocket.OPEN = WebSocket.OPEN;
ReconnectingWebSocket.CLOSING = WebSocket.CLOSING;
ReconnectingWebSocket.CLOSED = WebSocket.CLOSED;

export default ReconnectingWebSocket;
