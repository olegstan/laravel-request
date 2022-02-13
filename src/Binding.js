export default class Binding
{
  /**
   *
   * @param target
   * @param pathTarget
   * @param pathData
   * @param onSuccess
   */
    constructor(target, pathTarget, pathData, onSuccess)
    {
        this.target = target;
        this.pathTarget = pathTarget.split('.');
        this.pathData = pathData.split('.');
        this.callback = onSuccess;
    }

  /**
   *
   * @param data
   */
  fire(data)
    {
        let self = this;
        let value = this.getData(data);

        if (this.pathTarget.length === 1) {
            this.target.setState({[self.pathTarget[0]]: value}, self.callback);
        } else {
            let obj = this.target.state;
            for (let i = 0; i < this.pathTarget.length - 1; i++) {
                obj = obj[this.pathTarget[i]];
            }
            this.target.setState(function (prv) {
                obj[self.pathTarget[self.pathTarget.length - 1]] = value;
                return prv;
            }, self.callback);
        }
    }

  /**
   *
   * @param value
   * @returns {*}
   */
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