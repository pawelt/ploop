let _Promise = Promise;

module.exports = {
    getPromise: function ()             { return _Promise;  },
    setPromise: function (promiseImpl)  { _Promise = promiseImpl;  },
};
