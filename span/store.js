const store = {
  callbacks: [],
  state: {
    u: [1, 0, 0],
    v: [0, 1, 0]
  },
  setState(stateOrCallback) {
    if (typeof stateOrCallback === "function") {
      this.state = Object.assign({}, this.state, stateOrCallback(this.state));
    } else {
      this.state = Object.assign({}, this.state, stateOrCallback);
    }
    for (const cb of this.callbacks) {
      cb(this.state);
    }
  },
  subscribe(cb) {
    this.callbacks.push(cb);

    // function to remove subscription
    return () => {
      const index = this.callbacks.indexOf(cb);
      if (index !== -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }
};
