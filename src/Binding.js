export default class Binding {

    constructor(target, pathTarget, pathData, rerender, onSuccess)
    {
        this.target = target;
        this.pathTarget = pathTarget.split('.');
        this.pathData = pathData.split('.');
        this.callback = onSuccess;
        this.rerender = rerender;
    }

    fire(data) {
        let self = this;
        let value = this.getData(data);
        let obj = this.target.state;

        if (this.pathTarget.length === 1) {
            this.target.setState((prv) => {
              obj[self.pathTarget[0]] = value

              // if(this.rerender)//TODO
              // {
                  return prv;
              // }

            }, self.callback);
        } else {
            for (let i = 0; i < this.pathTarget.length - 1; i++) {
                obj = obj[this.pathTarget[i]];
            }
            this.target.setState(function (prv) {
                obj[self.pathTarget[self.pathTarget.length - 1]] = value;

                // if(this.rerender)//TODO
                // {
                    return prv;
                // }
            }, self.callback);
        }
    }

    getData(value) {
        this.pathData.map(function (data)
        {
            for (let i in value) {
                if (i == data) {
                    value = value[data];
                }
            }

          return;
        });

        return value;
    }
};