const moment =require('moment')
function createdAt(schema)  {
  schema.plugin(require('mongoose-autopopulate'));
      schema.pre("save", function (next) {
      if (this.isNew) {
        this.createdAt = moment().valueOf();
        if (!this.id) this.id = this._id.toString();
        else this._id = this.id;
      } else this.updatedAt = moment().valueOf();
    next()});
  };
   module.exports ={createdAt}